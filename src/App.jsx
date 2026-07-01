import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from './components/Sidebar.jsx';
import SetupTab from './components/SetupTab.jsx';
import ClassesTab from './components/ClassesTab.jsx';
import SubjectsTab from './components/SubjectsTab.jsx';
import TeachersTab from './components/TeachersTab.jsx';
import AssignmentsTab from './components/AssignmentsTab.jsx';
import ReservedTab from './components/ReservedTab.jsx';
import DataTab from './components/DataTab.jsx';
import GenerateTab from './components/GenerateTab.jsx';
import ViewTab from './components/ViewTab.jsx';
import PrintArea from './components/PrintArea.jsx';
import { DEFAULT_PERIODS, SUBJECT_TEMPLATES } from './data/subjectTemplates.js';
import { buildDemoState } from './data/demoData.js';
import { generateTimetable } from './utils/generator.js';
import { uid } from './utils/id.js';

export default function App() {
  const demo = useMemo(() => buildDemoState(), []);

  const [schoolName, setSchoolName] = useState('Nyondia Secondary School');
  const [level, setLevel] = useState('secondary');
  const [days, setDays] = useState(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
  const [periods, setPeriods] = useState(DEFAULT_PERIODS);
  const [classes, setClasses] = useState(demo.classes);
  const [subjects, setSubjects] = useState(demo.subjects);
  const [teachers, setTeachers] = useState(demo.teachers);
  const [assignments, setAssignments] = useState(demo.assignments);
  const [reserved, setReserved] = useState(demo.reserved);

  const [tab, setTab] = useState('generate');
  const [result, setResult] = useState(null);
  const [viewMode, setViewMode] = useState('class');
  const [viewClassId, setViewClassId] = useState(demo.classes[0]?.id || '');
  const [viewTeacherId, setViewTeacherId] = useState(demo.teachers[0]?.id || '');
  const [printJob, setPrintJob] = useState(null);

  useEffect(() => {
    const r = generateTimetable(days, periods, classes, teachers, assignments, reserved);
    setResult(r);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (printJob) {
      const t = setTimeout(() => window.print(), 80);
      return () => clearTimeout(t);
    }
  }, [printJob]);

  useEffect(() => {
    const handler = () => setPrintJob(null);
    window.addEventListener('afterprint', handler);
    return () => window.removeEventListener('afterprint', handler);
  }, []);

  const subjById = useMemo(() => Object.fromEntries(subjects.map((s) => [s.id, s])), [subjects]);
  const classById = useMemo(() => Object.fromEntries(classes.map((c) => [c.id, c])), [classes]);
  const teacherById = useMemo(() => Object.fromEntries(teachers.map((t) => [t.id, t])), [teachers]);
  const lessonPeriods = useMemo(() => periods.filter((p) => p.type === 'lesson'), [periods]);
  const capacity = days.length * lessonPeriods.length;

  function loadTemplate(lv) {
    setLevel(lv);
    setSubjects(SUBJECT_TEMPLATES[lv].map(([name, abbr]) => ({ id: uid('s'), name, abbr })));
  }

  function runGenerate() {
    const r = generateTimetable(days, periods, classes, teachers, assignments, reserved);
    setResult(r);
    if (!viewClassId && classes[0]) setViewClassId(classes[0].id);
    if (!viewTeacherId && teachers[0]) setViewTeacherId(teachers[0].id);
    setTab('view');
  }

  function classLoad(classId) {
    return assignments.filter((a) => a.classId === classId).reduce((s, a) => s + Number(a.periodsPerWeek || 0), 0);
  }
  function teacherLoad(teacherId) {
    return assignments.filter((a) => a.teacherId === teacherId).reduce((s, a) => s + Number(a.periodsPerWeek || 0), 0);
  }

  function cellFor(classId, day, periodId) {
    if (!result) return null;
    return result.grid?.[classId]?.[day]?.[periodId] || null;
  }
  function teacherCellFor(teacherId, day, periodId) {
    if (!result) return null;
    for (const c of classes) {
      const cell = result.grid?.[c.id]?.[day]?.[periodId];
      if (cell && cell.teacherId === teacherId) return { ...cell, classId: c.id };
    }
    return null;
  }

  const ctx = {
    schoolName,
    days,
    periods,
    lessonPeriods,
    classes,
    subjects,
    teachers,
    assignments,
    reserved,
    result,
    subjById,
    classById,
    teacherById,
    cellFor,
    teacherCellFor,
  };

  function printSingle(kind, id) {
    setPrintJob({ kind, id });
  }
  function printAllClasses() {
    setPrintJob({ kind: 'all-classes' });
  }
  function printAllTeachers() {
    setPrintJob({ kind: 'all-teachers' });
  }

  return (
    <div className="app">
      <Sidebar tab={tab} setTab={setTab} />
      <div className="main">
        {tab === 'setup' && (
          <SetupTab
            schoolName={schoolName}
            setSchoolName={setSchoolName}
            level={level}
            loadTemplate={loadTemplate}
            days={days}
            setDays={setDays}
            periods={periods}
            setPeriods={setPeriods}
            capacity={capacity}
          />
        )}
        {tab === 'classes' && <ClassesTab classes={classes} setClasses={setClasses} classLoad={classLoad} capacity={capacity} />}
        {tab === 'subjects' && <SubjectsTab subjects={subjects} setSubjects={setSubjects} />}
        {tab === 'teachers' && <TeachersTab teachers={teachers} setTeachers={setTeachers} teacherLoad={teacherLoad} days={days} lessonPeriods={lessonPeriods} />}
        {tab === 'assignments' && (
          <AssignmentsTab
            classes={classes}
            subjects={subjects}
            teachers={teachers}
            assignments={assignments}
            setAssignments={setAssignments}
            classById={classById}
            subjById={subjById}
            teacherById={teacherById}
          />
        )}
        {tab === 'reserved' && <ReservedTab reserved={reserved} setReserved={setReserved} classes={classes} teachers={teachers} days={days} lessonPeriods={lessonPeriods} />}
        {tab === 'data' && (
          <DataTab
            classes={classes}
            setClasses={setClasses}
            subjects={subjects}
            setSubjects={setSubjects}
            teachers={teachers}
            setTeachers={setTeachers}
            assignments={assignments}
            setAssignments={setAssignments}
            classById={classById}
            subjById={subjById}
            teacherById={teacherById}
          />
        )}
        {tab === 'generate' && (
          <GenerateTab classes={classes} subjects={subjects} teachers={teachers} assignments={assignments} reserved={reserved} capacity={capacity} result={result} runGenerate={runGenerate} />
        )}
        {tab === 'view' && (
          <ViewTab
            ctx={ctx}
            viewMode={viewMode}
            setViewMode={setViewMode}
            viewClassId={viewClassId}
            setViewClassId={setViewClassId}
            viewTeacherId={viewTeacherId}
            setViewTeacherId={setViewTeacherId}
            printSingle={printSingle}
            printAllClasses={printAllClasses}
            printAllTeachers={printAllTeachers}
            setPrintJob={setPrintJob}
          />
        )}
        <p className="footer-note">
          Works for primary, junior school (JSS) and secondary timetables. Data lives only in this browser session — use "Import / export data" or the Excel
          export buttons to keep a backup.
        </p>
      </div>
      <div id="printArea">
        <PrintArea printJob={printJob} schoolName={schoolName} ctx={ctx} />
      </div>
    </div>
  );
}
