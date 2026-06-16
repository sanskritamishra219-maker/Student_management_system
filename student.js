// ===================== AUTH CHECK =====================
const logged = JSON.parse(localStorage.getItem("loggedInUser"));

if (!logged || logged.role !== "student") {
  window.location.href = "index.html";
}

// Helper
const el = id => document.getElementById(id);

// ===================== PROFILE =====================
function renderProfile() {
  if (el("studentName")) el("studentName").textContent = logged.name;
  if (el("rollNo")) el("rollNo").textContent = logged.roll;
  if (el("classGroup")) el("classGroup").textContent = logged.class;
  if (el("semester")) el("semester").textContent = logged.semester;
  if (el("program")) el("program").textContent = logged.program;
}
renderProfile();

// ===================== LOGOUT =====================
if (el("logoutBtn")) {
  el("logoutBtn").onclick = () => {
    localStorage.removeItem("loggedInUser");
    window.location.href = "index.html";
  };
}

// ===================== DATA =====================
const subjects = JSON.parse(localStorage.getItem("erp_subject_list")) || [];
const attendanceData = JSON.parse(localStorage.getItem("erp_attendance")) || {};
const marksData = JSON.parse(localStorage.getItem("erp_marks")) || {};
const timetable = JSON.parse(localStorage.getItem("erp_timetable")) || [];

// ===================== ATTENDANCE =====================
function renderAttendance() {
  const body = document.querySelector("#attendanceSummary");
  if (!body) return;

  body.innerHTML = "";
  const myAtt = attendanceData[logged.roll] || {};

  subjects.forEach(sub => {
    const rec = myAtt[sub.name] || { total: 0, present: 0 };
    const percent = rec.total
  ? ((rec.present / rec.total) * 100).toFixed(1)
  : 0;

let cls = "danger";
if (percent >= 75) cls = "good";
else if (percent >= 60) cls = "warning";

body.innerHTML += `
  <tr>
    <td>${sub.name}</td>
    <td>${rec.total}</td>
    <td>${rec.present}</td>
    <td class="${cls}">${percent}%</td>
  </tr>
`;
  });
}
renderAttendance();

// ===================== MARKS =====================
function renderMarks() {
  const body = document.querySelector("#marksBody");
  if (!body) return;

  body.innerHTML = "";

  subjects.forEach(sub => {
    const m = marksData[logged.roll]?.[sub.name] || { obtained: 0, max: 100 };
    const percent = m.max ? ((m.obtained / m.max) * 100).toFixed(1) : "0";
let cls = "danger";
if (percent >= 75) cls = "good";
else if (percent >= 60) cls = "warning";

body.innerHTML += `
  <tr>
    <td>${sub.name}</td>
    <td>${m.obtained}</td>
    <td>${m.max}</td>
    <td class="${cls}">${percent}%</td>
  </tr>
`;
  });
}
renderMarks();

// ===================== TIMETABLE =====================
const tbody = document.getElementById("timetableBody");

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const slots = [
  "9:00 to 9:50",
  "9:50 to 10:40",
  "10:50 to 11:40",
  "11:40 to 12:30",
  "1:20 to 2:10",
  "2:10 to 3:00",
  "3:10 to 4:00",
  "4:00 to 4:50"
];

tbody.innerHTML = "";

days.forEach(day => {
  const tr = document.createElement("tr");

  // Day column
  tr.innerHTML = `<td><b>${day}</b></td>`;

  slots.forEach(slot => {
    const lecture = timetable.find(t =>
      t.day === day &&
      t.time === slot &&
      t.class.replace(/\s+/g, "") === logged.class.replace(/\s+/g, "")
    );

    if (lecture) {
      tr.innerHTML += `
        <td>
          <div class="subject">${lecture.subject}</div>
          <div class="faculty">${lecture.facultyName}</div>
          <div class="room">Room: ${lecture.classRoom}</div>
        </td>
      `;
    } else {
      tr.innerHTML += `<td>—</td>`;
    }
  });

  tbody.appendChild(tr);
});
// ===================== STATS =====================

function renderStats() {
  let totalClasses = 0, totalPresent = 0;
  let totalMarks = 0, maxMarks = 0;

  const myAtt = attendanceData[logged.roll] || {};

  subjects.forEach(sub => {
    const a = myAtt[sub.name];
    if (a) {
      totalClasses += a.total;
      totalPresent += a.present;
    }

    const m = marksData[logged.roll]?.[sub.name];
    if (m) {
      totalMarks += m.obtained;
      maxMarks += m.max;
    }
  });

  const attPercent = totalClasses
    ? ((totalPresent / totalClasses) * 100).toFixed(1)
    : 0;

  const markPercent = maxMarks
    ? ((totalMarks / maxMarks) * 100).toFixed(1)
    : 0;

  el("overallAttendance").textContent = attPercent + "%";
  el("averageMarks").textContent = markPercent + "%";
  el("totalSubjects").textContent = subjects.length;
}

renderStats();
