import React, { useState } from 'react';
import { uid } from '../utils/id.js';

export default function SubjectsTab({ subjects, setSubjects }) {
  const [name, setName] = useState('');
  const [abbr, setAbbr] = useState('');

  return (
    <div>
      <div className="pagehead">
        <h2>Subjects</h2>
        <p>Each subject needs a short abbreviation — it's what appears inside the timetable grid cells (e.g. "MAT", "KIS", "AGR", "PE").</p>
      </div>

      <div className="card">
        <h3>Add subject</h3>
        <div className="row">
          <input type="text" placeholder="Subject name" value={name} onChange={(e) => setName(e.target.value)} style={{ width: 220 }} />
          <input type="text" placeholder="Abbr. (e.g. PE)" value={abbr} onChange={(e) => setAbbr(e.target.value.toUpperCase())} style={{ width: 120 }} />
          <button
            className="btn"
            onClick={() => {
              if (!name.trim()) return;
              setSubjects((prev) => [...prev, { id: uid('s'), name: name.trim(), abbr: abbr.trim() || name.trim().slice(0, 4).toUpperCase() }]);
              setName('');
              setAbbr('');
            }}
          >
            + Add subject
          </button>
        </div>
      </div>

      <div className="card">
        <h3>All subjects ({subjects.length})</h3>
        <table className="list">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Abbreviation</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((s) => (
              <tr key={s.id}>
                <td>{s.name}</td>
                <td>
                  <span className="chip gold">{s.abbr}</span>
                </td>
                <td>
                  <button className="small-x" onClick={() => setSubjects((prev) => prev.filter((x) => x.id !== s.id))}>
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
