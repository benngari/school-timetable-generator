import React from 'react';

export default function TeacherGrid({ teacherId, days, periods, subjById, classById, teacherCellFor }) {
  if (!teacherId) return null;
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
              const cell = teacherCellFor(teacherId, day, p.id);
              const isReserved = cell?.reserved;
              return (
                <td key={p.id} className={cell ? (isReserved ? 'lesson reservedcell' : 'lesson') : 'lesson empty'}>
                  {cell &&
                    (isReserved ? (
                      <span className="subj resv">{cell.abbr || cell.label}</span>
                    ) : (
                      <>
                        <span className="teach">
                          {subjById[cell.subjectId]?.abbr}
                          {cell.isDouble && <sup className="dbl">2x</sup>}
                        </span>
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
