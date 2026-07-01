import React from 'react';

export default function ClassGrid({ classId, days, periods, subjById, cellFor }) {
  if (!classId) return null;
  return (
    <table className="tt">
      <thead>
        <tr>
          <th></th>
          {periods.map((p) => (
            <th key={p.id}>
              {p.label}
              {p.type === 'lesson' && <small>{p.start}</small>}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {days.map((day) => (
          <tr key={day}>
            <td className="daylabel">{day}</td>
            {periods.map((p) => {
              if (p.type !== 'lesson') {
                if (day === days[0]) {
                  return (
                    <td key={p.id} rowSpan={days.length} className={p.type}>
                      <div className="vtext">{p.label}</div>
                    </td>
                  );
                }
                return null;
              }
              const cell = cellFor(classId, day, p.id);
              const isReserved = cell?.reserved;
              return (
                <td key={p.id} className={cell ? (isReserved ? 'lesson reservedcell' : 'lesson') : 'lesson empty'}>
                  {cell &&
                    (isReserved ? (
                      <span className="subj resv">{cell.abbr || cell.label}</span>
                    ) : (
                      <span className="subj">
                        {subjById[cell.subjectId]?.abbr || subjById[cell.subjectId]?.name}
                        {cell.isDouble && <sup className="dbl">2x</sup>}
                      </span>
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
