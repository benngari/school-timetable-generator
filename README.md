# Shule Timetable School Timetable Generator

A React + Vite app for generating clash-free class, teacher, and whole-school
timetables for Kenyan primary, junior school (JSS), and secondary schools —
with Excel and PDF/print export.

## Features

- **Primary / JSS / Secondary** subject templates (CBC & 8-4-4), fully editable
- Custom **days and period structure** (breaks, lunch, any number of periods)
- **Classes & streams** (bulk-add e.g. "Form 1" + "S,E,N")
- **Subjects**, **teachers**, and **assignments** (class + subject → teacher, periods/week)
- **Double periods**  schedule consecutive back-to-back lessons for PE, science
  practicals, agriculture, etc.
- **Teacher unavailability**  block specific day/period slots per teacher
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
  Print / Save as PDF via the browser print dialog  your period structure automatically.
