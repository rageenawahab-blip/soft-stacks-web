// --- 1. GLOBAL VARIABLES & STATE ---
let editingCourseId = null;

// --- 2. THE MAIN INITIALIZATION BLOCK ---
document.addEventListener('DOMContentLoaded', () => {
    // A. Run generic updates
    updateInquiryStats();
    updateCourseStats();

    // B. PAGE-SPECIFIC LOADING (Safety Checks Included)
    if (document.getElementById('inquiryBody')) {
        loadInquiries();
    }
    
    if (document.getElementById('courseGrid')) {
        displayCoursesOnLandingPage();
    }

    if (document.getElementById('dynamicCourseGrid')) {
        loadHomeCourses();
    }

    if (document.querySelector('.dashboard-container')) {
        fetchStudents();
        fetchTeachers();
    }

    // C. EVENT LISTENERS (Form Submits & Toggles)

    // Admin Login Logic
  const loginForm = document.querySelector('.login-box form');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
      const email = document.getElementById('username').value.trim(); // .trim() removes accidental spaces
const password = document.getElementById('password').value;

if (!email || !password) {
    alert("Please enter both email and password.");
    return; // Stops the code from trying to fetch
}
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                     email: email, 
                    password: password })
            });

            const data = await response.json();

          if (response.ok) {
    // Save the user details so the dashboard can say "Welcome, Rageena"
    localStorage.setItem('token', data.token); // If your backend sends a JWT
    localStorage.setItem('userEmail', data.user); 
    sessionStorage.setItem('isAdmin', 'true');
    
    window.location.href = "dashboard.html";
} else {
    // Access the .message property from your backend JSON
   alert("Error: " + data.message);
}
        } catch (err) {
    console.error("Login Error:", err);
    alert("Could not connect to the server. Please ensure your backend is running on port 5000.");
}
    });
}

    // Password Toggle
    const togglePassword = document.querySelector('#togglePassword');
    const passwordInput = document.querySelector('#password');
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function () {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.textContent = type === 'password' ? 'Show' : 'Hide';
        });
    }

    // Logout Logic
    const logoutBtn = document.querySelector('.logout');
   if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
        if (confirm("Are you sure you want to log out?")) {
            sessionStorage.removeItem('isAdmin'); // Clear the session
            localStorage.removeItem('token');     // Clear the token
            window.location.href = "admin-login.html"; // Send them back to login
        } else {
            e.preventDefault();
        }
    });
}

    // Student Enrollment
    const studentForm = document.getElementById('enrollStudentForm');
    if (studentForm) {
        studentForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const studentData = {
                name: document.getElementById('sName').value,
                email: document.getElementById('sEmail').value,
                phone: document.getElementById('sPhone').value,
                course: document.getElementById('sCourse').value
            };
            try {
                const response = await fetch('/api/students/enroll', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(studentData)
                });
                if (response.ok) {
                    closeStudentModal();
                    studentForm.reset();
                    showSuccessToast("Student Enrolled", "Successfully saved to Railway.");
                    fetchStudents();
                }
            } catch (err) { console.error("Enrollment error:", err); }
        });
    }

    // Teacher Directory
    const teacherForm = document.getElementById('addTeacherForm');
    if (teacherForm) {
        teacherForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const selectedSubjects = Array.from(document.querySelectorAll('input[name="sub"]:checked')).map(cb => cb.value);
            const teacherData = {
                name: document.getElementById('teacherName').value,
                experience: document.getElementById('teacherExp').value,
                subjects: selectedSubjects
            };
            try {
                const response = await fetch('/api/teachers/add', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(teacherData)
                });
                if (response.ok) {
                    closeTeacherModal();
                    teacherForm.reset();
                    showSuccessToast("Mentor Added", "New teacher saved to Railway!");
                    fetchTeachers();
                }
            } catch (error) { console.error("Error saving teacher:", error); }
        });
    }

    // Course Add/Edit Form
    const courseForm = document.getElementById('addCourseForm');
    if (courseForm) {
        courseForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const courseData = {
                courseName: document.getElementById('cName').value,
                duration: document.getElementById('cDuration').value,
                fees: document.getElementById('cFees').value,
                status: document.getElementById('cStatus').value
            };
            const url = editingCourseId ? `/api/courses/${editingCourseId}` : `/api/courses/add`;
            const method = editingCourseId ? 'PUT' : 'POST';
            try {
                const response = await fetch(url, {
                    method: method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(courseData)
                });
                if (response.ok) {
                    closeCourseModal();
                    courseForm.reset();
                    editingCourseId = null;
                    document.querySelector('#courseModal h3').innerText = "Create New Course";
                    document.querySelector('#addCourseForm .save-btn').innerText = "Publish Course";
                    showSuccessToast("Success", "Course list updated!");
                    displayCoursesOnLandingPage();
                    updateCourseStats();
                }
            } catch (err) { console.error("Save error:", err); }
        });
    }

    // Home Inquiry Form (Final Version)
    const inquiryForm = document.getElementById('homeInquiryForm');
    if (inquiryForm) {
        inquiryForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = {
                name: document.getElementById('userName').value,
                email: document.getElementById('userEmail').value,
                message: document.getElementById('userMessage').value,
                date: new Date()
            };
            try {
                const response = await fetch('/api/inquiries', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
                if (response.ok) {
                    alert("Thank you! We will contact you soon.");
                    inquiryForm.reset();
                    if(typeof loadInquiries === "function") loadInquiries();
                } else {
                    alert("Server error. Please try again later.");
                }
            } catch (err) { alert("Could not connect to server. Is your Backend running?"); }
        });
    }

    // Homepage Sliders
    const tSlides = document.querySelectorAll('.testimonial-slide');
    if (tSlides.length > 0) {
        let tStep = 0;
        setInterval(() => {
            tSlides.forEach(s => s.classList.remove('active'));
            tStep = (tStep + 1) % tSlides.length;
            tSlides[tStep].classList.add('active');
        }, 3000);
    }

    const track = document.getElementById('galleryTrack');
    if (track) {
        let gPosition = 0;
        setInterval(() => {
            const maxMove = track.scrollWidth - track.parentElement.clientWidth;
            gPosition = (Math.abs(gPosition) >= maxMove) ? 0 : gPosition - 315;
            track.style.transform = `translateX(${gPosition}px)`;
        }, 3000);
    }
});

// --- 3. HELPER FUNCTIONS (Outside DOMContentLoaded for Global Access) ---

async function fetchStudents() {
    const studentBody = document.getElementById('studentBody');
    if (!studentBody) return;
    try {
        const res = await fetch('/api/students/list');
        const data = await res.json();
        const studentStat = document.querySelector('.stat-card:nth-child(1) .number');
        if (studentStat) studentStat.innerText = data.length;
        if (data.length === 0) {
            studentBody.innerHTML = `<tr><td colspan="5" style="text-align:center;">No students enrolled yet.</td></tr>`;
            return;
        }
        studentBody.innerHTML = data.map(s => `
            <tr>
                <td><strong>${s.name}</strong></td>
                <td>${s.course}</td>
                <td>${s.email}</td>
                <td>${new Date(s.enrollmentDate).toLocaleDateString('en-IN')}</td>
                <td><button class="add-btn" onclick="deleteStudent('${s._id}')" style="background:#ff4757; color:white;">Delete</button></td>
            </tr>`).join('');
    } catch (err) { console.error(err); }
}
// --- 2. FETCH TEACHERS WITH SPECIALIZATION & STATUS BADGES ---
async function fetchTeachers() {
    const teacherBody = document.getElementById('teacherBody');
    if (!teacherBody) return;
    try {
        const res = await fetch('/api/teachers/list');
        const data = await res.json();
        teacherBody.innerHTML = ""; 
        if (data.length === 0) {
            teacherBody.innerHTML = `<tr><td colspan="5" style="text-align:center;">No mentors found.</td></tr>`;
            return;
        }
        teacherBody.innerHTML = data.map(t => {
            const specialization = t.subjects && t.subjects.length > 0 ? t.subjects.join(', ') : 'General';
            const statusClass = t.status === 'Active' ? 'status paid' : 'status pending';
            return `
                <tr>
                    <td><strong>${t.name}</strong></td>
                    <td>${specialization}</td>
                    <td>${t.experience} Years</td>
                    <td><span class="${statusClass}">${t.status || 'Active'}</span></td>
                    <td><button class="add-btn" style="background:#ff4757;" onclick="deleteTeacher('${t._id}')">Delete</button></td>
                </tr>`;
        }).join('');
    } catch (err) { console.error(err); }
}
// --- 1. FIXED DELETE FUNCTION ---
async function deleteInquiry(id) {
    if (!confirm("Are you sure you want to remove this inquiry?")) return;

    try {
        const res = await fetch(`/api/inquiries/${id}`, {
            method: 'DELETE'
        });

        if (res.ok) {
            showSuccessToast("Deleted", "Inquiry removed from database.");
            
            // Fixed the typo: added space between await and function name
            await loadInquiries(); 
            
            // Refresh the dashboard count card
            await updateInquiryStats(); 
        } else {
            alert("Delete failed. Check backend console.");
        }
    } catch (err) {
        console.error("Delete connection error:", err);
    }
}

// --- 2. FIXED STATS FUNCTION ---
async function updateInquiryStats() {
    const inquiryStat = document.getElementById('inquiry-count'); 
    
    // 🛑 STOP if the element doesn't exist (e.g., on Login Page)
    if (!inquiryStat) return; 

    console.log("📡 Fetching stats...");
    try {
        const res = await fetch('/api/inquiries');
        if (!res.ok) throw new Error("Backend unreachable");
        
        const data = await res.json();
        
        if (Array.isArray(data)) {
            inquiryStat.innerText = data.length;
            console.log("✅ Stats updated to:", data.length);
        }
    } catch (err) { 
        console.error("❌ Stats fetch failed:", err.message); 
    }
}
// --- 3. UPDATED LOAD FUNCTION ---
async function loadInquiries() {
    const tableBody = document.getElementById('inquiryBody'); 
    if (!tableBody) return; 

    try {
        const response = await fetch('/api/inquiries');
        const inquiries = await response.json();
        
        // Update the count card whenever we load the table
        updateInquiryStats(); 

        tableBody.innerHTML = ''; 

        if (inquiries.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No inquiries found.</td></tr>';
            return;
        }

        inquiries.forEach(item => {
            const row = document.createElement('tr');
            const date = item.date ? new Date(item.date).toLocaleDateString('en-IN') : 'N/A';

            row.innerHTML = `
                <td>${date}</td>
                <td><strong>${item.name}</strong></td>
                <td>${item.email}</td>
                <td>${item.message || 'No message'}</td>
                <td>
                    <button onclick="deleteInquiry('${item._id}')" class="add-btn" 
                            style="background:#ff4757; padding: 6px 12px; border:none; color:white; border-radius:4px; cursor:pointer;">
                        Delete
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (err) { 
        console.error("❌ Error loading inquiries:", err); 
    }
}
// --- 1. DISPLAY COURSES ON LANDING PAGE (With Edit/Delete) ---
async function displayCoursesOnLandingPage() {
    const courseGrid = document.getElementById('courseGrid');
    if (!courseGrid) return;
    try {
        const res = await fetch('/api/courses/list');
        const courses = await res.json();
        if (courses.length === 0) {
            courseGrid.innerHTML = "<p>No courses found.</p>";
            return;
        }
        courseGrid.innerHTML = courses.map(c => `
            <div class="course-card">
                <div class="status-badge status-${c.status.toLowerCase()}">${c.status}</div>
                <h3>${c.courseName}</h3>
                <p>⏱ Duration: ${c.duration}</p>
                <p class="price">₹${c.fees}</p>
                <div class="course-actions" style="margin-top: 15px; display: flex; gap: 10px;">
                    <button class="add-btn" onclick="prepareEditCourse('${c._id}', '${c.courseName}', '${c.duration}', '${c.fees}', '${c.status}')" style="background: #f59e0b; flex: 1;">Edit</button>
                    <button class="add-btn" onclick="deleteCourse('${c._id}')" style="background: #ef4444; flex: 1;">Delete</button>
                </div>
            </div>`).join('');
    } catch (err) { console.error(err); }
}
// --- 2. LOAD COURSES ON HOMEPAGE (Grid Version) ---
async function loadHomeCourses() {
    const grid = document.getElementById('dynamicCourseGrid');
    if (!grid) return;
    try {
        const response = await fetch('/api/courses/list');
        const courses = await response.json();
        grid.innerHTML = '';
        if (!Array.isArray(courses)) return;
        courses.forEach(course => {
            const icon = getCourseIcon(course.courseName);
            const card = document.createElement('div');
            card.className = 'course-card';
            card.innerHTML = `
                <div class="icon">${icon}</div>
                <h3>${course.courseName}</h3>
                <p>Duration: ${course.duration}</p>
                <div class="course-footer">
                    <span class="price">₹${course.fees}</span>
                    <span class="status-tag">${course.status}</span>
                </div>
                <a href="#contact" class="btn-secondary">Enquire Now</a>`;
            grid.appendChild(card);
        });
    } catch (err) { console.error(err); }
}

// --- 4. UTILITY & MODAL FUNCTIONS ---

window.viewInquiryDetails = function(id) {
    console.log("Viewing inquiry ID:", id);
    alert("Inquiry ID: " + id + "\nCheck console for details.");
};
// --- 1. COURSE ICON MAPPING FUNCTION ---
function getCourseIcon(courseName) {
    const name = (courseName || "").toLowerCase();
    const iconMap = { 'python': '🐍', 'mern': '⚛️', 'react': '⚛️', 'ui': '🎨', 'ux': '🎨', 'node': '🟢', 'cyber': '🛡️', 'data': '📊', 'mobile': '📱', 'flutter': '💙' };
    const foundKeyword = Object.keys(iconMap).find(key => name.includes(key));
    return foundKeyword ? iconMap[foundKeyword] : '💻';
}
// --- 2. PREPARE COURSE EDIT (Fills Modal with Existing Data) ---
function prepareEditCourse(id, name, duration, fees, status) {
    editingCourseId = id;
    document.getElementById('cName').value = name;
    document.getElementById('cDuration').value = duration;
    document.getElementById('cFees').value = fees;
    document.getElementById('cStatus').value = status;
    document.querySelector('#courseModal h3').innerText = "Edit Course Details";
    document.querySelector('#addCourseForm .save-btn').innerText = "Update Course";
    openCourseModal();
}
// --- 3. DELETE FUNCTIONS (Courses, Teachers, Students) ---
async function deleteCourse(id) {
    if (!confirm("Are you sure?")) return;
    const res = await fetch(`/api/courses/${id}`, { method: 'DELETE' });
    if (res.ok) { displayCoursesOnLandingPage(); updateCourseStats(); }
}

async function deleteTeacher(id) {
    if (!confirm("Are you sure?")) return;
    const res = await fetch(`/api/teachers/${id}`, { method: 'DELETE' });
    if (res.ok) fetchTeachers();
}

async function deleteStudent(id) {
    if (!confirm("Are you sure?")) return;
    const res = await fetch(`/api/students/${id}`, { method: 'DELETE' });
    if (res.ok) fetchStudents();
}

async function updateCourseStats() {
    try {
        const res = await fetch('/api/courses/list');
        const data = await res.json();
        const courseStat = document.querySelectorAll('.stat-card .number')[1];
        if (courseStat) courseStat.innerText = data.length;
    } catch (err) { console.log(err); }
}

// --- 5. MODAL CONTROL FUNCTIONS ---

function openStudentModal() { document.getElementById('studentModal').style.display = 'flex'; }
function closeStudentModal() { document.getElementById('studentModal').style.display = 'none'; }
function openTeacherModal() { document.getElementById('teacherModal').style.display = 'flex'; }
function closeTeacherModal() { document.getElementById('teacherModal').style.display = 'none'; }
function openCourseModal() { document.getElementById('courseModal').style.display = 'flex'; }
function closeCourseModal() { document.getElementById('courseModal').style.display = 'none'; }

function showSuccessToast(title, message) {
    const toast = document.getElementById('successToast');
    if (!toast) return;
    document.getElementById('toastTitle').innerText = title;
    document.getElementById('toastMessage').innerText = message;
    toast.style.display = 'block';
    setTimeout(() => { toast.style.display = 'none'; }, 4000);
}

// Sidebar Highlighting Logic
document.querySelectorAll('.sidebar nav a').forEach(link => {
    link.addEventListener('click', function(e) {
        if (this.classList.contains('logout')) return;
        document.querySelectorAll('.sidebar nav a').forEach(nav => nav.classList.remove('active'));
        this.classList.add('active');
    });
});

// Back to Top Button
const backToTopButton = document.getElementById("backToTop");
if (backToTopButton) {
    window.onscroll = function() {
        if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
            backToTopButton.classList.add("show");
        } else {
            backToTopButton.classList.remove("show");
        }
    };
    backToTopButton.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}
// Mobile Menu Toggle
// --- Mobile Menu Toggle ---
const menuToggle = document.getElementById('mobile-menu');
const navLinks = document.querySelector('.nav-links');

// ONLY run this if the elements exist (True on Index, False on Admin)
if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Close menu when a link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });
}