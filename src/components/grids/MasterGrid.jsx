import React from 'react';

export default function MasterGrid({ mode, days, lessonPeriods, classes, teachers, subjById, classById, cellFor, teacherCellFor }) {
  const cols = [];
  days.forEach((day) => lessonPeriods.forEach((p) => cols.push({ day, p })));
  const rows = mode === 'classes' ? classes : teachers;

  return (
    <table className="tt" style={{ minWidth: cols.length * 54 }}>
      <thead>
        <tr>
          <th style={{ minWidth: 110 }}>{mode === 'classes' ? 'Class' : 'Teacher'}</th>
          {cols.map((c, i) => (
            <th key={i}>
              {c.day}
              <small>P{c.p.label}</small>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((n) => (
          <tr key={n.id}>
            <td className="daylabel" style={{ width: 110 }}>
              {n.name}
            </td>
            {cols.map(({ day, p }, i) => {
              const cell = mode === 'classes' ? cellFor(n.id, day, p.id) : teacherCellFor(n.id, day, p.id);
              const isReserved = cell?.reserved;
              return (
                <td key={i} className={cell ? (isReserved ? 'lesson reservedcell' : 'lesson') : 'lesson empty'}>
                  {cell &&
                    (isReserved ? (
                      <span className="subj resv">{cell.abbr || cell.label}</span>
                    ) : mode === 'classes' ? (
                      <span className="subj">{subjById[cell.subjectId]?.abbr}</span>
                    ) : (
                      <>
                        <span className="teach">{subjById[cell.subjectId]?.abbr}</span>
                        <span className="cls">{classById[cell.classId]?.name}</span>
                      </>
                    ))}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
