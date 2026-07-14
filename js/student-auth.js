/**
 * EJaytech Concepts - Student Authentication Module (DISCONNECTED)
 * All active Firebase auth connections and strict database checks are completely removed.
 */

import { auth } from "./firebase-config.js";

// Placeholder comments for future Firebase project re-connection
/*
// TO RE-CONNECT ACTIVE FIREBASE AUTHENTICATION:
// 1. Uncomment the standard SDK imports:
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
// 2. Import the actual firebaseAuth/db instances:
import { firebaseAuth, db } from "./firebase-config.js";
*/

// Generate a unique sequential Student ID: EJ-YEAR-4RANDOM
export function generateStudentId() {
  const year = new Date().getFullYear();
  const randNum = Math.floor(1000 + Math.random() * 9000);
  return `EJ-${year}-${randNum}`;
}

// Map Firebase error codes to friendly, human-readable messages (Mocked)
export function getFriendlyErrorMessage() {
  return "An unknown error occurred during authentication.";
}

/**
 * Handle student registration (Bypassed / Mocked).
 */
export async function registerStudentAccount(data) {
  const { fullname, email, phone, gender, dob, state, address, course } = data;
  
  if (!fullname || !email || !phone || !gender || !dob || !state || !address || !course) {
    throw new Error("Missing required fields. All registration inputs are mandatory.");
  }
  
  console.log("Mock Student Registration: Success (Firebase Disconnected)");
  
  const studentId = generateStudentId();
  const studentRecord = {
    uid: "mock_student_uid",
    studentId,
    fullName: fullname,
    fullname: fullname, // Compatibility fallback
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
  
  // Track active student session in sessionStorage
  sessionStorage.setItem("student_logged_in", "true");
  sessionStorage.setItem("student_uid", "mock_student_uid");

  // Save to localStorage for mock persistence
  localStorage.setItem("mock_student_profile", JSON.stringify(studentRecord));

  return studentRecord;
}

/**
 * Handle student email login (Bypassed / Mocked).
 */
export async function loginStudentAccount(email, password) {
  if (!email || !password) {
    throw new Error("Email and password are required.");
  }

  console.log("Mock Student Sign-In: Direct Success (Firebase Disconnected)");

  // Establish local session indicator
  sessionStorage.setItem("student_logged_in", "true");
  sessionStorage.setItem("student_uid", "mock_student_uid");

  let studentData = null;
  try {
    const cached = localStorage.getItem("mock_student_profile");
    if (cached) {
      studentData = JSON.parse(cached);
    }
  } catch (e) {
    console.warn("Could not retrieve mock profile from localStorage:", e);
  }

  if (!studentData) {
    studentData = {
      uid: "mock_student_uid",
      studentId: "EJ-2026-9999",
      fullName: "EJaytech Student",
      fullname: "EJaytech Student",
      email: email.toLowerCase().trim(),
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

  return { user: { uid: "mock_student_uid", email }, student: studentData, role: "student" };
}

/**
 * Send password reset email (Bypassed / Mocked).
 */
export async function resetStudentPassword() {
  console.log("Mock Student Password Reset: Success");
  return true;
}

/**
 * Logout session for Student Portal.
 */
export async function logoutStudentSession() {
  console.log("Mock Student Sign-Out completed.");
  sessionStorage.removeItem("student_logged_in");
  sessionStorage.removeItem("student_uid");
  window.location.href = "student.html";
}

/**
 * Protect student pages (Bypassed).
 */
export function protectStudentPage() {
  console.log("protectStudentPage check: Bypassed (Firebase Disconnected)");
  // Always permit access, ensure mock session is established
  sessionStorage.setItem("student_logged_in", "true");
  sessionStorage.setItem("student_uid", "mock_student_uid");
}
