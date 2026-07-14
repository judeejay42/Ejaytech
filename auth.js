/**
 * EJaytech Concepts - Unified Authentication Wrapper & Global Settings Module (DISCONNECTED)
 * Backward-compatible bridge pointing to a fully decoupled client-side database.
 */

import { db, auth } from "./js/firebase-config.js";

// Placeholder comments for future Firebase project re-connection
/*
// TO RE-CONNECT ACTIVE FIREBASE AUTHENTICATION:
// 1. Uncomment the standard SDK imports:
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
// 2. Import the actual firebaseAuth instance:
import { firebaseConfig, firebaseAuth, db, auth } from "./js/firebase-config.js";
*/

// Generate a unique sequential-style Student ID index: EJ-YEAR-4RANDOM
export function generateStudentId() {
  const year = new Date().getFullYear();
  const randNum = Math.floor(1000 + Math.random() * 9000);
  return `EJ-${year}-${randNum}`;
}

export function getFriendlyErrorMessage(error) {
  if (!error) return "An unknown error occurred during authentication.";
  return error.message || "An error occurred during authentication.";
}

/**
 * Backward-compatible Student Registration (Decoupled)
 */
export async function registerStudentAccount(data) {
  const { fullname, email, phone, gender, dob, state, address, course } = data;
  
  if (!fullname || !email || !phone || !gender || !dob || !state || !address || !course) {
    throw new Error("Missing required fields. All registration inputs are mandatory.");
  }
  
  try {
    const studentId = generateStudentId();
    const userRecord = {
      uid: "mock_student_uid",
      studentId,
      fullName: fullname,
      fullname: fullname,
      email: email.toLowerCase().trim(),
      phone,
      gender,
      dob,
      state,
      address,
      course,
      role: "student",
      status: "approved",
      approvalStatus: "approved",
      createdAt: new Date().toISOString(),
      bio: "Enthusiastic EJaytech Concepts student.",
      lastDocumentSubmitted: ""
    };
    
    // Save locally for persistence
    localStorage.setItem("mock_student_profile", JSON.stringify(userRecord));
    
    // Add to registered students list mock DB
    let students = [];
    try {
      const existing = localStorage.getItem("mock_students_list");
      if (existing) students = JSON.parse(existing);
    } catch (e) { console.warn(e); }
    students.push(userRecord);
    localStorage.setItem("mock_students_list", JSON.stringify(students));

    // Save notification
    const welcomeNotif = {
      id: "notif-" + Date.now(),
      studentId: studentId,
      title: "Application Approved",
      message: `Welcome ${fullname}! Your student identification ID is assigned as ${studentId}. Your application has been approved.`,
      status: "unread",
      createdAt: new Date().toISOString()
    };
    
    let notifications = [];
    try {
      const existingNotif = localStorage.getItem("mock_notifications");
      if (existingNotif) notifications = JSON.parse(existingNotif);
    } catch (e) { console.warn(e); }
    notifications.push(welcomeNotif);
    localStorage.setItem("mock_notifications", JSON.stringify(notifications));

    sessionStorage.setItem("student_logged_in", "true");
    sessionStorage.setItem("student_uid", "mock_student_uid");

    return userRecord;
  } catch (err) {
    console.error("Registration error:", err);
    throw new Error(getFriendlyErrorMessage(err));
  }
}

/**
 * Backward-compatible Login wrapper (Decoupled)
 */
export async function loginUserAccount(email, password) {
  if (!email || !password) {
    throw new Error("Email and password are required.");
  }

  const normalizedEmail = email.toLowerCase().trim();
  try {
    let studentData = null;
    const cached = localStorage.getItem("mock_student_profile");
    if (cached) {
      studentData = JSON.parse(cached);
    }

    if (!studentData) {
      studentData = {
        uid: "mock_student_uid",
        studentId: "EJ-2026-9999",
        fullName: "EJaytech Student",
        fullname: "EJaytech Student",
        email: normalizedEmail,
        phone: "07033719342",
        gender: "Male",
        dob: "2000-01-01",
        state: "Lagos",
        address: "04 Akande Oke Street, Abeokuta",
        course: "Software Engineering",
        role: "student",
        status: "approved",
        approvalStatus: "approved",
        createdAt: new Date().toISOString(),
        bio: "Enthusiastic EJaytech Concepts student.",
        lastDocumentSubmitted: ""
      };
      localStorage.setItem("mock_student_profile", JSON.stringify(studentData));
    }

    sessionStorage.setItem("student_logged_in", "true");
    sessionStorage.setItem("student_uid", "mock_student_uid");

    return { 
      user: { uid: "mock_student_uid", email: normalizedEmail }, 
      student: studentData, 
      role: "student" 
    };
  } catch (err) {
    console.error("Login failure:", err);
    throw new Error(getFriendlyErrorMessage(err));
  }
}

export async function resetStudentPassword() {
  console.log("Mock Reset Password request successful.");
  return true;
}

export async function logoutSession() {
  console.log("Mock Logout session");
  sessionStorage.removeItem("student_logged_in");
  sessionStorage.removeItem("student_uid");
  window.location.href = "student.html";
}

export function protectPageAccess() {
  console.log("protectPageAccess: Bypassed (Firebase Disconnected)");
  sessionStorage.setItem("student_logged_in", "true");
  sessionStorage.setItem("student_uid", "mock_student_uid");
}

/**
 * Dynamic Website Settings Replacer (Decoupled)
 */
export async function applyGlobalSettings() {
  const settings = {
    siteName: "EJaytech Concepts",
    contactPhone: "07033719342",
    contactEmail: "ejaytechconcepts@gmail.com",
    headOfficeAddress: "04 Akande Oke Street, Eleweran, Abeokuta"
  };

  // Safely replace on-screen targets
  document.querySelectorAll(".settings-sitename").forEach(el => {
    el.textContent = settings.siteName;
  });
  
  document.querySelectorAll(".settings-phone").forEach(el => {
    if (el.tagName === "A") {
      el.href = `tel:${settings.contactPhone}`;
      const icon = el.querySelector("i");
      if (icon) {
        el.innerHTML = "";
        el.appendChild(icon);
        el.appendChild(document.createTextNode(" " + settings.contactPhone));
      } else {
        el.textContent = settings.contactPhone;
      }
    } else {
      el.textContent = settings.contactPhone;
    }
  });

  document.querySelectorAll(".settings-email").forEach(el => {
    if (el.tagName === "A") {
      el.href = `mailto:${settings.contactEmail}`;
      const icon = el.querySelector("i");
      if (icon) {
        el.innerHTML = "";
        el.appendChild(icon);
        el.appendChild(document.createTextNode(" " + settings.contactEmail));
      } else {
        el.textContent = settings.contactEmail;
      }
    } else {
      el.textContent = settings.contactEmail;
    }
  });

  document.querySelectorAll(".settings-address").forEach(el => {
    const icon = el.querySelector("i");
    if (icon) {
      el.innerHTML = "";
      el.appendChild(icon);
      el.appendChild(document.createTextNode(" " + settings.headOfficeAddress));
    } else {
      el.textContent = settings.headOfficeAddress;
    }
  });
}

// Automatically invoke on DOM ready and auth updates
document.addEventListener("DOMContentLoaded", () => {
  applyGlobalSettings();
});

// Expose functions globally to window
window.generateStudentId = generateStudentId;
window.registerStudentAccount = registerStudentAccount;
window.loginUserAccount = loginUserAccount;
window.resetStudentPassword = resetStudentPassword;
window.logoutSession = logoutSession;
window.protectPageAccess = protectPageAccess;
window.applyGlobalSettings = applyGlobalSettings;
