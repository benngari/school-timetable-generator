import React from 'react';
import ClassGrid from './grids/ClassGrid.jsx';
import TeacherGrid from './grids/TeacherGrid.jsx';
import MasterGrid from './grids/MasterGrid.jsx';
import { exportClassExcel, exportTeacherExcel, exportFullWorkbook, downloadWorkbook, masterAOA } from '../utils/exportExcel.js';

export default function ViewTab({
  ctx,
  viewMode,
  setViewMode,
  viewClassId,
  setViewClassId,
  viewTeacherId,
  setViewTeacherId,
  printSingle,
  printAllClasses,
  printAllTeachers,
  setPrintJob,
}) {
  const { schoolName, classes, teachers, days, periods, lessonPeriods, subjById, classById, teacherById, cellFor, teacherCellFor } = ctx;

  return (
    <div>
      <div className="pagehead">
        <h2>Timetables</h2>
        <p>View, print, or export the class, teacher, and whole-school timetables generated from your data.</p>
      </div>

      <div className="toolbar no-print">
        <button className={`btn ${viewMode === 'class' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setViewMode('class')}>
          Class timetable
        </button>
        <button className={`btn ${viewMode === 'teacher' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setViewMode('teacher')}>
          Teacher timetable
        </button>
        <button className={`btn ${viewMode === 'school' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setViewMode('school')}>
          Whole school (staffroom)
        </button>
        <div className="divider"></div>
        <button className="btn btn-outline" onClick={() => exportFullWorkbook(ctx)}>
          ⬇ Export full school workbook (Excel)
        </button>
      </div>

      {viewMode === 'class' && (
        <div>
          <div className="toolbar no-print">
            <select className="big" value={viewClassId} onChange={(e) => setViewClassId(e.target.value)}>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <button className="btn" onClick={() => exportClassExcel(ctx, viewClassId)}>
              ⬇ Excel
            </button>
            <button className="btn" onClick={() => printSingle('class', viewClassId)}>
              🖶 Print / Save PDF
            </button>
            <div className="divider"></div>
            <button className="btn btn-outline" onClick={printAllClasses}>
              🖶 Print all classes
            </button>
          </div>
          {viewClassId ? (
            <div className="tt-wrap">
              <ClassGrid classId={viewClassId} days={days} periods={periods} subjById={subjById} cellFor={cellFor} />
            </div>
          ) : (
            <p className="muted">Add a class first.</p>
          )}
        </div>
      )}

      {viewMode === 'teacher' && (
        <div>
          <div className="toolbar no-print">
            <select className="big" value={viewTeacherId} onChange={(e) => setViewTeacherId(e.target.value)}>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
            <button className="btn" onClick={() => exportTeacherExcel(ctx, viewTeacherId)}>
              ⬇ Excel
            </button>
            <button className="btn" onClick={() => printSingle('teacher', viewTeacherId)}>
              🖶 Print / Save PDF
            </button>
            <div className="divider"></div>
            <button className="btn btn-outline" onClick={printAllTeachers}>
              🖶 Print all teachers
            </button>
          </div>
          {viewTeacherId ? (
            <div className="tt-wrap">
              <TeacherGrid teacherId={viewTeacherId} days={days} periods={periods} subjById={subjById} classById={classById} teacherCellFor={teacherCellFor} />
            </div>
          ) : (
            <p className="muted">Add a teacher first.</p>
          )}
        </div>
      )}

      {viewMode === 'school' && (
        <div className="grid2">
          <div>
            <div className="toolbar no-print">
              <strong>Classes grid</strong>
              <button className="btn btn-sm" onClick={() => downloadWorkbook([{ name: 'Classes', aoa: masterAOA(ctx, 'classes') }], `${schoolName.replace(/\s+/g, '_')}_master_classes.xlsx`)}>
                ⬇ Excel
              </button>
              <button className="btn btn-sm" onClick={() => setPrintJob({ kind: 'master-classes' })}>
                🖶 Print
              </button>
            </div>
            <div className="tt-wrap">
              <MasterGrid mode="classes" days={days} lessonPeriods={lessonPeriods} classes={classes} teachers={teachers} subjById={subjById} classById={classById} cellFor={cellFor} teacherCellFor={teacherCellFor} />
            </div>
          </div>
          <div>
            <div className="toolbar no-print">
              <strong>Teachers grid</strong>
              <button className="btn btn-sm" onClick={() => downloadWorkbook([{ name: 'Teachers', aoa: masterAOA(ctx, 'teachers') }], `${schoolName.replace(/\s+/g, '_')}_master_teachers.xlsx`)}>
                ⬇ Excel
              </button>
              <button className="btn btn-sm" onClick={() => setPrintJob({ kind: 'master-teachers' })}>
                🖶 Print
              </button>
            </div>
            <div className="tt-wrap">
              <MasterGrid mode="teachers" days={days} lessonPeriods={lessonPeriods} classes={classes} teachers={teachers} subjById={subjById} classById={classById} cellFor={cellFor} teacherCellFor={teacherCellFor} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
