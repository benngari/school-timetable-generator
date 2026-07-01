import { uid } from '../utils/id.js';
import { SUBJECT_TEMPLATES, DEFAULT_PERIODS } from './subjectTemplates.js';

export function buildDemoState() {
  const classes = ['Form 1S', 'Form 1E', 'Form 2S'].map((n) => ({ id: uid('c'), name: n }));

  const subjects = SUBJECT_TEMPLATES.secondary
    .filter(([n]) => n !== 'French')
    .map(([name, abbr]) => ({ id: uid('s'), name, abbr }));
  const byName = Object.fromEntries(subjects.map((s) => [s.name, s]));

  const teachers = ['J. Mwangi', 'A. Wanjiru', 'P. Otieno', 'M. Achieng', 'S. Kiptoo', 'F. Njoroge', 'Games Master']
    .map((n) => ({ id: uid('t'), name: n, unavailable: [] }));
  const byT = Object.fromEntries(teachers.map((t) => [t.name, t]));

  // Give one teacher a fixed unavailability, to demonstrate the feature (e.g. a part-time teacher).
  const njorogeSlot = `Fri|${DEFAULT_PERIODS[DEFAULT_PERIODS.length - 1].id}`;
  byT['F. Njoroge'].unavailable = [njorogeSlot];

  const plan = [
    ['English', 'J. Mwangi', 5, 0],
    ['Kiswahili', 'A. Wanjiru', 4, 0],
    ['Mathematics', 'P. Otieno', 5, 0],
    ['Biology', 'M. Achieng', 4, 1],
    ['Chemistry', 'S. Kiptoo', 4, 1],
    ['Physics', 'S. Kiptoo', 4, 1],
    ['Geography', 'F. Njoroge', 3, 0],
    ['History & Government', 'F. Njoroge', 3, 0],
    ['CRE/IRE', 'A. Wanjiru', 2, 0],
    ['Business Studies', 'P. Otieno', 3, 0],
    ['Agriculture', 'F. Njoroge', 3, 1],
    ['Computer Studies', 'M. Achieng', 2, 0],
  ];

  const assignments = [];
  classes.forEach((c) => {
    plan.forEach(([subjName, teachName, periods, doubles]) => {
      const subj = byName[subjName];
      const teach = byT[teachName];
      if (subj && teach) {
        assignments.push({
          id: uid('a'),
          classId: c.id,
          subjectId: subj.id,
          teacherId: teach.id,
          periodsPerWeek: periods,
          doublePeriods: doubles,
        });
      }
    });
  });

  // A whole-school reserved activity: Games/PE for every class at the same time,
  // supervised by the Games Master, so it never clashes with regular lessons.
  const reserved = [
    {
      id: uid('r'),
      day: 'Wed',
      periodId: DEFAULT_PERIODS.find((p) => p.type === 'lesson' && p.label === '8').id,
      label: 'Games / PE',
      abbr: 'GAME',
      appliesTo: 'all',
      classIds: [],
      teacherId: byT['Games Master'].id,
    },
  ];

  return { classes, subjects, teachers, assignments, reserved };
}
