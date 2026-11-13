/**
 * CHRISCO DIGITAL ACADEMY — Google Sheets backend
 *
 * Paste this whole file into the Sheet's Extensions > Apps Script editor, then
 * deploy it as a Web App (Execute as: Me, Who has access: Anyone) and copy the
 * /exec URL into the frontend as NEXT_PUBLIC_GOOGLE_SCRIPT_WEBAPP_URL.
 *
 * Every read and every form submission on the site goes through this one file.
 * There is no database server, no ORM, and no API layer besides this.
 *
 *   GET  ?sheet=Contacts            -> { ok, sheet, rows: [ {column: value} ], count }
 *   GET  ?sheet=Enrolments&email=x  -> rows filtered to that email
 *   POST { sheet, action, ...fields } -> appends a row, returns { ok, reference_code, row }
 *
 * Because Apps Script cannot answer a CORS preflight, the frontend posts JSON
 * with Content-Type: text/plain. That is deliberate, not a mistake.
 */

// ---------------------------------------------------------------- configuration

/** The spreadsheet this Web App owns. Leave blank to use the container-bound Sheet. */
var SPREADSHEET_ID = ""

/**
 * Tab names and their column order. The header row is written automatically on
 * first use, so a fresh Sheet needs no setup beyond creating the tabs.
 */
var SCHEMA = {
  Contacts: [
    "id", "created_at", "action", "reference_code", "name", "email", "phone",
    "subject", "message", "track", "status", "auto_reply_subject", "auto_reply_from"
  ],
  Enrolments: [
    "id", "created_at", "reference_code", "user_id", "course_title", "course_id",
    "category", "level", "applicant_name", "applicant_email", "applicant_phone",
    "status", "progress", "completed_modules", "updated_at"
  ],
  Learners: [
    "id", "created_at", "name", "email", "password_hash", "salt", "avatar_url",
    "ref", "role", "status"
  ],
  TutorApplications: [
    "id", "created_at", "action", "reference_code", "name", "email", "phone",
    "expertise", "experience", "availability", "message", "status"
  ],
  Newsletter: ["id", "created_at", "email", "source", "status"],
  Progress: [
    "id", "updated_at", "user_id", "course_title", "progress", "completed_modules"
  ],
  Affiliates: [
    "id", "created_at", "code", "name", "email", "user_id", "clicks", "signups", "status"
  ],
  BookReaders: [
    "id", "created_at", "action", "reference_code", "name", "email", "course_title", "status"
  ],
  SavedBooks: ["id", "updated_at", "email", "saved_books"],
  Courses: ["id", "title", "category", "level", "summary", "image_url", "published"]
};

/** Documents the site links to. Fill these in and they are served by the API. */
var DOCS_AND_SLIDES = {
  orientationDeckId: "1PZLmMuF77_TlX6aPZqmO-7cbmv_OaxFHtNCsbNWvd4k",
  curriculumDocId: "",
  learnerHandbookDocId: "",
  tutorsBriefDocId: ""
};

/** Who gets told when someone submits a form. */
var NOTIFY_EMAIL = "chriscoyouthaflame2025@gmail.com";

// ------------------------------------------------------------------- entrypoints

function doGet(e) {
  try {
    var params = (e && e.parameter) || {};
    var sheetName = params.sheet;

    if (!sheetName) {
      return json({
        ok: true,
        service: "CHRISCO Digital Academy Sheets API",
        sheets: Object.keys(SCHEMA),
        docs: describeDocs()
      });
    }

    var rows = readSheet(sheetName);

    // Any query parameter that matches a column filters the rows.
    var filterKeys = Object.keys(params).filter(function (k) {
      return k !== "sheet" && k !== "limit" && k !== "callback";
    });
    if (filterKeys.length) {
      rows = rows.filter(function (row) {
        return filterKeys.every(function (k) {
          return String(row[k] || "").toLowerCase() === String(params[k]).toLowerCase();
        });
      });
    }

    var limit = parseInt(params.limit, 10);
    if (!isNaN(limit) && limit > 0) rows = rows.slice(-limit);

    return json({ ok: true, sheet: sheetName, count: rows.length, rows: rows });
  } catch (err) {
    return json({ ok: false, error: String(err && err.message ? err.message : err) });
  }
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    var body = parseBody(e);
    var sheetName = body.sheet;
    var action = body.action || "create";

    if (!sheetName) return json({ ok: false, error: "Missing sheet name." });
    if (!SCHEMA[sheetName]) return json({ ok: false, error: "Unknown sheet: " + sheetName });

    // Authentication is handled separately: it must not append blindly.
    if (sheetName === "Learners" && (action === "signup" || action === "signin" || action === "auth")) {
      return handleAuth(body, action);
    }

    lock.waitLock(20000);
    var result = appendRow(sheetName, body);
    lock.releaseLock();

    notify(sheetName, body, result.row);
    return json({ ok: true, sheet: sheetName, reference_code: result.row.reference_code || "", row: result.row });
  } catch (err) {
    try { lock.releaseLock(); } catch (ignored) {}
    return json({ ok: false, error: String(err && err.message ? err.message : err) });
  }
}

// ------------------------------------------------------------------ sheet access

function spreadsheet() {
  return SPREADSHEET_ID ? SpreadsheetApp.openById(SPREADSHEET_ID) : SpreadsheetApp.getActiveSpreadsheet();
}

function getSheet(name) {
  var ss = spreadsheet();
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(SCHEMA[name]);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, SCHEMA[name].length).setFontWeight("bold");
  } else if (sheet.getLastRow() === 0) {
    sheet.appendRow(SCHEMA[name]);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

/** Every row as a plain object keyed by the Sheet's own header row. */
function readSheet(name) {
  var sheet = getSheet(name);
  var values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];

  var headers = values[0].map(function (h) { return String(h).trim(); });
  var out = [];
  for (var r = 1; r < values.length; r += 1) {
    var line = values[r];
    if (!line.join("").trim()) continue;
    var record = {};
    for (var c = 0; c < headers.length; c += 1) {
      var value = line[c];
      record[headers[c]] = value instanceof Date ? value.toISOString() : value;
    }
    out.push(record);
  }
  return out;
}

/**
 * Append one object as a row. The Sheet's own header row decides the column
 * order: if someone renames or reorders a column, writes still land correctly.
 * SCHEMA is only used to create a missing tab.
 */
function appendRow(name, body) {
  var sheet = getSheet(name);
  var headers = sheetHeaders(sheet, name);
  var row = {};

  headers.forEach(function (key) {
    var value = body[key];
    if (value === undefined || value === null) value = "";
    if (Array.isArray(value)) value = value.join(", ");
    row[key] = value;
  });

  if (!row.id) row.id = Utilities.getUuid();
  if (!row.created_at && headers.indexOf("created_at") >= 0) row.created_at = new Date().toISOString();
  if (!row.updated_at && headers.indexOf("updated_at") >= 0) row.updated_at = new Date().toISOString();
  if (!row.reference_code && headers.indexOf("reference_code") >= 0) {
    row.reference_code = makeReference(body.action || name);
  }

  // Upsert on a natural key, so progress and saved-book writes update in place.
  var keyColumns = { Progress: "user_id+course_title", SavedBooks: "email", Affiliates: "code" };
  var keySpec = keyColumns[name];
  var existingIndex = -1;
  if (keySpec) {
    var keys = keySpec.split("+");
    var all = readSheet(name);
    for (var i = 0; i < all.length; i += 1) {
      var matches = keys.every(function (k) {
        return String(all[i][k] || "").toLowerCase() === String(row[k] || "").toLowerCase();
      });
      if (matches) { existingIndex = i + 2; break; } // +2 for header row and 0-based index
    }
  }

  var values = headers.map(function (k) { return row[k]; });

  if (existingIndex > 0) {
    sheet.getRange(existingIndex, 1, 1, values.length).setValues([values]);
    row.updated_at = row.updated_at || new Date().toISOString();
  } else {
    sheet.appendRow(values);
  }

  return { row: row, updated: existingIndex > 0 };
}

/** The live header row, falling back to the schema for a brand-new tab. */
function sheetHeaders(sheet, name) {
  if (sheet.getLastRow() === 0) return SCHEMA[name];
  var live = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), 1)).getValues()[0];
  var headers = live.map(function (h) { return String(h).trim(); }).filter(Boolean);
  return headers.length ? headers : SCHEMA[name];
}

// ------------------------------------------------------------ authentication

function handleAuth(body, action) {
  var email = String(body.email || "").trim().toLowerCase();
  var password = String(body.password || "");
  if (!email || !password) return json({ ok: false, error: "Email and password are required." });

  var learners = readSheet("Learners");
  var found = null;
  for (var i = 0; i < learners.length; i += 1) {
    if (String(learners[i].email || "").toLowerCase() === email) { found = learners[i]; break; }
  }

  if (action === "signin") {
    if (!found) return json({ ok: false, error: "No account found for that email. Please create one." });
    if (String(found.password_hash) !== hashPassword(password, String(found.salt))) {
      return json({ ok: false, error: "Incorrect password. Please try again." });
    }
    return json({ ok: true, learner: publicLearner(found) });
  }

  // A sign-up form must never silently log someone into an existing account.
  if (action === "signup" && found) {
    return json({
      ok: false,
      error: "An account with this email already exists. Please sign in."
    });
  }

  // action "auth" (the Google bridge) creates on first sight, otherwise verifies.
  if (found) {
    if (String(found.password_hash) !== hashPassword(password, String(found.salt))) {
      return json({ ok: false, error: "Incorrect password. Please try again." });
    }
    return json({ ok: true, learner: publicLearner(found) });
  }

  var salt = Utilities.getUuid();
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var result = appendRow("Learners", {
      name: body.name || email.split("@")[0],
      email: email,
      password_hash: hashPassword(password, salt),
      salt: salt,
      avatar_url: body.avatar_url || "",
      ref: body.ref || "",
      role: "learner",
      status: "active",
      created_at: new Date().toISOString()
    });
    lock.releaseLock();
    return json({ ok: true, learner: publicLearner(result.row) });
  } catch (err) {
    try { lock.releaseLock(); } catch (ignored) {}
    return json({ ok: false, error: String(err.message || err) });
  }
}

/** Never return the hash or salt to the browser. */
function publicLearner(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    avatar_url: row.avatar_url || "",
    ref: row.ref || "",
    role: row.role || "learner",
    user_metadata: { name: row.name, full_name: row.name, auth_provider: "google" }
  };
}

function hashPassword(password, salt) {
  var digest = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    String(password) + "::" + String(salt),
    Utilities.Charset.UTF_8
  );
  return digest.map(function (b) {
    var v = (b < 0 ? b + 256 : b).toString(16);
    return v.length === 1 ? "0" + v : v;
  }).join("");
}

function makeReference(action) {
  var prefix = {
    contact: "MSG", course_application: "APP", tutor_application: "TUT",
    newsletter_signup: "NEW", merch_order: "ORD", book_download_registration: "LIB",
    signup_welcome: "WEL", google_auth: "WEL"
  }[action] || "REF";
  return prefix + "-" + Math.random().toString(36).substring(2, 8).toUpperCase();
}

// ------------------------------------------------------- Docs and Slides links

/**
 * The Sheet is the source of truth for content too: rows in Courses and
 * Resources can point at Google Docs and Slides, and the API resolves them to
 * view / embed URLs so the frontend never hand-codes document ids.
 */
function describeDocs() {
  var out = {};

  if (DOCS_AND_SLIDES.orientationDeckId) {
    out.orientationDeck = docLinks(DOCS_AND_SLIDES.orientationDeckId, "slides");
  }
  if (DOCS_AND_SLIDES.curriculumDocId) out.curriculum = docLinks(DOCS_AND_SLIDES.curriculumDocId, "docs");
  if (DOCS_AND_SLIDES.learnerHandbookDocId) out.learnerHandbook = docLinks(DOCS_AND_SLIDES.learnerHandbookDocId, "docs");
  if (DOCS_AND_SLIDES.tutorsBriefDocId) out.tutorsBrief = docLinks(DOCS_AND_SLIDES.tutorsBriefDocId, "docs");

  return out;
}

function docLinks(id, kind) {
  if (!id) return null;
  var base = kind === "slides"
    ? "https://docs.google.com/presentation/d/"
    : "https://docs.google.com/document/d/";
  return {
    id: id,
    view_url: base + id + "/edit",
    embed_url: kind === "slides"
      ? "https://docs.google.com/presentation/d/" + id + "/embed?start=false&loop=false&delayms=5000"
      : "https://docs.google.com/document/d/" + id + "/preview",
    export_pdf_url: kind === "slides"
      ? "https://docs.google.com/presentation/d/" + id + "/export/pdf"
      : "https://docs.google.com/document/d/" + id + "/export?format=pdf"
  };
}

/**
 * Optional: rebuild a Docs document from Sheet rows, or add a slide per course.
 * Run these from the editor (Run > buildCurriculumDoc) after editing the Sheet.
 */
function buildCurriculumDoc() {
  var docId = DOCS_AND_SLIDES.curriculumDocId;
  if (!docId) throw new Error("Set DOCS_AND_SLIDES.curriculumDocId first.");

  var doc = DocumentApp.openById(docId);
  var body = doc.getBody();
  body.clear();

  body.appendParagraph("CHRISCO Digital Academy — Curriculum")
    .setHeading(DocumentApp.ParagraphHeading.TITLE);

  var courses = readSheet("Courses");
  courses.forEach(function (course) {
    body.appendParagraph(course.title).setHeading(DocumentApp.ParagraphHeading.HEADING2);
    if (course.category || course.level) {
      body.appendParagraph([course.category, course.level].filter(Boolean).join(" · "))
        .setItalic(true);
    }
    if (course.summary) body.appendParagraph(course.summary);
  });

  doc.saveAndClose();
  return "Curriculum document updated with " + courses.length + " courses.";
}

function buildOrientationSlides() {
  var id = DOCS_AND_SLIDES.orientationDeckId;
  if (!id) throw new Error("Set DOCS_AND_SLIDES.orientationDeckId first.");

  var deck = SlidesApp.openById(id);
  var courses = readSheet("Courses");

  var slide = deck.appendSlide(SlidesApp.PredefinedLayout.TITLE_AND_BODY);
  slide.getPlaceholder(SlidesApp.PlaceholderType.TITLE).asShape().setText("Course Catalogue");
  slide.getPlaceholder(SlidesApp.PlaceholderType.BODY).asShape()
    .setText(courses.map(function (c) { return c.title; }).join("\n"));

  return "Added a catalogue slide with " + courses.length + " courses.";
}

// ------------------------------------------------------------------ notification

function notify(sheetName, body, row) {
  if (!NOTIFY_EMAIL) return;
  var watched = { Contacts: "New message", TutorApplications: "New tutor application", Enrolments: "New course application" };
  var subject = watched[sheetName];
  if (!subject) return;

  var lines = Object.keys(row).map(function (k) {
    var v = row[k];
    return k + ": " + (v instanceof Date ? v.toISOString() : v);
  });

  try {
    MailApp.sendEmail({
      to: NOTIFY_EMAIL,
      replyTo: body.email || NOTIFY_EMAIL,
      subject: "[CHRISCO] " + subject + " — " + (row.reference_code || ""),
      body: lines.join("\n")
    });
  } catch (err) {
    // Mail quota is not worth failing a saved row over.
  }
}

// ------------------------------------------------------------------------ utils

function parseBody(e) {
  if (!e) return {};
  if (e.postData && e.postData.contents) {
    try { return JSON.parse(e.postData.contents); } catch (err) { return e.parameter || {}; }
  }
  return e.parameter || {};
}

function json(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Run once from the editor to create every tab and its header row.
 */
function setupSheets() {
  Object.keys(SCHEMA).forEach(function (name) { getSheet(name); });
  return "Created: " + Object.keys(SCHEMA).join(", ");
}
