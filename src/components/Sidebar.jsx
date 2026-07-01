import React from 'react';

const NAV = [
  ['setup', '1', 'Setup'],
  ['classes', '2', 'Classes'],
  ['subjects', '3', 'Subjects'],
  ['teachers', '4', 'Teachers'],
  ['assignments', '5', 'Assignments'],
  ['reserved', '6', 'Reserved activities'],
  ['data', '7', 'Import / export data'],
  ['generate', '8', 'Generate'],
  ['view', '9', 'View & print'],
];

export default function Sidebar({ tab, setTab }) {
  return (
    <div className="sidebar no-print">
      <div className="brand">
        <h1>Shule Timetable</h1>
        <p>Kenya school scheduler</p>
      </div>
      {NAV.map(([key, num, label]) => (
        <button key={key} className={`navbtn ${tab === key ? 'active' : ''}`} onClick={() => setTab(key)}>
          <span className="num">{num}</span>
          {label}
        </button>
      ))}
    </div>
  );
}
