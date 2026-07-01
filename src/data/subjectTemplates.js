import { uid } from '../utils/id.js';

export const DAYS_ALL = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const DEFAULT_PERIODS = [
  { id: uid('p'), label: '1', start: '08:00', end: '08:40', type: 'lesson' },
  { id: uid('p'), label: '2', start: '08:40', end: '09:20', type: 'lesson' },
  { id: uid('p'), label: 'BREAK', start: '09:20', end: '09:40', type: 'break' },
  { id: uid('p'), label: '3', start: '09:40', end: '10:20', type: 'lesson' },
  { id: uid('p'), label: '4', start: '10:20', end: '11:00', type: 'lesson' },
  { id: uid('p'), label: '5', start: '11:00', end: '11:40', type: 'lesson' },
  { id: uid('p'), label: 'LUNCH', start: '11:40', end: '12:40', type: 'lunch' },
  { id: uid('p'), label: '6', start: '12:40', end: '13:20', type: 'lesson' },
  { id: uid('p'), label: '7', start: '13:20', end: '14:00', type: 'lesson' },
  { id: uid('p'), label: 'BREAK', start: '14:00', end: '14:15', type: 'break' },
  { id: uid('p'), label: '8', start: '14:15', end: '14:55', type: 'lesson' },
  { id: uid('p'), label: '9', start: '14:55', end: '15:35', type: 'lesson' },
];

export const SUBJECT_TEMPLATES = {
  primary: [
    ['English', 'ENG'], ['Kiswahili', 'KIS'], ['Mathematics', 'MAT'],
    ['Science & Technology', 'SCI'], ['Social Studies', 'S.ST'], ['CRE/IRE', 'CRE'],
    ['Creative Arts', 'C.ART'], ['Physical & Health Education', 'PHE'], ['Agriculture', 'AGR'],
  ],
  jss: [
    ['English', 'ENG'], ['Kiswahili', 'KIS'], ['Mathematics', 'MAT'], ['Integrated Science', 'SCI'],
    ['Social Studies', 'S.ST'], ['Agriculture & Nutrition', 'AGR'], ['Pre-Technical Studies', 'P.TC'],
    ['CRE/IRE/HRE', 'CRE'], ['Physical Education', 'PE'], ['Life Skills', 'L.SK'],
    ['Business Studies', 'BST'], ['Computer Science', 'COMP'], ['Creative Arts & Sports', 'C.ART'],
  ],
  secondary: [
    ['English', 'ENG'], ['Kiswahili', 'KIS'], ['Mathematics', 'MAT'], ['Biology', 'BIO'],
    ['Chemistry', 'CHEM'], ['Physics', 'PHY'], ['Geography', 'GEO'], ['History & Government', 'HIST'],
    ['CRE/IRE', 'C.R.E'], ['Business Studies', 'BST'], ['Agriculture', 'AGR'],
    ['Computer Studies', 'COMP'], ['French', 'FRE'], ['Physical Education', 'PE'],
  ],
};
