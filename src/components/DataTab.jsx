import React, { useRef, useState } from 'react';
import { downloadCSV, parseCSVFile, importClasses, importSubjects, importTeachers, importAssignments, TEMPLATES } from '../utils/csv.js';

export default function DataTab({ classes, setClasses, subjects, setSubjects, teachers, setTeachers, assignments, setAssignments, classById, subjById, teacherById }) {
  const [msg, setMsg] = useState('');
  const classFile = useRef(null);
  const subjectFile = useRef(null);
  const teacherFile = useRef(null);
  const assignFile = useRef(null);

  async function handleImport(file, kind) {
    if (!file) return;
    const rows = await parseCSVFile(file);
    if (kind === 'classes') {
      setClasses((prev) => importClasses(rows, prev));
      setMsg(`Imported ${rows.length} row(s) into Classes.`);
    } else if (kind === 'subjects') {
      setSubjects((prev) => importSubjects(rows, prev));
      setMsg(`Imported ${rows.length} row(s) into Subjects.`);
    } else if (kind === 'teachers') {
      setTeachers((prev) => importTeachers(rows, prev));
      setMsg(`Imported ${rows.length} row(s) into Teachers.`);
    } else if (kind === 'assignments') {
      const result = importAssignments(rows, { classes, subjects, teachers });
      setClasses(result.classes);
      setSubjects(result.subjects);
      setTeachers(result.teachers);
      setAssignments((prev) => [...prev, ...result.newAssignments]);
      setMsg(`Imported ${result.newAssignments.length} assignment(s) (auto-created any missing classes/subjects/teachers by name).`);
    }
  }

  return (
    <div>
      <div className="pagehead">
        <h2>Import / export data</h2>
        <p>Bring in classes, subjects, teachers, or full subject-teacher assignment lists from a spreadsheet (CSV), or export what you have for backup or editing in Excel.</p>
      </div>

      {msg && <div className="banner ok">{msg}</div>}

      <div className="grid2">
        <div className="card">
          <h3>Classes</h3>
          <p className="muted">CSV column: <code>name</code></p>
          <div className="row">
            <input ref={classFile} type="file" accept=".csv" onChange={(e) => handleImport(e.target.files[0], 'classes')} />
            <button className="btn btn-sm" onClick={() => downloadCSV('classes_template.csv', TEMPLATES.classes)}>⬇ Template</button>
            <button className="btn btn-sm btn-outline" onClick={() => downloadCSV('classes_export.csv', classes.map((c) => ({ name: c.name })))}>⬇ Export current</button>
          </div>
        </div>

        <div className="card">
          <h3>Subjects</h3>
          <p className="muted">CSV columns: <code>name, abbr</code></p>
          <div className="row">
            <input ref={subjectFile} type="file" accept=".csv" onChange={(e) => handleImport(e.target.files[0], 'subjects')} />
            <button className="btn btn-sm" onClick={() => downloadCSV('subjects_template.csv', TEMPLATES.subjects)}>⬇ Template</button>
            <button className="btn btn-sm btn-outline" onClick={() => downloadCSV('subjects_export.csv', subjects.map((s) => ({ name: s.name, abbr: s.abbr })))}>⬇ Export current</button>
          </div>
        </div>

        <div className="card">
          <h3>Teachers</h3>
          <p className="muted">CSV column: <code>name</code></p>
          <div className="row">
            <input ref={teacherFile} type="file" accept=".csv" onChange={(e) => handleImport(e.target.files[0], 'teachers')} />
            <button className="btn btn-sm" onClick={() => downloadCSV('teachers_template.csv', TEMPLATES.teachers)}>⬇ Template</button>
            <button className="btn btn-sm btn-outline" onClick={() => downloadCSV('teachers_export.csv', teachers.map((t) => ({ name: t.name })))}>⬇ Export current</button>
          </div>
        </div>

        <div className="card">
          <h3>Assignments</h3>
          <p className="muted">CSV columns: <code>class, subject, teacher, periods_per_week, double_periods</code></p>
          <div className="row">
            <input ref={assignFile} type="file" accept=".csv" onChange={(e) => handleImport(e.target.files[0], 'assignments')} />
            <button className="btn btn-sm" onClick={() => downloadCSV('assignments_template.csv', TEMPLATES.assignments)}>⬇ Template</button>
            <button
              className="btn btn-sm btn-outline"
              onClick={() =>
                downloadCSV(
                  'assignments_export.csv',
                  assignments.map((a) => ({
                    class: classById[a.classId]?.name,
                    subject: subjById[a.subjectId]?.name,
                    teacher: teacherById[a.teacherId]?.name,
                    periods_per_week: a.periodsPerWeek,
                    double_periods: a.doublePeriods || 0,
                  }))
                )
              }
            >
              ⬇ Export current
            </button>
          </div>
          <p className="muted" style={{ marginTop: 6 }}>
            Any class, subject, or teacher name not already in the app is created automatically — so you can import a whole staffing plan from one file.
          </p>
        </div>
      </div>
    </div>
  );
}
