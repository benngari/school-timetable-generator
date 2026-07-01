import Papa from 'papaparse';
import { uid } from './id.js';

export function downloadCSV(filename, rows) {
  const csv = Papa.unparse(rows);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function findOrCreate(list, name, makeNew) {
  const found = list.find((x) => x.name.trim().toLowerCase() === name.trim().toLowerCase());
  if (found) return found;
  const created = makeNew();
  list.push(created);
  return created;
}

export function parseCSVFile(file) {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (res) => resolve(res.data),
      error: reject,
    });
  });
}

export function importClasses(rows, currentClasses) {
  const classes = [...currentClasses];
  rows.forEach((row) => {
    const name = (row.name || row.class || row.Class || '').trim();
    if (!name) return;
    findOrCreate(classes, name, () => ({ id: uid('c'), name }));
  });
  return classes;
}

export function importSubjects(rows, currentSubjects) {
  const subjects = [...currentSubjects];
  rows.forEach((row) => {
    const name = (row.name || row.subject || row.Subject || '').trim();
    if (!name) return;
    const abbr = (row.abbr || row.abbreviation || row.Abbr || '').trim().toUpperCase();
    const existing = subjects.find((s) => s.name.trim().toLowerCase() === name.toLowerCase());
    if (existing) {
      if (abbr) existing.abbr = abbr;
    } else {
      subjects.push({ id: uid('s'), name, abbr: abbr || name.slice(0, 4).toUpperCase() });
    }
  });
  return subjects;
}

export function importTeachers(rows, currentTeachers) {
  const teachers = [...currentTeachers];
  rows.forEach((row) => {
    const name = (row.name || row.teacher || row.Teacher || '').trim();
    if (!name) return;
    findOrCreate(teachers, name, () => ({ id: uid('t'), name, unavailable: [] }));
  });
  return teachers;
}

// Assignments CSV columns: class, subject, teacher, periods_per_week, double_periods
// Missing classes/subjects/teachers referenced by name are auto-created.
export function importAssignments(rows, state) {
  const classes = [...state.classes];
  const subjects = [...state.subjects];
  const teachers = [...state.teachers];
  const newAssignments = [];

  rows.forEach((row) => {
    const className = (row.class || row.Class || '').trim();
    const subjectName = (row.subject || row.Subject || '').trim();
    const teacherName = (row.teacher || row.Teacher || '').trim();
    const ppw = Number(row.periods_per_week || row.periodsPerWeek || row.Periods || 1);
    const dbl = Number(row.double_periods || row.doublePeriods || 0);
    if (!className || !subjectName || !teacherName) return;

    const cls = findOrCreate(classes, className, () => ({ id: uid('c'), name: className }));
    const subj = findOrCreate(subjects, subjectName, () => ({
      id: uid('s'),
      name: subjectName,
      abbr: subjectName.slice(0, 4).toUpperCase(),
    }));
    const teach = findOrCreate(teachers, teacherName, () => ({ id: uid('t'), name: teacherName, unavailable: [] }));

    newAssignments.push({
      id: uid('a'),
      classId: cls.id,
      subjectId: subj.id,
      teacherId: teach.id,
      periodsPerWeek: ppw || 1,
      doublePeriods: dbl || 0,
    });
  });

  return { classes, subjects, teachers, newAssignments };
}

export const TEMPLATES = {
  classes: [{ name: 'Form 1S' }, { name: 'Form 1E' }],
  subjects: [{ name: 'Mathematics', abbr: 'MAT' }, { name: 'English', abbr: 'ENG' }],
  teachers: [{ name: 'J. Mwangi' }, { name: 'A. Wanjiru' }],
  assignments: [
    { class: 'Form 1S', subject: 'Mathematics', teacher: 'J. Mwangi', periods_per_week: 5, double_periods: 0 },
    { class: 'Form 1S', subject: 'Agriculture', teacher: 'F. Njoroge', periods_per_week: 3, double_periods: 1 },
  ],
};
