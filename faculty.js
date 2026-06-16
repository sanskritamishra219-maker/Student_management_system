// ===== AUTH CHECK =====
const logged = JSON.parse(localStorage.getItem("loggedInUser"));
if (!logged || logged.role !== "faculty") {
  window.location.href = "index.html";
}

// ===== SHOW FACULTY NAME =====
document.getElementById("facultyName").textContent =
  `Welcome, ${logged.name}`;

// ===== LOAD TIMETABLE =====
const timetable = JSON.parse(localStorage.getItem("erp_timetable")) || [];

// ===== FILTER =====
const myTimetable = timetable.filter(
  t => t.facultyId === logged.id
);

// ===== RENDER =====
const tbody = document.getElementById("timetableBody");
tbody.innerHTML = "";

if (myTimetable.length === 0) {
  tbody.innerHTML = `<tr><td colspan="5">No classes assigned</td></tr>`;
} else {
  myTimetable.forEach(t => {
    tbody.innerHTML += `
      <tr>
        <td>${t.day}</td>
        <td>${t.time}</td>
        <td>${t.class}</td>
        <td>${t.subject}</td>
        <td>${t.classRoom}</td>
      </tr>
    `;
  });
}
const subjectSelect = document.getElementById("subjectSelect");

myTimetable.forEach(t => {
  const opt = document.createElement("option");
  opt.value = t.subject;
  opt.textContent = t.subject;
  subjectSelect.appendChild(opt);
});
const students =
  JSON.parse(localStorage.getItem("erp_student_list")) || [];

const attendanceBody =
  document.getElementById("attendanceBody");

function loadStudents() {
  attendanceBody.innerHTML = "";

  const selectedClass =
    document.getElementById("classSelect").value;

  students
    .filter(s => s.class === selectedClass)
    .forEach(s => {
      attendanceBody.innerHTML += `
        <tr>
          <td>${s.roll}</td>
          <td>${s.name}</td>
          <td>
            <input type="checkbox" data-roll="${s.roll}">
          </td>
        </tr>
      `;
    });
}

document.getElementById("classSelect")
  .addEventListener("change", loadStudents);

loadStudents();
function saveAttendance() {
  const subject =
    document.getElementById("subjectSelect").value;

  if (!subject) {
    alert("Select subject");
    return;
  }

  let attendance =
    JSON.parse(localStorage.getItem("erp_attendance")) || {};

  document
    .querySelectorAll("#attendanceBody input")
    .forEach(cb => {
      const roll = cb.dataset.roll;

      if (!attendance[roll]) attendance[roll] = {};
      if (!attendance[roll][subject]) {
        attendance[roll][subject] = { total: 0, present: 0 };
      }

      attendance[roll][subject].total += 1;
      if (cb.checked) {
        attendance[roll][subject].present += 1;
      }
    });

  localStorage.setItem(
    "erp_attendance",
    JSON.stringify(attendance)
  );

  alert("Attendance saved ✅");
}
const marksSubject =
  document.getElementById("marksSubject");

myTimetable.forEach(t => {
  const opt = document.createElement("option");
  opt.value = t.subject;
  opt.textContent = t.subject;
  marksSubject.appendChild(opt);
});
const marksBody =
  document.getElementById("marksBody");

function loadMarksStudents() {
  marksBody.innerHTML = "";

  const cls =
    document.getElementById("marksClass").value;

  students
    .filter(s => s.class === cls)
    .forEach(s => {
      marksBody.innerHTML += `
        <tr>
          <td>${s.roll}</td>
          <td>${s.name}</td>
          <td>
            <input type="number"
                   min="0"
                   max="100"
                   data-roll="${s.roll}">
          </td>
        </tr>
      `;
    });
}

document.getElementById("marksClass")
  .addEventListener("change", loadMarksStudents);

loadMarksStudents();
function saveMarks() {
  const subject =
    document.getElementById("marksSubject").value;

  if (!subject) {
    alert("Select subject");
    return;
  }

  let marks =
    JSON.parse(localStorage.getItem("erp_marks")) || {};

  document
    .querySelectorAll("#marksBody input")
    .forEach(input => {
      const roll = input.dataset.roll;
      const value = input.value;

      if (value === "") return;

      if (!marks[roll]) marks[roll] = {};
      marks[roll][subject] = Number(value);
    });

  localStorage.setItem(
    "erp_marks",
    JSON.stringify(marks)
  );

  alert("Marks saved ✅");
}
document
  .getElementById("marksSubject")
  .addEventListener("change", loadExistingMarks);
function loadExistingMarks() {
  const cls = "2A";
  const subject =
    document.getElementById("marksSubject").value;

  const marks =
    JSON.parse(localStorage.getItem("erp_marks")) || {};

  document
    .querySelectorAll("#marksBody input")
    .forEach(inp => {
      const roll = inp.dataset.roll;

      if (
        marks[cls] &&
        marks[cls][subject] &&
        marks[cls][subject][roll] !== undefined
      ) {
        inp.value = marks[cls][subject][roll];
      } else {
        inp.value = "";
      }
    });
}
function deleteSubjectMarks() {
  const cls = "2A";
  const subject =
    document.getElementById("marksSubject").value;

  if (!subject) {
    alert("Select subject first");
    return;
  }

  if (!confirm(
      "Delete ALL marks for this subject?"
  )) return;

  let marks =
    JSON.parse(localStorage.getItem("erp_marks")) || {};

  if (marks[cls] && marks[cls][subject]) {
    delete marks[cls][subject];

    // clean empty class
    if (Object.keys(marks[cls]).length === 0) {
      delete marks[cls];
    }

    localStorage.setItem(
      "erp_marks",
      JSON.stringify(marks)
    );
  }

  // clear UI
  document
    .querySelectorAll("#marksBody input")
    .forEach(i => i.value = "");

  alert("Subject marks deleted ❌");
}
function deleteStudentMark(roll) {
  const cls = "2A";
  const subject =
    document.getElementById("marksSubject").value;

  if (!confirm("Delete this student's marks?"))
    return;

  let marks =
    JSON.parse(localStorage.getItem("erp_marks")) || {};

  if (
    marks[cls] &&
    marks[cls][subject] &&
    marks[cls][subject][roll] !== undefined
  ) {
    delete marks[cls][subject][roll];

    localStorage.setItem(
      "erp_marks",
      JSON.stringify(marks)
    );
  }

  document
    .querySelector(
      `input[data-roll="${roll}"]`
    ).value = "";
}
