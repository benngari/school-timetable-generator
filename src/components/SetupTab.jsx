import React, { useState } from 'react';
import { uid } from '../utils/id.js';

const DAYS_ALL = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function SetupTab({ schoolName, setSchoolName, level, loadTemplate, days, setDays, periods, setPeriods, capacity }) {
  const [newP, setNewP] = useState({ label: '', start: '', end: '', type: 'lesson' });

  return (
    <div>
      <div className="pagehead">
        <h2>School & timetable structure</h2>
        <p>Set the school name, level, teaching days, and the daily period structure (lessons, breaks, lunch). This applies to every class and teacher timetable.</p>
      </div>

      <div className="card">
        <h3>School details</h3>
        <div className="row">
          <div className="field">
            <label>School name</label>
            <input type="text" value={schoolName} onChange={(e) => setSchoolName(e.target.value)} style={{ minWidth: 280 }} />
          </div>
          <div className="field">
            <label>School level</label>
            <select value={level} onChange={(e) => loadTemplate(e.target.value)}>
              <option value="primary">Primary (Grade 1–6)</option>
              <option value="jss">Junior School / JSS (Grade 7–9)</option>
              <option value="secondary">Secondary (Form 1–4)</option>
            </select>
          </div>
        </div>
        <p className="muted" style={{ marginTop: 8 }}>
          Changing the level loads a default Kenyan CBC/8-4-4 subject list on the Subjects tab (your existing subjects are replaced).
        </p>
      </div>

      <div className="card">
        <h3>Teaching days</h3>
        <div className="row">
          {DAYS_ALL.map((d) => (
            <label key={d} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13.5 }}>
              <input
                type="checkbox"
                checked={days.includes(d)}
                onChange={() => {
                  setDays((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : DAYS_ALL.filter((x) => prev.includes(x) || x === d)));
                }}
              />
              {d}
            </label>
          ))}
        </div>
      </div>

      <div className="card">
        <h3>Daily periods</h3>
        <table className="list">
          <thead>
            <tr>
              <th>Label</th>
              <th>Start</th>
              <th>End</th>
              <th>Type</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {periods.map((p) => (
              <tr key={p.id}>
                <td>
                  <input
                    type="text"
                    value={p.label}
                    style={{ width: 70 }}
                    onChange={(e) => {
                      const v = e.target.value;
                      setPeriods((prev) => prev.map((x) => (x.id === p.id ? { ...x, label: v } : x)));
                    }}
                  />
                </td>
                <td>
                  <input
                    type="time"
                    value={p.start}
                    onChange={(e) => {
                      const v = e.target.value;
                      setPeriods((prev) => prev.map((x) => (x.id === p.id ? { ...x, start: v } : x)));
                    }}
                  />
                </td>
                <td>
                  <input
                    type="time"
                    value={p.end}
                    onChange={(e) => {
                      const v = e.target.value;
                      setPeriods((prev) => prev.map((x) => (x.id === p.id ? { ...x, end: v } : x)));
                    }}
                  />
                </td>
                <td>
                  <select
                    value={p.type}
                    onChange={(e) => {
                      const v = e.target.value;
                      setPeriods((prev) => prev.map((x) => (x.id === p.id ? { ...x, type: v } : x)));
                    }}
                  >
                    <option value="lesson">Lesson</option>
                    <option value="break">Break</option>
                    <option value="lunch">Lunch</option>
                  </select>
                </td>
                <td>
                  <button className="small-x" onClick={() => setPeriods((prev) => prev.filter((x) => x.id !== p.id))}>
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="row" style={{ marginTop: 12 }}>
          <div className="field">
            <label>Label</label>
            <input type="text" value={newP.label} onChange={(e) => setNewP({ ...newP, label: e.target.value })} style={{ width: 80 }} />
          </div>
          <div className="field">
            <label>Start</label>
            <input type="time" value={newP.start} onChange={(e) => setNewP({ ...newP, start: e.target.value })} />
          </div>
          <div className="field">
            <label>End</label>
            <input type="time" value={newP.end} onChange={(e) => setNewP({ ...newP, end: e.target.value })} />
          </div>
          <div className="field">
            <label>Type</label>
            <select value={newP.type} onChange={(e) => setNewP({ ...newP, type: e.target.value })}>
              <option value="lesson">Lesson</option>
              <option value="break">Break</option>
              <option value="lunch">Lunch</option>
            </select>
          </div>
          <button
            className="btn"
            onClick={() => {
              if (!newP.label) return;
              setPeriods((prev) => [...prev, { id: uid('p'), ...newP }]);
              setNewP({ label: '', start: '', end: '', type: 'lesson' });
            }}
          >
            + Add period
          </button>
        </div>
        <p className="muted" style={{ marginTop: 10 }}>
          Lesson slots per week right now: <strong>{capacity}</strong> ({days.length} days × {periods.filter((p) => p.type === 'lesson').length} lesson periods/day).
          Tip: back-to-back lesson periods (no break in between) can be used as a <strong>double period</strong> on the Assignments tab — handy for PE, sciences, or agriculture practicals.
        </p>
      </div>
    </div>
  );
}
