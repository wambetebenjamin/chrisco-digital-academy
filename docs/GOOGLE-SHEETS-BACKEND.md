# Google Sheets as the database

The site no longer uses a database server, an ORM, or a JSON store. There is no
MySQL, MongoDB or PostgreSQL anywhere in this repository, and no `app/api/*`
route writes data.

**The Google Sheet is the source of truth.** One Google Apps Script Web App sits
in front of it, and every page read and every form submission on the site goes
through that single URL.

```
Browser (Next.js on Render)
        │  fetch()  GET  ?sheet=Enrolments&email=...
        │  fetch()  POST { sheet, action, ...fields }
        ▼
Google Apps Script Web App  (Code.gs in this folder)
        │
        ├── Google Sheet      ← every row lives here
        ├── Google Docs       ← curriculum, learner handbook, tutor brief
        └── Google Slides     ← orientation deck, catalogue slides
```

---

## 1. What was removed

| Removed | Why |
| --- | --- |
| `app/supabase.js` | Supabase client, project URL and the anon key. |
| `app/api/intake/route.js` | Server route that proxied the Supabase edge function. |
| `@supabase/supabase-js` | Dependency, dropped from `package.json` and the lockfile. |
| `@emailjs/browser` | Receipts are sent by Apps Script (`MailApp`) instead of the browser. |
| Supabase calls in `app/AuthProvider.js` | `signUp`, `signInWithPassword`, `getSession`, `onAuthStateChange`, `from("profiles")`, `from("enrollments")` — all replaced by Sheet reads and writes. |
| Supabase calls in `app/lib/intakeClient.js` | The edge-function POST and query-string reads. |

What replaced them: `app/lib/googleSheets.js`, a 120-line module with exactly two
functions that touch the network — `fetchSheet()` and `submitRow()`.

## 2. What the frontend expects back

`GET` returns a plain JSON array of row objects, keyed by the Sheet's **own
header row**, newest last:

```json
{
  "ok": true,
  "sheet": "Enrolments",
  "count": 2,
  "rows": [
    { "id": "…", "created_at": "2026-02-02T09:14:00.000Z", "email": "amina@example.com",
      "course_title": "Graphic Design", "status": "active" }
  ]
}
```

Components read columns directly — `row.course_title`, `row.email` — so renaming
a header in the Sheet changes the field name in the app. Keep the headers as
listed below.

`POST` accepts the same shape and answers:

```json
{ "ok": true, "reference_code": "APP-7K2QX9", "row": { …the stored row… } }
```

## 3. Tabs and columns

Run `setupSheets()` once from the Apps Script editor and it creates all of them.

| Tab | Columns |
| --- | --- |
| `Contacts` | id, created_at, action, reference_code, name, email, phone, subject, message, track, status, auto_reply_subject, auto_reply_from |
| `Enrolments` | id, created_at, reference_code, user_id, course_title, course_id, category, level, applicant_name, applicant_email, applicant_phone, status, progress, completed_modules, updated_at |
| `Learners` | id, created_at, name, email, password_hash, salt, avatar_url, ref, role, status |
| `TutorApplications` | id, created_at, action, reference_code, name, email, phone, expertise, experience, availability, message, status |
| `Newsletter` | id, created_at, email, source, status |
| `Progress` | id, updated_at, user_id, course_title, progress, completed_modules |
| `Affiliates` | id, created_at, code, name, email, user_id, clicks, signups, status |
| `BookReaders` | id, created_at, action, reference_code, name, email, course_title, status |
| `SavedBooks` | id, updated_at, email, saved_books |
| `Courses` | id, title, category, level, summary, image_url, published |

`Progress`, `SavedBooks` and `Affiliates` **upsert** on their natural key
(`user_id + course_title`, `email`, `code`), so re-submitting updates the existing
row instead of adding a duplicate.

## 4. Deploy the Web App

1. Open the Sheet → **Extensions → Apps Script**.
2. Delete the stub, paste all of `docs/apps-script/Code.gs`, save.
3. In the editor, run `setupSheets` once and accept the permission prompt.
4. **Deploy → New deployment → Web app**:
   - *Execute as*: **Me**
   - *Who has access*: **Anyone**
5. Copy the `/exec` URL. It looks like
   `https://script.google.com/macros/s/AKfy…/exec`.
6. On Render, add the environment variable and redeploy:

   ```
   NEXT_PUBLIC_GOOGLE_SCRIPT_WEBAPP_URL=https://script.google.com/macros/s/AKfy…/exec
   ```

Until that variable is set, `isBackendConfigured` is `false`: forms show a clear
"backend not configured" message instead of silently losing data, and the site
stays browsable in preview mode.

> Re-deploying matters. Editing `Code.gs` without **Deploy → Manage deployments →
> Edit → New version** keeps serving the old code.

## 5. Endpoints the site calls

| Caller | Method | Request | Tab |
| --- | --- | --- | --- |
| `ContactForm` | POST | `{ action: "contact", name, email, phone, message }` | `Contacts` |
| `Chatbot` | POST | `{ action: "contact", … }` | `Contacts` |
| `TutorApplicationForm` | POST | `{ action: "tutor_application", expertise, experience, availability }` | `TutorApplications` |
| `CoursesExplorer` | POST | `{ action: "course_application", course_title, category, level }` | `Enrolments` |
| `Dashboard` | POST | `{ action: "course_application", … }` | `Enrolments` |
| `Shop` | POST | `{ action: "merch_order", message: "2 x P-01 …" }` | `Contacts` |
| `Footer` | POST | `{ action: "newsletter_signup", email }` | `Newsletter` |
| `AuthProvider.signUp` | POST | `{ sheet: "Learners", action: "signup", name, email, password }` | `Learners` |
| `AuthProvider.signIn` | POST | `{ sheet: "Learners", action: "signin", email, password }` | `Learners` |
| `AuthProvider.enrollCourse` | POST | `{ action: "enrol", course_title, … }` | `Enrolments` |
| `AuthProvider.getEnrollments` | GET | `?sheet=Enrolments&email=…` | `Enrolments` |
| `AuthProvider.savedBooks` | POST | `{ action: "save_books", email, saved_books }` | `SavedBooks` |
| `intakeClient.updateCourseProgress` | POST | `{ action: "update", user_id, course_title, progress }` | `Progress` |
| `intakeClient.registerAffiliate` | POST | `{ action: "register_affiliate", code, name, email }` | `Affiliates` |
| `intakeClient.fetchAcademyOverview` | GET | `?sheet=Learners`, `?sheet=Contacts&email=…` | several |

Every POST in that table is one `fetch()` inside `submitRow()`. No caller knows
the URL; it reads `GOOGLE_SCRIPT_WEBAPP_URL` from the environment.

## 6. Google Docs and Slides

`Code.gs` keeps document ids in one block and derives the links, so the app never
hard-codes them:

```js
var DOCS_AND_SLIDES = {
  orientationDeckId: "1PZLmMuF77_TlX6aPZqmO-7cbmv_OaxFHtNCsbNWvd4k",
  curriculumDocId: "",
  learnerHandbookDocId: "",
  tutorsBriefDocId: ""
};
```

`GET` with no parameters returns `docs`, each entry carrying `view_url`,
`embed_url` and `export_pdf_url` for that document.

Two generator helpers are included and are run **from the editor**, never from
the website:

- `buildCurriculumDoc()` rewrites the curriculum Doc from the `Courses` tab —
  one heading per course with its category, level and summary.
- `buildOrientationSlides()` appends a catalogue slide to the deck, one line per
  published course.

That is the loop the request asked for: edit the Sheet → run the generator → the
Doc and the Slides deck carry the change.

## 7. Sessions

The old provider relied on a real Supabase session. With a Sheet backend there is
no auth server, so the session is the browser's own record of who signed in, and
the `Learners` row is the durable record of who exists. Passwords are SHA-256'd
with a per-user salt inside Apps Script and the hash/salt columns are never
returned to the browser.

`chrisco:preview-session` and `chrisco:preview-users` are the **only** localStorage
keys that still hold anything that could be called data. They exist because a
sign-in has to survive a page reload without a cookie server; everything else —
contacts, applications, enrolments, progress, saved books, newsletter, orders —
is written to the Sheet and read back from it. If no session key survives, the
visitor is simply signed out.

## 8. Verify it end to end

```bash
# 1. does the deployment answer?
curl -L "https://script.google.com/macros/s/AKfy…/exec"

# 2. can you read a tab?
curl -L "https://script.google.com/macros/s/AKfy…/exec?sheet=Courses"

# 3. does a write land in the Sheet?
curl -L -X POST "https://script.google.com/macros/s/AKfy…/exec" \
  -H "Content-Type: text/plain;charset=utf-8" \
  -d '{"sheet":"Contacts","action":"contact","name":"Test","email":"test@example.com","message":"hello"}'
```

Then submit the contact form on Render and confirm the row appears in `Contacts`
within a second or two, with a `MSG-…` reference code.
