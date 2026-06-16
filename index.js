
// ADMIN 
if (!localStorage.getItem('erp_admin')) {
  localStorage.setItem('erp_admin', JSON.stringify({
    id: "admin",
    password: "admin123",
    name: "Admin User"
  }));
}


// FACULTY 
if (!localStorage.getItem('erp_faculty_list')) {
  const facultyList = [
    { id: "fac01", name: "faculty_name1", password: "011" },
    { id: "fac02", name: "faculty_name2", password: "012" },
    { id: "fac03", name: "faculty_name3", password: "013" },
    { id: "fac04", name: "faculty_name4", password: "014" },
    { id: "fac05", name: "faculty_name5", password: "015" },
    { id: "fac06", name: "faculty_name6", password: "016" },
    { id: "fac07", name: "faculty_name7", password: "017" },
    { id: "fac08", name: "faculty_name8", password: "018" },
    { id: "fac09", name: "faculty_name9", password: "019" },
    { id: "fac10", name: "faculty_name10", password: "020" },

  ];
  localStorage.setItem('erp_faculty_list', JSON.stringify(facultyList));
}

// STUDENTS 
if (!localStorage.getItem('erp_student_list')) {
  const students = [
  { roll: "24001", name: "student_1", password: "stud001", class: "2A" },
  { roll: "24002", name: "student_2", password: "stud002", class: "2B" },
  { roll: "24003", name: "student_3", password: "stud003", class: "2B" },
  { roll: "24004", name: "student_4", password: "stud004", class: "2A" },
  { roll: "24005", name: "student_5", password: "stud005", class: "2A" },
  { roll: "24006", name: "student_6", password: "stud006" , class: "2A" },
  { roll: "24007", name: "student_7", password: "stud007" , class: "2B" },
  { roll: "24008", name: "student_8", password: "stud008" , class: "2A" },
  { roll: "24009", name: "student_9", password: "stud009" , class: "2B" },
  { roll: "24010", name: "student_10", password: "stud010" , class: "2B" },
  { roll: "24011", name: "student_11", password: "stud011" ,  class: "2B" },
  { roll: "24012", name: "student_12", password: "stud012" , class: "2A" },
  { roll: "24013", name: "student_13", password: "stud013" , class: "2A" },
  { roll: "24014", name: "student_14", password: "stud014" , class: "2B" },
  { roll: "24015", name: "student_15", password: "stud015" , class: "2A" },
  { roll: "24016", name: "student_16", password: "stud016" , class: "2B" },
  { roll: "24017", name: "student_17", password: "stud017" , class: "2B" },
  { roll: "24018", name: "student_18", password: "stud018" , class: "2B" },
  { roll: "24019", name: "student_19", password: "stud019" , class: "2B" },
  { roll: "24020", name: "student_20", password: "stud020" , class: "2B" },
  { roll: "24021", name: "student_21", password: "stud021"  , class: "2B" },
  { roll: "24022", name: "student_22", password: "stud022" , class: "2B" },
  { roll: "24023", name: "student_23", password: "stud023" , class: "2B" },
  { roll: "24024", name: "student_24", password: "stud024" , class: "2B" },
  { roll: "24025", name: "student_25", password: "stud025", class: "2B" },

];

  localStorage.setItem('erp_student_list', JSON.stringify(students));
}
// SUBJECTS — Initialize only if not already present
if (!localStorage.getItem('erp_subject_list')) {
  const subjectList = [
    { code: "01", name: "Computer Organization and Architecture" },
    { code: "02", name: "Data Structures" },
    { code: "03", name: "Digital Electronics" },
    { code: "04", name: "Discrete Structure and Theory of Logic" },
    { code: "05", name: "Web Designing Workshop" },
    { code: "06", name: "Data Structures Using C Lab" },
    { code: "07", name: "Computer Organization and Architecture Lab" },
    { code: "08", name: "Cyber Security" },
    { code: "09", name: "Employability Training" },
    { code: "10", name: "Technical Communication" }
  ];

  localStorage.setItem('erp_subject_list', JSON.stringify(subjectList));
  console.log("✅ Subject list initialized.");
}

// ====== LOGIN FUNCTIONALITY ======
const form = document.getElementById('loginForm');

if (form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const role = document.getElementById('role').value;
    const id = document.getElementById('id').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!role || !id || !password) {
      alert("Please fill all fields!");
      return;
    }

    // ADMIN
    if (role === 'admin') {
      const admin = JSON.parse(localStorage.getItem('erp_admin'));
      if (admin && admin.id === id && admin.password === password) {
        localStorage.setItem('loggedInUser', JSON.stringify({
          role: 'admin',
          id: admin.id,
          name: admin.name
        }));
        window.location.href = "admin.html";
        return;
      }
      alert("Invalid admin credentials");
      return;
    }

    // FACULTY
  if (role === "faculty") {
  const facultyList = JSON.parse(localStorage.getItem("erp_faculty_list")) || [];

  const faculty = facultyList.find(
    f => f.id === id && f.password === password
  );

  if (!faculty) {
    alert("Invalid faculty credentials");
    return;
  }

  localStorage.setItem("loggedInUser", JSON.stringify({
    role: "faculty",
    id: faculty.id,
    name: faculty.name
  }));

  window.location.href = "faculty.html";
}


    // STUDENT
    if (role === "student") {
  const studentList = JSON.parse(localStorage.getItem("erp_student_list")) || [];
  const student = studentList.find(
    s => s.roll === id && s.password === password
  );

  if (!student) {
    alert("❌ Invalid student credentials!");
    return;
  }

  localStorage.setItem("loggedInUser", JSON.stringify({
    role: "student",
    roll: student.roll,
    name: student.name,
    program: "BTECH",
    semester: "3",
    class: "2 A"
  }));

  window.location.href = "student.html";
}
  });
}