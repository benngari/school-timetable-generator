import React from 'react';
import ClassGrid from './grids/ClassGrid.jsx';
import TeacherGrid from './grids/TeacherGrid.jsx';
import MasterGrid from './grids/MasterGrid.jsx';

export default function PrintArea({ printJob, schoolName, ctx }) {
  if (!printJob) return null;
  const { days, periods, lessonPeriods, classes, teachers, subjById, classById, teacherById, cellFor, teacherCellFor } = ctx;

  if (printJob.kind === 'class') {
    const c = classById[printJob.id];
    return (
      <div className="print-page">
        <div className="print-head">
          <h2>{schoolName}</h2>
          <p>Class Timetable — {c?.name}</p>
        </div>
        <ClassGrid classId={printJob.id} days={days} periods={periods} subjById={subjById} cellFor={cellFor} />
      </div>
    );
  }
  if (printJob.kind === 'teacher') {
    const t = teacherById[printJob.id];
    return (
      <div className="print-page">
        <div className="print-head">
          <h2>{schoolName}</h2>
          <p>Teacher Timetable — {t?.name}</p>
        </div>
        <TeacherGrid teacherId={printJob.id} days={days} periods={periods} subjById={subjById} classById={classById} teacherCellFor={teacherCellFor} />
      </div>
    );
  }
  if (printJob.kind === 'master-classes' || printJob.kind === 'master-teachers') {
    const mode = printJob.kind === 'master-classes' ? 'classes' : 'teachers';
    return (
      <div className="print-page">
        <div className="print-head">
          <h2>{schoolName}</h2>
          <p>Whole School Master Grid — {mode === 'classes' ? 'Classes' : 'Teachers'}</p>
        </div>
        <MasterGrid mode={mode} days={days} lessonPeriods={lessonPeriods} classes={classes} teachers={teachers} subjById={subjById} classById={classById} cellFor={cellFor} teacherCellFor={teacherCellFor} />
      </div>
    );
  }
  if (printJob.kind === 'all-classes') {
    return classes.map((c) => (
      <div className="print-page" key={c.id}>
        <div className="print-head">
          <h2>{schoolName}</h2>
          <p>Class Timetable — {c.name}</p>
        </div>
        <ClassGrid classId={c.id} days={days} periods={periods} subjById={subjById} cellFor={cellFor} />
      </div>
    ));
  }
  if (printJob.kind === 'all-teachers') {
    return teachers.map((t) => (
      <div className="print-page" key={t.id}>
        <div className="print-head">
          <h2>{schoolName}</h2>
          <p>Teacher Timetable — {t.name}</p>
        </div>
        <TeacherGrid teacherId={t.id} days={days} periods={periods} subjById={subjById} classById={classById} teacherCellFor={teacherCellFor} />
      </div>
    ));
  }
  return null;
}
