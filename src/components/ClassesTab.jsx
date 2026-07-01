import React, { useState } from 'react';
import { uid } from '../utils/id.js';

export default function ClassesTab({ classes, setClasses, classLoad, capacity }) {
  const [name, setName] = useState('');
  const [base, setBase] = useState('Form 1');
  const [streams, setStreams] = useState('S,E,N');

  function addClasses(baseName, streamsCsv) {
    const list = streamsCsv.split(',').map((s) => s.trim()).filter(Boolean);
    if (list.length === 0) {
      setClasses((prev) => [...prev, { id: uid('c'), name: baseName }]);
    } else {
      setClasses((prev) => [...prev, ...list.map((s) => ({ id: uid('c'), name: `${baseName}${s}` }))]);
    }
  }

  return (
    <div>
      <div className="pagehead">
        <h2>Classes / streams</h2>
        <p>
          Add classes one at a time, or generate several streams at once (e.g. "Form 1" + streams "S,E,N" creates Form 1S, Form 1E, Form 1N).
          Works the same for Grade 7 Green, Grade 8 Blue, etc.
        </p>
      </div>

      <div className="card">
        <h3>Quick-add streams</h3>
        <div className="row">
          <div className="field">
            <label>Base name</label>
            <input type="text" value={base} onChange={(e) => setBase(e.target.value)} style={{ width: 160 }} />
          </div>
          <div className="field">
            <label>Streams (comma-separated, blank = single class)</label>
            <input type="text" value={streams} onChange={(e) => setStreams(e.target.value)} style={{ width: 200 }} />
          </div>
          <button className="btn btn-primary" onClick={() => base && addClasses(base, streams)}>
            + Add class(es)
          </button>
        </div>
      </div>

      <div className="card">
        <h3>Add single class</h3>
        <div className="row">
          <input type="text" placeholder="e.g. Grade 7 Amber" value={name} onChange={(e) => setName(e.target.value)} style={{ width: 220 }} />
          <button
            className="btn"
            onClick={() => {
              if (name.trim()) {
                setClasses((prev) => [...prev, { id: uid('c'), name: name.trim() }]);
                setName('');
              }
            }}
          >
            + Add
          </button>
        </div>
      </div>

      <div className="card">
        <h3>All classes ({classes.length})</h3>
        <table className="list">
          <thead>
            <tr>
              <th>Class</th>
              <th>Assigned periods/week</th>
              <th>Load</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {classes.map((c) => {
              const load = classLoad(c.id);
              const pct = Math.min(100, Math.round((load / Math.max(1, capacity)) * 100));
              return (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td>
                    {load} / {capacity}
                  </td>
                  <td style={{ minWidth: 140 }}>
                    <div className={`load-bar ${load > capacity ? 'over' : ''}`}>
                      <div style={{ width: pct + '%' }}></div>
                    </div>
                  </td>
                  <td>
                    <button className="small-x" onClick={() => setClasses((prev) => prev.filter((x) => x.id !== c.id))}>
                      ✕
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
