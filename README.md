# 🎓 Student Management System (SMS) Portal

A responsive, role-based web application to manage student records, department analytics, and complaints. Built using **HTML**, **CSS**, and **JavaScript**, utilizing `localStorage` for data persistence without a backend database.

## 🚀 Features

### 1. 🔐 Role-Based Access Control (RBAC)
The system supports three distinct user roles with specific permissions:

* **Admin:**
    * ✅ Full Access to Dashboard Analytics (Branch-wise performance).
    * ✅ **CRUD Operations:** Add, View, Search, Update, and Delete students.
    * ✅ View complaints submitted by students.
    * ✅ Sidebar navigation for seamless switching between modules.
* **Staff:**
    * ✅ Limited Access (Focused on Management).
    * ✅ **CRU Operations:** Add, View, Search, and Update student details.
    * ❌ Cannot Delete students.
    * ❌ No access to global analytics or complaints.
* **Student:**
    * ✅ View personal academic profile (Marks, Grade, Attendance).
    * ✅ Submit complaints to the Admin.
    * ✅ Cannot view other students' data.

### 2. 📊 Dashboard & Analytics (Admin Only)
* Visual breakdown of students by Branch (CSE, ECE, MECH, CIVIL).
* Automatic calculation of **Average Marks** and **Overall Grade** per department.
* Real-time counter for total enrolled students.

### 3. 🛠 Data Management
* **Search Functionality:** Filter students instantly by Name or Roll Number.
* **Sorting:** Sort student list by Roll Number.
* **Auto-Grading:** System automatically assigns grades (A-F) based on marks entered.
* **Update System:** Admin and Staff can edit existing student records.
* **Data Persistence:** All data is saved in the browser's `localStorage`.

---

## 🛠️ Technologies Used

* **Frontend Structure:** HTML5
* **Styling:** CSS3 (Flexbox, CSS Grid, Custom Variables, Responsive Design)
* **Logic & Data:** JavaScript (ES6+, DOM Manipulation, LocalStorage API)
* **Icons:** FontAwesome 6.0

---


## 🔑 Default Login Credentials

Use the following credentials to test the different roles:

| **Role** | **Username / ID** | **Password** | **Access Level** |
| --- | --- | --- | --- |
| **Admin** | `admin` | `admin123` | Full Control |
| **Staff** | `staff` | `staff123` | Add/Update Only |
| **Student** | _(Enter Roll No)_ | `1234` | View Profile Only |

> **Note:** To log in as a student, you must first add a student via the Admin or Staff account. Use that student's **Roll Number** as the username and `1234` as the default password.

---

## 🚀 How to Run

Download or Clone the repository.

Ensure you have an internet connection (for loading FontAwesome icons).

Open `index.html` in any modern web browser (Chrome, Firefox, Edge).

Login using the credentials provided above.

---

## 📸 Usage Guide

### 1\. Admin Workflow

Log in as Admin.

Check the **Dashboard** for branch statistics.

Navigate to **Manage Students** to Add or Edit records.

Click the **Edit (✏️)** button to update details (form turns Orange).

Click the **Trash (🗑️)** button to delete a student.

Use the top-right button to **"Back to Login Page"**.

### 2\. Staff Workflow

Log in as Staff.

You are directed immediately to the management table.

Use the form to **Add** a student or the **Edit (✏️)** button to update existing info.

Use the top-right button to **"Back to Login Page"**.

### 3\. Student Workflow

Log in using your **Roll Number**.

View your marks and grade.

Use the text area to submit a complaint.

Use the **Logout** button at the bottom of the profile section.

---

## ⚠️ Important Note on Data

This application uses **Browser LocalStorage**.

The data is stored **only on your specific browser/device**.

If you clear your browser cache/history, the student data will be wiped.

To clear all data manually, click the red **"⚠️ Reset All Data"** button at the top left of the screen.