import React, { useState } from 'react';
import { uid } from '../utils/id.js';

export default function TeachersTab({ teachers, setTeachers, teacherLoad, days, lessonPeriods }) {
  const [name, setName] = useState('');
  const [openId, setOpenId] = useState(null);

  function toggleUnavailable(teacherId, day, periodId) {
    const key = `${day}|${periodId}`;
    setTeachers((prev) =>
      prev.map((t) => {
        if (t.id !== teacherId) return t;
        const has = (t.unavailable || []).includes(key);
        const unavailable = has ? t.unavailable.filter((k) => k !== key) : [...(t.unavailable || []), key];
        return { ...t, unavailable };
      })
    );
  }

  return (
    <div>
      <div className="pagehead">
        <h2>Teachers</h2>
        <p>
          Add every teacher who will appear on the timetable. Their subjects and classes are set on the Assignments tab. Click "Set unavailable times" to block
          out periods a teacher can't teach (part-time days, duty periods, etc.) — the generator will never schedule them then.
        </p>
      </div>

      <div className="card">
        <h3>Add teacher</h3>
        <div className="row">
          <input type="text" placeholder="Teacher name" value={name} onChange={(e) => setName(e.target.value)} style={{ width: 220 }} />
          <button
            className="btn"
            onClick={() => {
              if (name.trim()) {
                setTeachers((prev) => [...prev, { id: uid('t'), name: name.trim(), unavailable: [] }]);
                setName('');
              }
            }}
          >
            + Add teacher
          </button>
        </div>
      </div>

      <div className="card">
        <h3>All teachers ({teachers.length})</h3>
        <table className="list">
          <thead>
            <tr>
              <th>Teacher</th>
              <th>Periods/week assigned</th>
              <th>Unavailable slots</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((t) => (
              <React.Fragment key={t.id}>
                <tr>
                  <td>{t.name}</td>
                  <td>{teacherLoad(t.id)}</td>
                  <td>
                    <button className="btn btn-sm btn-outline" onClick={() => setOpenId(openId === t.id ? null : t.id)}>
                      {(t.unavailable || []).length} blocked — {openId === t.id ? 'close' : 'edit'}
                    </button>
                  </td>
                  <td>
                    <button className="small-x" onClick={() => setTeachers((prev) => prev.filter((x) => x.id !== t.id))}>
                      ✕
                    </button>
                  </td>
                </tr>
                {openId === t.id && (
                  <tr>
                    <td colSpan={4}>
                      <div className="unavail-grid">
                        <table className="mini">
                          <thead>
                            <tr>
                              <th></th>
                              {lessonPeriods.map((p) => (
                                <th key={p.id}>{p.label}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {days.map((day) => (
                              <tr key={day}>
                                <td className="daylabel-mini">{day}</td>
                                {lessonPeriods.map((p) => {
                                  const key = `${day}|${p.id}`;
                                  const blocked = (t.unavailable || []).includes(key);
                                  return (
                                    <td key={p.id}>
                                      <button
                                        className={`toggle-cell ${blocked ? 'blocked' : ''}`}
                                        onClick={() => toggleUnavailable(t.id, day, p.id)}
                                        title={blocked ? 'Unavailable — click to clear' : 'Available — click to block'}
                                      >
                                        {blocked ? '✕' : ''}
                                      </button>
                                    </td>
                                  );
                                })}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <p className="muted" style={{ marginTop: 6 }}>Click a cell to mark it unavailable for {t.name}.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
