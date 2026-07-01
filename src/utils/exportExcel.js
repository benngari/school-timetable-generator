import * as XLSX from 'xlsx';

function cellLabel(cell, subjById) {
  if (!cell) return '';
  if (cell.reserved) return cell.abbr || cell.label || '';
  return subjById[cell.subjectId]?.abbr || subjById[cell.subjectId]?.name || '';
}

export function classSheetAOA(ctx, classId) {
  const { schoolName, days, periods, subjById, classById, cellFor } = ctx;
  const cls = classById[classId];
  const header = ['Day', ...periods.map((p) => (p.type === 'lesson' ? `${p.label} (${p.start}-${p.end})` : p.label))];
  const rows = [header];
  days.forEach((day) => {
    const row = [day];
    periods.forEach((p) => {
      if (p.type !== 'lesson') {
        row.push(p.label);
        return;
      }
      row.push(cellLabel(cellFor(classId, day, p.id), subjById));
    });
    rows.push(row);
  });
  return [[`${schoolName} — Class Timetable: ${cls?.name || ''}`], [], ...rows];
}

export function teacherSheetAOA(ctx, teacherId) {
  const { schoolName, days, periods, subjById, classById, teacherById, teacherCellFor } = ctx;
  const t = teacherById[teacherId];
  const header = ['Day', ...periods.map((p) => (p.type === 'lesson' ? `${p.label} (${p.start}-${p.end})` : p.label))];
  const rows = [header];
  days.forEach((day) => {
    const row = [day];
    periods.forEach((p) => {
      if (p.type !== 'lesson') {
        row.push(p.label);
        return;
      }
      const cell = teacherCellFor(teacherId, day, p.id);
      if (!cell) {
        row.push('');
      } else if (cell.reserved) {
        row.push(cell.abbr || cell.label || '');
      } else {
        row.push(`${subjById[cell.subjectId]?.abbr || ''} / ${classById[cell.classId]?.name || ''}`);
      }
    });
    rows.push(row);
  });
  return [[`${schoolName} — Teacher Timetable: ${t?.name || ''}`], [], ...rows];
}

export function masterAOA(ctx, mode) {
  const { schoolName, days, lessonPeriods, subjById, classById, teacherById, classes, teachers, cellFor, teacherCellFor } = ctx;
  const cols = [];
  days.forEach((day) => lessonPeriods.forEach((p) => cols.push({ day, p })));
  const header = ['Name', ...cols.map((c) => `${c.day} P${c.p.label}`)];
  const rows = [header];

  if (mode === 'classes') {
    classes.forEach((c) => {
      const row = [c.name];
      cols.forEach(({ day, p }) => row.push(cellLabel(cellFor(c.id, day, p.id), subjById)));
      rows.push(row);
    });
  } else {
    teachers.forEach((t) => {
      const row = [t.name];
      cols.forEach(({ day, p }) => {
        const cell = teacherCellFor(t.id, day, p.id);
        if (!cell) row.push('');
        else if (cell.reserved) row.push(cell.abbr || cell.label || '');
        else row.push(`${subjById[cell.subjectId]?.abbr || ''}-${classById[cell.classId]?.name || ''}`);
      });
      rows.push(row);
    });
  }

  return [[`${schoolName} — ${mode === 'classes' ? 'Whole School Class' : 'Whole School Teacher'} Master Grid`], [], ...rows];
}

export function downloadWorkbook(sheets, filename) {
  const wb = XLSX.utils.book_new();
  sheets.forEach(({ name, aoa }) => {
    const ws = XLSX.utils.aoa_to_sheet(aoa);
    XLSX.utils.book_append_sheet(wb, ws, name.slice(0, 31));
  });
  XLSX.writeFile(wb, filename);
}

export function exportClassExcel(ctx, classId) {
  const name = ctx.classById[classId]?.name || 'class';
  downloadWorkbook([{ name, aoa: classSheetAOA(ctx, classId) }], `${name.replace(/\s+/g, '_')}_timetable.xlsx`);
}

export function exportTeacherExcel(ctx, teacherId) {
  const name = ctx.teacherById[teacherId]?.name || 'teacher';
  downloadWorkbook([{ name, aoa: teacherSheetAOA(ctx, teacherId) }], `${name.replace(/\s+/g, '_')}_timetable.xlsx`);
}

export function exportFullWorkbook(ctx) {
  const sheets = [];
  sheets.push({ name: 'School Master (Classes)', aoa: masterAOA(ctx, 'classes') });
  sheets.push({ name: 'School Master (Teachers)', aoa: masterAOA(ctx, 'teachers') });
  ctx.classes.forEach((c) => sheets.push({ name: c.name, aoa: classSheetAOA(ctx, c.id) }));
  ctx.teachers.forEach((t) => sheets.push({ name: t.name, aoa: teacherSheetAOA(ctx, t.id) }));
  downloadWorkbook(sheets, `${ctx.schoolName.replace(/\s+/g, '_')}_full_timetable.xlsx`);
}
