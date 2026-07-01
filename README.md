# Shule Timetable — School Timetable Generator

A React + Vite app for generating clash-free class, teacher, and whole-school
timetables for Kenyan primary, junior school (JSS), and secondary schools —
with Excel and PDF/print export.

## Features

- **Primary / JSS / Secondary** subject templates (CBC & 8-4-4), fully editable
- Custom **days and period structure** (breaks, lunch, any number of periods)
- **Classes & streams** (bulk-add e.g. "Form 1" + "S,E,N")
- **Subjects**, **teachers**, and **assignments** (class + subject → teacher, periods/week)
- **Double periods** — schedule consecutive back-to-back lessons for PE, science
  practicals, agriculture, etc.
- **Teacher unavailability** — block specific day/period slots per teacher
  (part-time staff, duty periods)
- **Reserved whole-school activities** — fix a slot (e.g. Games/PE on Wednesday
  afternoon) across all or selected classes, placed before regular lessons so
  it never clashes
- **CSV import/export** for bulk data entry (classes, subjects, teachers, assignments)
- **Clash-free generator**: no teacher or class double-booking, subjects spread
  across different days where possible
- **Views**: Class timetable, Teacher timetable, Whole-school master grid (for
  the staffroom wall)
- **Export**: Excel (.xlsx) per class/teacher or a single full-school workbook;
  Print / Save as PDF via the browser print dialog

## Getting started (VS Code)

1. Open this folder in VS Code.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the dev server:

   ```bash
   npm run dev
   ```

4. Open the printed local URL (usually `http://localhost:5173`) in your browser.

## Building for deployment

```bash
npm run build
```

This produces a `dist/` folder you can deploy to any static host (Netlify,
Vercel, GitHub Pages, or your school's own server) or open directly in a
browser.

## Project structure

```
src/
  main.jsx              Entry point
  App.jsx               Top-level state and wiring
  styles.css             All styling
  data/
    subjectTemplates.js  Days, default periods, Kenyan subject templates
    demoData.js           Sample data pre-loaded on first run
  utils/
    id.js                 ID generator
    generator.js          The clash-free scheduling engine
    exportExcel.js         Excel (.xlsx) export helpers
    csv.js                 CSV import/export helpers
  components/
    Sidebar.jsx, SetupTab.jsx, ClassesTab.jsx, SubjectsTab.jsx,
    TeachersTab.jsx, AssignmentsTab.jsx, ReservedTab.jsx, DataTab.jsx,
    GenerateTab.jsx, ViewTab.jsx, PrintArea.jsx
    grids/ClassGrid.jsx, TeacherGrid.jsx, MasterGrid.jsx
```

## Notes

- All data lives in memory for the current browser session — nothing is sent
  to a server. Use the CSV or Excel export buttons regularly to keep a backup;
  reloading the page resets to the sample data.
- "Print / Save as PDF" uses the browser's native print dialog in landscape —
  choose "Save as PDF" as the destination if you want a PDF file instead of a
  paper printout.
- The double-period feature only places a subject in two lesson periods that
  are physically back-to-back (no break/lunch between them), so it respects
  your period structure automatically.
