# Adding a New Course to CHRISCO Digital Academy

Courses live in `app/data/courses.js`. Adding a new one takes 2 minutes.

## Step 1: Add a course object

Open `app/data/courses.js` and add a new object to the `courses` array:

```js
{
 id: 12,                                     // increment from the last id (keep unique)
 icon: "briefcase",                          // pick an icon name from app/components/Icon.js
 title: "Your Course Title",
 img: "/images/cat-marketing.jpg",           // pick from public/images/ or add your own
 category: "Marketing",                      // must match one of the categories in categories[] (or add new)
 level: "Beginner",                          // "Beginner" or "Intermediate"
 duration: "8 Weeks",
 rating: "4.9",
 students: "25+",
 color: ["#2563eb", "#7c3aed"],              // two hex colors, used for gradient header
 desc: "One or two sentence sales pitch for the course.",
 syllabus: [
   "Chapter 1 title",                        // exactly 8 chapters (progress math divides by 8)
   "Chapter 2 title",
   "Chapter 3 title",
   "Chapter 4 title",
   "Chapter 5 title",
   "Chapter 6 title",
   "Chapter 7 title",
   "Chapter 8 title",
 ],
 for: "Who is this course for? One sentence.",
 download: "/courses/your-course.html",      // optional; add a matching HTML in public/courses/ if you want
},
```

### Available `icon` names (from `app/components/Icon.js`)
- Navigation: `rocket`, `search`, `menu`, `x`, `plus`, `chevron-left`, `chevron-right`, `arrow-up`, `grid`, `layers`
- Actions: `play`, `download`, `send`, `save`, `clipboard`, `check`, `checkCircle`, `book`
- Learning: `cap`, `trophy`, `medal`, `star`, `bolt`, `flame`, `calendar`, `clock`, `bulb`, `target`
- People/Social: `users`, `heart`, `message`, `chat`, `robot`, `pin`, `phone`, `mail`
- Subjects: `code`, `braces`, `palette`, `clapper`, `chart`, `bars`, `pen`, `feather`, `tshirt`, `briefcase`, `cash`, `smartphone`, `cpu`, `wrench`, `mic`, `video`, `sparkles`, `globe`, `shield`, `laptop`, `monitor`, `whatsapp`

### Available `category` names
If you add a new category, also add it to the `categories` array at the top of `courses.js` with an icon.

## Step 2: Add a category (if needed)

```js
export const categories = [
 { name: "Marketing", icon: "chart" },
 { name: "Coding", icon: "code" },
 { name: "Writing", icon: "pen" },
 { name: "Design", icon: "palette" },
 { name: "Video", icon: "clapper" },
 { name: "Career", icon: "rocket" },
 // add here
]
```

## Step 3 (optional): Add a thumbnail image

Drop a 1600x900 JPG into `public/images/` and point `img:` at it. You can reuse existing `cat-*.jpg` images:
- `/images/cat-coding.jpg`
- `/images/cat-design.jpg`
- `/images/cat-marketing.jpg`
- `/images/cat-video.jpg`
- `/images/cat-writing.jpg`
- `/images/bg-cta.jpg`, `/images/bg-courses.jpg`, `/images/bg-home.jpg`, `/images/workspace.jpg`

## Step 4 (optional): Add a downloadable course outline HTML

Place an HTML file in `public/courses/your-course.html` (copy an existing one as a template) and set `download: "/courses/your-course.html"`. The download button on the course card and in the modal will open it.

## Step 5 (optional): Add more Bible verses

Edit `app/data/verses.js` and append to the `VERSES` array. Each verse needs: `ref`, `text`, `theme`, `videoLabel`, `videoUrl`. Verses rotate deterministically by day of year.

## That is it

Save, run `npm run dev` to preview, then `git add -A && git commit -m "Add X course" && git push`. Vercel will auto-deploy.

### Changing the number of lessons per course
By default progress math divides by 8 (one per chapter). If you want variable chapter counts, change the `8` in `app/GamificationContext.js` inside `trackLessonComplete` to use a per-course total (look for the line `updated.progress = Math.min(100, Math.round(((updated.lessonsCompleted || 0) / 8) * 100))`).
