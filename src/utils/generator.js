const shuffle = (arr) => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// Single-period slots: every (day, lessonPeriod) combination.
function buildSingleSlots(days, lessonPeriods) {
  const slots = [];
  days.forEach((day) => lessonPeriods.forEach((p) => slots.push({ day, periodId: p.id })));
  return slots;
}

// Double-period slots: pairs of two lesson periods that are physically back-to-back
// in the daily schedule (no break/lunch between them).
function buildPairSlots(days, periods) {
  const pairs = [];
  days.forEach((day) => {
    for (let i = 0; i < periods.length - 1; i++) {
      if (periods[i].type === 'lesson' && periods[i + 1].type === 'lesson') {
        pairs.push({ day, p1: periods[i].id, p2: periods[i + 1].id });
      }
    }
  });
  return pairs;
}

export function generateTimetable(days, periods, classes, teachers, assignments, reserved = [], attempts = 80) {
  const lessonPeriods = periods.filter((p) => p.type === 'lesson');
  const singleSlots = buildSingleSlots(days, lessonPeriods);
  const pairSlots = buildPairSlots(days, periods);

  let best = null;

  for (let attempt = 0; attempt < attempts; attempt++) {
    const grid = {};
    classes.forEach((c) => {
      grid[c.id] = {};
      days.forEach((d) => (grid[c.id][d] = {}));
    });

    const teacherBusy = {};
    teachers.forEach((t) => {
      teacherBusy[t.id] = {};
      days.forEach((d) => (teacherBusy[t.id][d] = {}));
      (t.unavailable || []).forEach((key) => {
        const [day, periodId] = key.split('|');
        if (!teacherBusy[t.id][day]) teacherBusy[t.id][day] = {};
        teacherBusy[t.id][day][periodId] = true;
      });
    });

    // 1. Place whole-school reserved activities first (Games/PE, Clubs, Assembly, etc.)
    reserved.forEach((r) => {
      const targets =
        r.appliesTo === 'all' ? classes : classes.filter((c) => (r.classIds || []).includes(c.id));
      targets.forEach((c) => {
        if (!grid[c.id][r.day][r.periodId]) {
          grid[c.id][r.day][r.periodId] = { reserved: true, label: r.label, abbr: r.abbr, teacherId: r.teacherId || null };
          if (r.teacherId) {
            if (!teacherBusy[r.teacherId]) teacherBusy[r.teacherId] = {};
            if (!teacherBusy[r.teacherId][r.day]) teacherBusy[r.teacherId][r.day] = {};
            teacherBusy[r.teacherId][r.day][r.periodId] = true;
          }
        }
      });
    });

    // 2. Build lesson units — double-period units first (harder to place), then singles.
    const doubleUnits = [];
    const singleUnits = [];
    assignments.forEach((as) => {
      const doubles = Math.max(0, Number(as.doublePeriods || 0));
      const totalSingles = Math.max(0, Number(as.periodsPerWeek || 0) - doubles * 2);
      for (let i = 0; i < doubles; i++) doubleUnits.push(as);
      for (let i = 0; i < totalSingles; i++) singleUnits.push(as);
    });

    const daySubjCount = {};
    classes.forEach((c) => (daySubjCount[c.id] = {}));
    const bump = (classId, subjectId, day) => {
      if (!daySubjCount[classId][subjectId]) daySubjCount[classId][subjectId] = {};
      daySubjCount[classId][subjectId][day] = (daySubjCount[classId][subjectId][day] || 0) + 1;
    };

    const unplaced = [];
    const units = [...shuffle(doubleUnits).map((u) => ({ ...u, kind: 'double' })), ...shuffle(singleUnits).map((u) => ({ ...u, kind: 'single' }))];

    units.forEach((unit) => {
      const { classId, teacherId, subjectId, kind } = unit;

      if (kind === 'double') {
        const candidates = pairSlots.filter(
          (s) =>
            !grid[classId][s.day][s.p1] &&
            !grid[classId][s.day][s.p2] &&
            !teacherBusy[teacherId]?.[s.day]?.[s.p1] &&
            !teacherBusy[teacherId]?.[s.day]?.[s.p2]
        );
        if (candidates.length === 0) {
          unplaced.push(unit);
          return;
        }
        const fresh = candidates.filter((s) => !daySubjCount[classId][subjectId]?.[s.day]);
        const pool = fresh.length > 0 ? fresh : candidates;
        const chosen = pool[Math.floor(Math.random() * pool.length)];
        const cellData = { subjectId, teacherId, assignmentId: unit.id, isDouble: true };
        grid[classId][chosen.day][chosen.p1] = cellData;
        grid[classId][chosen.day][chosen.p2] = cellData;
        teacherBusy[teacherId][chosen.day][chosen.p1] = true;
        teacherBusy[teacherId][chosen.day][chosen.p2] = true;
        bump(classId, subjectId, chosen.day);
      } else {
        const candidates = singleSlots.filter(
          (s) => !grid[classId][s.day][s.periodId] && !teacherBusy[teacherId]?.[s.day]?.[s.periodId]
        );
        if (candidates.length === 0) {
          unplaced.push(unit);
          return;
        }
        const fresh = candidates.filter((s) => !daySubjCount[classId][subjectId]?.[s.day]);
        const pool = fresh.length > 0 ? fresh : candidates;
        const chosen = pool[Math.floor(Math.random() * pool.length)];
        grid[classId][chosen.day][chosen.periodId] = { subjectId, teacherId, assignmentId: unit.id };
        teacherBusy[teacherId][chosen.day][chosen.periodId] = true;
        bump(classId, subjectId, chosen.day);
      }
    });

    if (!best || unplaced.length < best.unplaced.length) {
      best = { grid, unplaced };
      if (unplaced.length === 0) break;
    }
  }

  return best;
}
