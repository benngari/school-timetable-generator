import React from 'react';

export default function GenerateTab({ classes, subjects, teachers, assignments, reserved, capacity, result, runGenerate }) {
  return (
    <div>
      <div className="pagehead">
        <h2>Generate timetable</h2>
        <p>
          Runs a clash-free scheduler: no teacher is double-booked, double periods are kept back-to-back, reserved whole-school activities are locked in first,
          and each class/subject is spread across different days where possible. Re-run any time after editing data.
        </p>
      </div>
      <div className="card">
        <h3>Summary</h3>
        <table className="list">
          <tbody>
            <tr>
              <td>Classes</td>
              <td>{classes.length}</td>
            </tr>
            <tr>
              <td>Subjects</td>
              <td>{subjects.length}</td>
            </tr>
            <tr>
              <td>Teachers</td>
              <td>{teachers.length}</td>
            </tr>
            <tr>
              <td>Assignments</td>
              <td>{assignments.length}</td>
            </tr>
            <tr>
              <td>Reserved activities</td>
              <td>{reserved.length}</td>
            </tr>
            <tr>
              <td>Lesson slots/week per class</td>
              <td>{capacity}</td>
            </tr>
          </tbody>
        </table>
        <div style={{ marginTop: 14 }}>
          <button className="btn btn-primary" onClick={runGenerate}>
            ⚡ Generate timetable
          </button>
        </div>
        {result &&
          (result.unplaced.length === 0 ? (
            <div className="banner ok" style={{ marginTop: 14 }}>
              All periods placed with no teacher or class clashes.
            </div>
          ) : (
            <div className="banner warn" style={{ marginTop: 14 }}>
              {result.unplaced.length} period(s) could not be placed without a clash — usually because a class or teacher is overloaded, or a double period
              couldn't find a free back-to-back slot. Reduce periods/week for some assignments, add more lesson periods, spread subjects across more teachers,
              or loosen teacher unavailability, then regenerate.
            </div>
          ))}
      </div>
    </div>
  );
}
