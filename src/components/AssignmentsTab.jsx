import React, { useState } from 'react';
import { uid } from '../utils/id.js';

export default function AssignmentsTab({ classes, subjects, teachers, assignments, setAssignments, classById, subjById, teacherById }) {
  const [classId, setClassId] = useState(classes[0]?.id || '');
  const [subjectId, setSubjectId] = useState(subjects[0]?.id || '');
  const [teacherId, setTeacherId] = useState(teachers[0]?.id || '');
  const [ppw, setPpw] = useState(4);
  const [dbl, setDbl] = useState(0);

  const maxDoubles = Math.floor((Number(ppw) || 0) / 2);
  const singlesLeft = Math.max(0, (Number(ppw) || 0) - Number(dbl) * 2);

  return (
    <div>
      <div className="pagehead">
        <h2>Assignments</h2>
        <p>
          Link each class + subject to a teacher, set periods per week, and — for subjects that need consecutive double lessons (PE, sciences, agriculture
          practicals, etc.) — how many of those periods should be scheduled as double (back-to-back) sessions.
        </p>
      </div>

      <div className="card">
        <h3>Add assignment</h3>
        <div className="row">
          <div className="field">
            <label>Class</label>
            <select value={classId} onChange={(e) => setClassId(e.target.value)}>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Subject</label>
            <select value={subjectId} onChange={(e) => setSubjectId(e.target.value)}>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Teacher</label>
            <select value={teacherId} onChange={(e) => setTeacherId(e.target.value)}>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Periods/week</label>
            <input type="number" min="1" max="20" value={ppw} onChange={(e) => setPpw(e.target.value)} style={{ width: 80 }} />
          </div>
          <div className="field">
            <label>Double periods</label>
            <input type="number" min="0" max={maxDoubles} value={dbl} onChange={(e) => setDbl(Math.min(maxDoubles, Number(e.target.value) || 0))} style={{ width: 90 }} />
          </div>
          <button
            className="btn btn-primary"
            onClick={() => {
              if (!classId || !subjectId || !teacherId) return;
              setAssignments((prev) => [
                ...prev,
                { id: uid('a'), classId, subjectId, teacherId, periodsPerWeek: Number(ppw) || 1, doublePeriods: Number(dbl) || 0 },
              ]);
            }}
          >
            + Add assignment
          </button>
        </div>
        <p className="muted" style={{ marginTop: 8 }}>
          {dbl > 0
            ? `${dbl} double period(s) (${dbl * 2} lessons) + ${singlesLeft} single lesson(s) = ${ppw} periods/week.`
            : 'All periods will be scheduled as single lessons.'}
        </p>
      </div>

      <div className="card">
        <h3>All assignments ({assignments.length})</h3>
        <table className="list">
          <thead>
            <tr>
              <th>Class</th>
              <th>Subject</th>
              <th>Teacher</th>
              <th>Periods/wk</th>
              <th>Doubles</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((a) => (
              <tr key={a.id}>
                <td>{classById[a.classId]?.name}</td>
                <td>
                  {subjById[a.subjectId]?.name} <span className="chip gold">{subjById[a.subjectId]?.abbr}</span>
                </td>
                <td>{teacherById[a.teacherId]?.name}</td>
                <td>{a.periodsPerWeek}</td>
                <td>{a.doublePeriods > 0 ? <span className="chip">{a.doublePeriods}×2</span> : '—'}</td>
                <td>
                  <button className="small-x" onClick={() => setAssignments((prev) => prev.filter((x) => x.id !== a.id))}>
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
