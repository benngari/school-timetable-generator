import React, { useState } from 'react';
import { uid } from '../utils/id.js';

export default function ReservedTab({ reserved, setReserved, classes, teachers, days, lessonPeriods }) {
  const [day, setDay] = useState(days[0] || 'Mon');
  const [periodId, setPeriodId] = useState(lessonPeriods[0]?.id || '');
  const [label, setLabel] = useState('Games / PE');
  const [abbr, setAbbr] = useState('GAME');
  const [scope, setScope] = useState('all');
  const [classIds, setClassIds] = useState([]);
  const [teacherId, setTeacherId] = useState('');

  return (
    <div>
      <div className="pagehead">
        <h2>Reserved activities</h2>
        <p>
          Fix a whole-school (or multi-class) slot for something that always happens at the same time — Games/PE afternoon, assembly, clubs, or a games master
          supervising several classes at once. These are placed before regular lessons, so they never clash.
        </p>
      </div>

      <div className="card">
        <h3>Add reserved activity</h3>
        <div className="row">
          <div className="field">
            <label>Day</label>
            <select value={day} onChange={(e) => setDay(e.target.value)}>
              {days.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Period</label>
            <select value={periodId} onChange={(e) => setPeriodId(e.target.value)}>
              {lessonPeriods.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label} ({p.start}-{p.end})
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Activity name</label>
            <input type="text" value={label} onChange={(e) => setLabel(e.target.value)} style={{ width: 160 }} />
          </div>
          <div className="field">
            <label>Abbreviation</label>
            <input type="text" value={abbr} onChange={(e) => setAbbr(e.target.value.toUpperCase())} style={{ width: 100 }} />
          </div>
          <div className="field">
            <label>Supervising teacher (optional)</label>
            <select value={teacherId} onChange={(e) => setTeacherId(e.target.value)}>
              <option value="">— none —</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="row" style={{ marginTop: 10 }}>
          <div className="field">
            <label>Applies to</label>
            <select value={scope} onChange={(e) => setScope(e.target.value)}>
              <option value="all">All classes</option>
              <option value="some">Selected classes</option>
            </select>
          </div>
          {scope === 'some' && (
            <div className="field" style={{ maxWidth: 420 }}>
              <label>Classes</label>
              <div className="row" style={{ gap: 12 }}>
                {classes.map((c) => (
                  <label key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13 }}>
                    <input
                      type="checkbox"
                      checked={classIds.includes(c.id)}
                      onChange={() => setClassIds((prev) => (prev.includes(c.id) ? prev.filter((x) => x !== c.id) : [...prev, c.id]))}
                    />
                    {c.name}
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        <div style={{ marginTop: 12 }}>
          <button
            className="btn btn-primary"
            onClick={() => {
              if (!periodId || !label.trim()) return;
              setReserved((prev) => [
                ...prev,
                {
                  id: uid('r'),
                  day,
                  periodId,
                  label: label.trim(),
                  abbr: abbr.trim() || label.trim().slice(0, 4).toUpperCase(),
                  appliesTo: scope === 'all' ? 'all' : 'some',
                  classIds: scope === 'all' ? [] : classIds,
                  teacherId: teacherId || null,
                },
              ]);
              setClassIds([]);
            }}
          >
            + Add reserved activity
          </button>
        </div>
      </div>

      <div className="card">
        <h3>All reserved activities ({reserved.length})</h3>
        <table className="list">
          <thead>
            <tr>
              <th>Day</th>
              <th>Period</th>
              <th>Activity</th>
              <th>Applies to</th>
              <th>Teacher</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {reserved.map((r) => (
              <tr key={r.id}>
                <td>{r.day}</td>
                <td>{lessonPeriods.find((p) => p.id === r.periodId)?.label || '—'}</td>
                <td>
                  {r.label} <span className="chip gold">{r.abbr}</span>
                </td>
                <td>{r.appliesTo === 'all' ? 'All classes' : classes.filter((c) => r.classIds.includes(c.id)).map((c) => c.name).join(', ') || '—'}</td>
                <td>{teachers.find((t) => t.id === r.teacherId)?.name || '—'}</td>
                <td>
                  <button className="small-x" onClick={() => setReserved((prev) => prev.filter((x) => x.id !== r.id))}>
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
