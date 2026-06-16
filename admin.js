// ===================== ADMIN AUTH CHECK =====================
const logged = JSON.parse(localStorage.getItem("loggedInUser") || "null");
if (!logged || logged.role !== "admin") window.location.href = "index.html";
document.getElementById("adminName").textContent = `Welcome, ${logged.name || logged.id}`;

// ===================== INITIAL DEFAULT DATA =====================
if (!localStorage.getItem("erp_faculty_list")) {
  const facultyList = [
    { id: "FAC001", name: "Prof. Sharma", password: "fac001" },
    { id: "FAC002", name: "Prof. Mehta", password: "fac002" },
    { id: "FAC003", name: "Prof. Rao", password: "fac003" }
  ];
  localStorage.setItem("erp_faculty_list", JSON.stringify(facultyList));
}

if (!localStorage.getItem("erp_subject_list")) {
  const subjectList = [
    { code: "SUB001", name: "Computer Organization" },
    { code: "SUB002", name: "Data Structures" },
    { code: "SUB003", name: "Digital Electronics" }
  ];
  localStorage.setItem("erp_subject_list", JSON.stringify(subjectList));
}

let students = JSON.parse(localStorage.getItem("erp_student_list") || "[]");

if (students.length === 0) {
  alert("⚠ No students found. Please add students.");
}

let passwordVisible = true;

function escapeHtml(text) {
  return String(text || "")
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

// ===================== TABLE POPULATION =====================
function populateTables() {
  const faculty = JSON.parse(localStorage.getItem("erp_faculty_list") || "[]");
  const studData = JSON.parse(localStorage.getItem("erp_student_list") || "[]");

  const fBody = document.querySelector("#facultyTable tbody");
  const sBody = document.querySelector("#studentsTable tbody");
  fBody.innerHTML = "";
  sBody.innerHTML = "";

  // Faculty Table
  faculty.forEach((f, i) => {
    fBody.innerHTML += `
      <tr>
        <td>${i + 1}</td>
        <td>${escapeHtml(f.id)}</td>
        <td>${escapeHtml(f.name)}</td>
        <td class="pwd" data-raw="${f.password}">
          ${passwordVisible ? f.password : "••••••"}
        </td>
        <td>
          <button class="btn btn-edit" onclick="editFaculty('${f.id}')">Edit</button>
          <button class="btn btn-delete" onclick="deleteFaculty('${f.id}')">Delete</button>
        </td>
      </tr>`;
  });

  // Student Table
  studData.forEach((s, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${escapeHtml(s.roll)}</td>
      <td>${escapeHtml(s.name)}</td>
      <td>${escapeHtml(s.program || 'BTECH')}</td>
      <td>${escapeHtml(s.semester || '3')}</td>
      <td>${escapeHtml(s.class || '2A')}</td>
      <td class="pwd" data-raw="${s.password}">
        ${passwordVisible ? s.password : '••••••'}
      </td>
      <td>
        <button class="btn btn-edit" onclick="editStudent('${s.roll}')">Edit</button>
        <button class="btn btn-delete" onclick="deleteStudent('${s.roll}')">Delete</button>
      </td>`;
    sBody.appendChild(tr);
  });
}

// ===================== PASSWORD TOGGLE =====================
document.getElementById("togglePasswords").addEventListener("click", () => {
  passwordVisible = !passwordVisible;
  document.querySelectorAll(".pwd").forEach(cell => {
    cell.textContent = passwordVisible ? cell.dataset.raw : "••••••";
  });
  document.getElementById("togglePasswords").textContent = passwordVisible ? "Hide" : "Show";
});

// ===================== FACULTY FUNCTIONS =====================
function editFaculty(id) {
  const faculty = JSON.parse(localStorage.getItem("erp_faculty_list") || "[]");
  const f = faculty.find(x => x.id === id);
  if (!f) return;

  const newName = prompt("Enter new name:", f.name);
  const newPass = prompt("Enter new password:", f.password);

  if (newName && newPass) {
    f.name = newName;
    f.password = newPass;
    localStorage.setItem("erp_faculty_list", JSON.stringify(faculty));
    populateTables();
  }
}

function deleteFaculty(id) {
  if (!confirm("Delete this faculty?")) return;
  let list = JSON.parse(localStorage.getItem("erp_faculty_list") || "[]");
  list = list.filter(x => x.id !== id);
  localStorage.setItem("erp_faculty_list", JSON.stringify(list));
  populateTables();
}

document.getElementById("addFacultyBtn").addEventListener("click", () => {
  const id = prompt("Enter Faculty ID:");
  const name = prompt("Enter Name:");
  const pass = prompt("Enter Password:");

  if (id && name && pass) {
    const faculty = JSON.parse(localStorage.getItem("erp_faculty_list") || "[]");
    if (faculty.some(f => f.id === id)) return alert("Faculty ID already exists!");
    faculty.push({ id, name, password: pass });
    localStorage.setItem("erp_faculty_list", JSON.stringify(faculty));
    populateTables();
  }
});

// ===================== STUDENT FUNCTIONS =====================
function editStudent(roll) {
  const studData = JSON.parse(localStorage.getItem("erp_student_list") || "[]");
  const s = studData.find(x => x.roll === roll);
  if (!s) return;

  const newName = prompt("Enter new name:", s.name);
  const newPassword = prompt("Enter new password:", s.password);
  const newProgram = prompt("Enter Program:", s.program || "");
  const newSemester = prompt("Enter Semester:", s.semester || "");
  const newClass = prompt("Enter Class:", s.class || "");

  if (newName && newPassword) {
    s.name = newName;
    s.password = newPassword;
    s.program = newProgram;
    s.semester = newSemester;
    s.class = newClass;
    localStorage.setItem("erp_student_list", JSON.stringify(studData));
    populateTables();
  }
}

function deleteStudent(roll) {
  if (!confirm("Delete this student?")) return;
  let studData = JSON.parse(localStorage.getItem("erp_student_list") || "[]");
  studData = studData.filter(x => x.roll !== roll);
  localStorage.setItem("erp_student_list", JSON.stringify(studData));
  populateTables();
}

document.getElementById("addStudentBtn").addEventListener("click", () => {
  const roll = prompt("Enter Roll No:");
  const name = prompt("Enter Name:");
  const pass = prompt("Enter Password:");
  const program = prompt("Enter Program:");
  const sem = prompt("Enter Semester:");
  const classGroup = prompt("Enter Class:");

  if (roll && name && pass) {
    const studData = JSON.parse(localStorage.getItem("erp_student_list") || "[]");
    if (studData.some(s => s.roll === roll)) return alert("Roll number already exists!");
    studData.push({ roll, name, password: pass, program, semester: sem, class: classGroup });
    localStorage.setItem("erp_student_list", JSON.stringify(studData));
    populateTables();
  }
});

// ===================== LOGOUT =====================
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("loggedInUser");
  window.location.href = "index.html";
});
// ===================== ATTENDANCE =====================
const attendance = JSON.parse(localStorage.getItem("erp_attendance") || "{}");
const attTable = document.querySelector("#attendanceTable tbody");
attTable.innerHTML = "";

students.forEach(s => {
  const subjData = attendance[s.roll] || {};
  
  // calculate total across subjects
  let total = 0;
  let present = 0;

  Object.values(subjData).forEach(rec => {
    total += rec.total || 0;
    present += rec.present || 0;
  });

  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td>${s.roll}</td>
    <td>${s.name}</td>
    <td>${total}</td>
    <td>${present}</td>
    <td>-</td>
  `;
  attTable.appendChild(tr);
});

// ===================== TIMETABLE DATA =====================
const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const timeSlots = [
  "9:00 to 9:50", "9:50 to 10:40", "10:50 to 11:40", "11:40 to 12:30",
  "1:20 to 2:10", "2:10 to 3:00", "3:10 to 4:00", "4:00 to 4:50"
];

let timetable = JSON.parse(localStorage.getItem("erp_timetable") || "[]");

// ===================== LOAD DROPDOWNS =====================
function loadTimetableDropdowns() {

  // SUBJECTS
  const subjectSelect = document.getElementById("subjectSelect");
  subjectSelect.innerHTML = `<option value="">Select Subject</option>`;
  const subjects = JSON.parse(localStorage.getItem("erp_subject_list") || "[]");
  subjects.forEach(s => {
    const opt = document.createElement("option");
    opt.value = s.name;
    opt.textContent = s.name;
    subjectSelect.appendChild(opt);
  });

  // FACULTY
  const facultySelect = document.getElementById("facultySelect");
  facultySelect.innerHTML = `<option value="">Select Faculty</option>`;
  const faculty = JSON.parse(localStorage.getItem("erp_faculty_list") || "[]");

  faculty.forEach(f => {
    const opt = document.createElement("option");
    opt.value = f.id;        // ID
    opt.textContent = f.name; // Name
    facultySelect.appendChild(opt);
  });
}

// ===================== ADD LECTURE =====================
document.getElementById("timetable-form").addEventListener("submit", e => {
  e.preventDefault();

  const daySelect = document.getElementById("daySelect");
const timeSlot = document.getElementById("timeSlot");
const classSelect = document.getElementById("classSelect");
const classRoom = document.getElementById("classRoom");


  const facultySelect = document.getElementById("facultySelect");
  const subjectSelect = document.getElementById("subjectSelect");

  if (!facultySelect.value || !subjectSelect.value) {
    alert("Fill all fields");
    return;
  }

const entry = {
  day: daySelect.value,
  time: timeSlot.value,
  subject: subjectSelect.value,
  facultyId: facultySelect.value,
  facultyName: facultySelect.options[facultySelect.selectedIndex].text,
  class: classSelect.value,          // 🔴 REQUIRED
  classRoom: classRoom.value
};

  timetable.push(entry);
  localStorage.setItem("erp_timetable", JSON.stringify(timetable));
  renderTimetable();
  e.target.reset();
});

// ===================== RENDER TIMETABLE =====================
function renderTimetable() {
  const body = document.getElementById("timetable-body");
  body.innerHTML = "";

  days.forEach(day => {
    let row = `<tr><td><strong>${day}</strong></td>`;

    timeSlots.forEach(slot => {
    const selectedClass = "2A"; // later: from logged student/faculty

const index = timetable.findIndex(
  t => t.day === day && t.time === slot && t.class === selectedClass
);

      if (index !== -1) {
        const t = timetable[index];
        row += `
          <td>
            <strong>${t.subject}</strong><br>
            ${t.facultyName}<br>
            class: ${t.class}<br>
            Room: ${t.classRoom}<br>
            <button onclick="editLecture(${index})">Edit</button>
            <button onclick="deleteLecture(${index})">Delete</button>
          </td>
        `;
      } else {
        row += `<td>—</td>`;
      }
    });

    row += "</tr>";
    body.innerHTML += row;
  });
}

// ===================== EDIT / DELETE =====================
function deleteLecture(index) {
  if (!confirm("Delete lecture?")) return;
  timetable.splice(index, 1);
  localStorage.setItem("erp_timetable", JSON.stringify(timetable));
  renderTimetable();
}

function editLecture(index) {
  const t = timetable[index];

  const facultySelect = document.getElementById("facultySelect");
  const subjectSelect = document.getElementById("subjectSelect");
  const daySelect = document.getElementById("daySelect");
  const timeSlot = document.getElementById("timeSlot");
  const classRoom = document.getElementById("classRoom");
  const classSelect = document.getElementById("classSelect");

  facultySelect.value = t.facultyId;
  subjectSelect.value = t.subject;
  daySelect.value = t.day;
  timeSlot.value = t.time;
  classSelect.value = t.class;
  classRoom.value = t.classRoom;

  timetable.splice(index, 1);
  localStorage.setItem("erp_timetable", JSON.stringify(timetable));
  renderTimetable();
}

// ===================== INIT =====================
loadTimetableDropdowns();
renderTimetable();

// ===================== SEARCH & FILTER =====================
document.getElementById("searchFaculty").addEventListener("input", function() {
    const query = this.value.toLowerCase();
    document.querySelectorAll("#facultyTable tbody tr").forEach(row => {
        const name = row.cells[2].textContent.toLowerCase();
        const id = row.cells[1].textContent.toLowerCase();
        row.style.display = name.includes(query) || id.includes(query) ? "" : "none";
    });
});

document.getElementById("searchStudents").addEventListener("input", filterStudents);
document.getElementById("studProgram").addEventListener("input", filterStudents);
document.getElementById("studSemester").addEventListener("input", filterStudents);
document.getElementById("studClass").addEventListener("input", filterStudents);

function filterStudents() {
    const programVal = document.getElementById("studProgram").value.toLowerCase();
    const semVal = document.getElementById("studSemester").value.toLowerCase();
    const classVal = document.getElementById("studClass").value.toLowerCase();
    document.querySelectorAll("#studentsTable tbody tr").forEach(row => {
        const program = row.cells[3].textContent.toLowerCase();
        const sem = row.cells[4].textContent.toLowerCase();
        const cls = row.cells[5].textContent.toLowerCase();
        row.style.display = (!programVal || program.includes(programVal)) &&
                             (!semVal || sem.includes(semVal)) &&
                             (!classVal || cls.includes(classVal)) ? "" : "none";
    });
}

// ===================== INITIAL LOAD =====================
populateTables();
