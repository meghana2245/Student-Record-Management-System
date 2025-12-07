// --- DATA INITIALIZATION ---
let students = JSON.parse(localStorage.getItem('sms_students')) || [];
let complaints = JSON.parse(localStorage.getItem('sms_complaints')) || [];
let currentUser = null;
let selectedRole = 'admin';

// TRACK EDITING STATE
let editIndex = null; // null means 'Add Mode', number means 'Edit Mode'

// --- AUTHENTICATION FUNCTIONS ---

function selectRole(role, btn) {
    selectedRole = role;
    document.querySelectorAll('.role-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    document.getElementById('loginTitle').innerText = role.charAt(0).toUpperCase() + role.slice(1) + " Login";
    const userField = document.getElementById('loginUser');
    userField.placeholder = role === 'student' ? "Roll Number" : "Username";
}

function attemptLogin() {
    const u = document.getElementById('loginUser').value;
    const p = document.getElementById('loginPass').value;
    const err = document.getElementById('loginError');

    // Admin Check
    if (selectedRole === 'admin' && u === 'admin' && p === 'admin123') {
        loginSuccess('Admin', 'admin');
    } 
    // Staff Check
    else if (selectedRole === 'staff' && u === 'staff' && p === 'staff123') {
        loginSuccess('Staff', 'staff');
    } 
    // Student Check
    else if (selectedRole === 'student') {
        const s = students.find(x => x.roll == u);
        if (s && p === '1234') {
            loginSuccess(s.name, 'student', s.roll);
        } else {
            err.innerText = "Student not found or wrong password (default: 1234).";
        }
    } else {
        err.innerText = "Invalid Credentials";
    }
}

function loginSuccess(name, role, id) {
    currentUser = { name, role, id };
    
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('dashboardScreen').style.display = 'block';
    
    document.getElementById('displayUser').innerText = name;
    document.getElementById('displayRole').innerText = role.toUpperCase();
    
    updateUI();
}

function logout() {
    // Clear user data
    currentUser = null;
    cancelEdit(); // Reset any active edit modes

    // Clear Input Fields
    document.getElementById('loginUser').value = '';
    document.getElementById('loginPass').value = '';
    document.getElementById('loginError').innerText = '';

    // Switch Screens
    document.getElementById('dashboardScreen').style.display = 'none';
    document.getElementById('loginScreen').style.display = 'flex';
}

// --- DASHBOARD UI MANAGEMENT ---

function updateUI() {
    const role = currentUser.role;

    // Hide everything by default
    document.getElementById('adminNav').classList.add('hidden');
    document.getElementById('analyticsSection').classList.add('hidden');
    document.getElementById('managementView').classList.add('hidden');
    document.getElementById('complaintsView').classList.add('hidden');
    document.getElementById('studentView').classList.add('hidden');

    if (role === 'admin') {
        document.getElementById('adminNav').classList.remove('hidden');
        document.getElementById('actionHeader').classList.remove('hidden'); 
        switchSection('dashboard');
    } 
    else if (role === 'staff') {
        document.getElementById('managementView').classList.remove('hidden');
        document.querySelector('#managementView .btn-back').style.display = 'block'; 
        // Staff cannot delete, so actionHeader logic handled in renderTable
        renderTable();
    } 
    else { 
        document.getElementById('studentView').classList.remove('hidden');
        showStudentProfile();
    }
}

// --- NAVIGATION SWITCHER (ADMIN ONLY) ---
function switchSection(section) {
    document.getElementById('analyticsSection').classList.add('hidden');
    document.getElementById('managementView').classList.add('hidden');
    document.getElementById('complaintsView').classList.add('hidden');

    document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));

    if (section === 'dashboard') {
        document.getElementById('analyticsSection').classList.remove('hidden');
        document.getElementById('nav-dashboard').classList.add('active');
        updateBranchStats();
    } 
    else if (section === 'students') {
        document.getElementById('managementView').classList.remove('hidden');
        document.getElementById('nav-students').classList.add('active');
        renderTable();
    }
    else if (section === 'complaints') {
        document.getElementById('complaintsView').classList.remove('hidden');
        document.getElementById('nav-complaints').classList.add('active');
        renderComplaints();
    }
}

// --- ANALYTICS: BRANCH WISE LOGIC ---
function updateBranchStats() {
    document.getElementById('totalCount').innerText = students.length;

    const branches = ['CSE', 'ECE', 'MECH', 'CIVIL'];
    const container = document.getElementById('branchStatsContainer');
    container.innerHTML = ''; 

    branches.forEach(branch => {
        const branchStudents = students.filter(s => s.branch === branch);
        const count = branchStudents.length;
        
        let avg = 0;
        let grade = '-';
        
        if (count > 0) {
            const totalMarks = branchStudents.reduce((sum, s) => sum + s.marks, 0);
            avg = (totalMarks / count).toFixed(1);
            grade = calculateGrade(avg);
        }

        const cardHTML = `
            <div class="branch-card" style="border-left-color: ${getBranchColor(branch)}">
                <h4>${branch}</h4>
                <div class="stat-row">
                    <span>Students:</span>
                    <span class="stat-val">${count}</span>
                </div>
                <div class="stat-row">
                    <span>Avg Marks:</span>
                    <span class="stat-val">${avg}</span>
                </div>
                <div class="stat-row">
                    <span>Overall Grade:</span>
                    <span class="stat-val"><span class="grade-badge grade-${grade}">${grade}</span></span>
                </div>
            </div>
        `;
        container.innerHTML += cardHTML;
    });
}

// --- STUDENT MANAGEMENT (ADD & UPDATE) ---

function handleFormSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('sName').value;
    const roll = parseInt(document.getElementById('sRoll').value);
    const marks = parseInt(document.getElementById('sMarks').value);
    const branch = document.getElementById('sBranch').value;
    const grade = calculateGrade(marks);

    // 1. ADD NEW STUDENT
    if (editIndex === null) {
        if (students.some(s => s.roll === roll)) {
            return alert("Roll Number already exists!");
        }
        students.push({ name, roll, marks, branch, grade });
        alert("Student Added Successfully!");
    } 
    // 2. UPDATE EXISTING STUDENT
    else {
        // Check if Roll exists in OTHER students (not the one being edited)
        if (students.some((s, i) => s.roll === roll && i !== editIndex)) {
            return alert("Roll Number conflict with another student!");
        }
        students[editIndex] = { name, roll, marks, branch, grade };
        alert("Student Updated Successfully!");
        cancelEdit(); // Reset form mode
    }

    saveData();
    document.getElementById('studentForm').reset();
    renderTable();
}

function startEdit(i) {
    const s = students[i];
    editIndex = i;

    // Fill Form
    document.getElementById('sName').value = s.name;
    document.getElementById('sRoll').value = s.roll;
    document.getElementById('sMarks').value = s.marks;
    document.getElementById('sBranch').value = s.branch;

    // UI Changes
    document.getElementById('submitBtn').innerText = "Update Student";
    document.getElementById('submitBtn').style.backgroundColor = "#f39c12"; // Orange for Update
    document.getElementById('cancelBtn').classList.remove('hidden');
    
    // Scroll to top of form
    document.getElementById('managementView').scrollIntoView({behavior: 'smooth'});
}

function cancelEdit() {
    editIndex = null;
    document.getElementById('studentForm').reset();
    
    // UI Reset
    document.getElementById('submitBtn').innerText = "Add Student";
    document.getElementById('submitBtn').style.backgroundColor = ""; // Reset color
    document.getElementById('cancelBtn').classList.add('hidden');
}

function renderTable() {
    const tbody = document.getElementById('tableBody');
    const search = document.getElementById('searchInput').value.toLowerCase();
    tbody.innerHTML = '';

    students.forEach((s, index) => {
        if (s.name.toLowerCase().includes(search) || s.roll.toString().includes(search)) {
            
            let actionBtns = '';
            
            // ADMIN gets Edit AND Delete
            if (currentUser.role === 'admin') {
                actionBtns = `
                    <button class="btn-edit" onclick="startEdit(${index})" title="Edit"><i class="fas fa-edit"></i></button>
                    <button class="btn-del" onclick="deleteStudent(${index})" title="Delete"><i class="fas fa-trash"></i></button>
                `;
            } 
            // STAFF gets Edit ONLY
            else if (currentUser.role === 'staff') {
                actionBtns = `
                    <button class="btn-edit" onclick="startEdit(${index})" title="Edit"><i class="fas fa-edit"></i></button>
                `;
            }

            const row = `
                <tr>
                    <td>${s.name}</td>
                    <td>${s.roll}</td>
                    <td>${s.branch}</td>
                    <td>${s.marks}</td>
                    <td><span class="grade-badge grade-${s.grade}">${s.grade}</span></td>
                    <td>${actionBtns}</td>
                </tr>`;
            tbody.innerHTML += row;
        }
    });
}

function deleteStudent(i) {
    if(confirm("Are you sure you want to delete this student?")) {
        // Prevent deleting if currently editing that index
        if (i === editIndex) cancelEdit();
        
        students.splice(i, 1);
        saveData();
        renderTable();
    }
}

function sortData() {
    students.sort((a, b) => a.roll - b.roll);
    renderTable();
}

// --- STUDENT & COMPLAINT FEATURES ---
function showStudentProfile() {
    const s = students.find(x => x.roll == currentUser.id);
    const div = document.getElementById('studentProfileData');
    
    if (s) {
        div.innerHTML = `
            <p>Name: <b>${s.name}</b></p>
            <p>Roll No: <b>${s.roll}</b></p>
            <p>Branch: <b>${s.branch}</b></p>
            <p>Marks: <b>${s.marks}</b></p>
            <p>Grade: <span class="grade-badge grade-${s.grade}">${s.grade}</span></p>
        `;
    } else {
        div.innerHTML = "Student Record Not Found.";
    }
}

function submitComplaint() {
    const t = document.getElementById('complaintBox').value;
    if(t) {
        complaints.push({
            roll: currentUser.id, 
            text: t, 
            date: new Date().toLocaleDateString()
        });
        localStorage.setItem('sms_complaints', JSON.stringify(complaints));
        alert("Complaint Sent to Admin!");
        document.getElementById('complaintBox').value = '';
    }
}

function renderComplaints() {
    const list = document.getElementById('complaintList');
    if (complaints.length === 0) {
        list.innerHTML = "No complaints yet.";
        return;
    }
    list.innerHTML = complaints.map(c => `<li><b>Roll ${c.roll} (${c.date}):</b> ${c.text}</li>`).join('');
}

// --- HELPER FUNCTIONS ---
function calculateGrade(m) {
    if (m >= 90) return 'A';
    if (m >= 80) return 'B';
    if (m >= 70) return 'C';
    if (m >= 60) return 'D';
    if (m >= 50) return 'E';
    return 'F';
}

function getBranchColor(b) {
    const colors = { 
        'CSE': '#3498db', 
        'ECE': '#e67e22', 
        'MECH': '#e74c3c', 
        'CIVIL': '#2ecc71' 
    };
    return colors[b] || '#333';
}

function saveData() {
    localStorage.setItem('sms_students', JSON.stringify(students));
}

function hardReset() {
    if(confirm("Are you sure? This will delete ALL student data.")) {
        localStorage.clear();
        location.reload();
    }
}