/**
 * EJaytech Concepts - Student Authentication Module
 * Manages sign-up, login, password reset, and session routing for students.
 */

import { firebaseAuth } from "/firebase-config.js";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Generate a unique sequential Student ID: EJ-YEAR-4RANDOM
export function generateStudentId() {
  const year = new Date().getFullYear();
  const randNum = Math.floor(1000 + Math.random() * 9000);
  return `EJ-${year}-${randNum}`;
}

// Map Firebase error codes to friendly, human-readable messages
export function getFriendlyErrorMessage(error) {
  if (!error) return "An unknown error occurred during authentication.";
  const code = error.code || error.message;
  
  switch (code) {
    case "auth/invalid-email":
      return "The email address format is invalid. Please double-check for typos.";
    case "auth/user-disabled":
      return "This student profile account has been disabled by an administrator.";
    case "auth/user-not-found":
    case "auth/invalid-credential":
    case "auth/wrong-password":
      return "Invalid email or password.";
    case "auth/email-already-in-use":
      return "This email address is already registered. If you forgot your password, please use the reset link.";
    case "auth/weak-password":
      return "The password is too weak. It must be at least 6 characters long with mixed characters.";
    case "auth/network-request-failed":
      return "A network connection error occurred. Please check your internet connection and try again.";
    case "auth/too-many-requests":
      return "Too many failed login attempts. This account has been temporarily locked. Please try again later.";
    default:
      if (typeof code === "string" && code.toLowerCase().includes("wrong-password")) {
        return "Invalid email or password.";
      }
      return error.message || "An error occurred during authentication.";
  }
}

/**
 * Handle student registration using Firebase Authentication and Firestore "students" collection
 */
export async function registerStudentAccount(data) {
  const { fullname, email, phone, gender, dob, state, address, course, password } = data;
  
  if (!fullname || !email || !phone || !gender || !dob || !state || !address || !course || !password) {
    throw new Error("Missing required fields. All registration inputs are mandatory.");
  }
  
  const db = window.db;
  try {
    // 1. Create user in Firebase Auth
    const credential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
    const user = credential.user;
    
    // 2. Save student profile strictly in the "students" collection
    const studentId = generateStudentId();
    const studentRecord = {
      uid: user.uid,
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
      status: "pending",
      approvalStatus: "pending",
      createdAt: window.firebaseServerTimestamp ? window.firebaseServerTimestamp() : new Date().toISOString(),
      bio: "Enthusiastic EJaytech Concepts student.",
      lastDocumentSubmitted: ""
    };
    
    await db.collection("users").doc(user.uid).set(studentRecord);
    await db.collection("students").doc(user.uid).set(studentRecord);
    
    // 3. Create initial notice alert for the new student
    const welcomeNotif = {
      studentId: studentId,
      title: "Application Received Under Review",
      message: `Welcome ${fullname}! Your student ID is ${studentId}. It is currently under administrative audit. Check back soon!`,
      status: "unread",
      createdAt: new Date().toISOString()
    };
    await db.collection("notifications").add(welcomeNotif);

    // Track active student session
    sessionStorage.setItem("student_logged_in", "true");
    sessionStorage.setItem("student_uid", user.uid);

    return studentRecord;
  } catch (err) {
    const errorObj = new Error(getFriendlyErrorMessage(err));
    if (err.code) errorObj.code = err.code;
    throw errorObj;
  }
}

/**
 * Handle student email login using Firebase Authentication and verifying role in "students"
 */
export async function loginStudentAccount(email, password) {
  const normalizedEmail = email.toLowerCase().trim();
  const db = window.db;

  try {
    const credential = await signInWithEmailAndPassword(firebaseAuth, normalizedEmail, password);
    const user = credential.user;
    
    // Fetch document from the dedicated "users" collection (falling back to "students")
    let studentDoc = await db.collection("users").doc(user.uid).get();
    if (!studentDoc.exists) {
      studentDoc = await db.collection("students").doc(user.uid).get();
    }
    
    if (!studentDoc.exists) {
      // Not a student - sign out immediately
      await signOut(firebaseAuth);
      throw new Error("Access denied. You are not authorized to access the Student Portal.");
    }

    const studentData = studentDoc.data();
    
    // Verify role
    if (studentData.role && studentData.role !== "student") {
      await signOut(firebaseAuth);
      throw new Error("Access denied. You are not authorized to access the Student Portal.");
    }

    const rawStatus = studentData.approvalStatus || studentData.status || "pending";
    const statusVal = rawStatus.toLowerCase().trim();
    
    if (statusVal === "pending") {
      await signOut(firebaseAuth);
      throw new Error("Your student application is pending administrative approval.");
    } else if (statusVal === "rejected") {
      await signOut(firebaseAuth);
      throw new Error("Your student application details have been audited and rejected on administrative basis.");
    } else if (statusVal !== "approved") {
      await signOut(firebaseAuth);
      throw new Error("Your student application is pending administrative approval.");
    }

    // Set separate session indicator
    sessionStorage.setItem("student_logged_in", "true");
    sessionStorage.setItem("student_uid", user.uid);

    return { user, student: studentData, role: "student" };
  } catch (err) {
    console.error("Student login error:", err.code || err.message, err);
    
    let msg;
    const code = err.code || "";
    if (code === "auth/invalid-credential" || code === "auth/wrong-password" || code === "auth/user-not-found") {
      msg = "Invalid email or password.";
    } else {
      msg = getFriendlyErrorMessage(err);
    }
    
    if (err.message && (err.message.includes("pending") || err.message.includes("rejected") || err.message.includes("denied"))) {
      msg = err.message;
    }

    const errorObj = new Error(msg);
    errorObj.code = err.code || "auth/unknown";
    throw errorObj;
  }
}

/**
 * Send password reset email
 */
export async function resetStudentPassword(email) {
  if (!email) throw new Error("Email address is required to reset passwords.");
  try {
    await sendPasswordResetEmail(firebaseAuth, email);
  } catch (err) {
    throw new Error(getFriendlyErrorMessage(err));
  }
}

/**
 * Logout session for Student Portal
 */
export async function logoutStudentSession() {
  sessionStorage.removeItem("student_logged_in");
  sessionStorage.removeItem("student_uid");
  
  // Only sign out from Firebase Auth if administrator is not also logged in
  if (sessionStorage.getItem("admin_logged_in") !== "true") {
    await signOut(firebaseAuth);
  }
  
  window.location.href = "student.html";
}

/**
 * Protect student pages (redirects to student.html if not authenticated)
 */
export function protectStudentPage() {
  onAuthStateChanged(firebaseAuth, async (user) => {
    const isSessionActive = sessionStorage.getItem("student_logged_in") === "true";
    if (!user || !isSessionActive) {
      console.log("No authenticated student session, redirecting to student login.");
      window.location.href = "student.html";
      return;
    }

    try {
      const db = window.db;
      let studentDoc = await db.collection("users").doc(user.uid).get();
      if (!studentDoc.exists) {
        studentDoc = await db.collection("students").doc(user.uid).get();
      }
      
      if (!studentDoc.exists) {
        console.error("No student document found. Booting to login.");
        sessionStorage.removeItem("student_logged_in");
        sessionStorage.removeItem("student_uid");
        if (sessionStorage.getItem("admin_logged_in") !== "true") {
          await signOut(firebaseAuth);
        }
        window.location.href = "student.html";
        return;
      }

      const studentData = studentDoc.data();
      const rawStatus = studentData.approvalStatus || studentData.status || "pending";
      const statusVal = rawStatus.toLowerCase().trim();
      
      if (statusVal !== "approved") {
        alert("Your student application status is: " + statusVal + ".");
        sessionStorage.removeItem("student_logged_in");
        sessionStorage.removeItem("student_uid");
        if (sessionStorage.getItem("admin_logged_in") !== "true") {
          await signOut(firebaseAuth);
        }
        window.location.href = "student.html";
        return;
      }
    } catch (err) {
      console.error("Student session verification failed:", err);
    }
  });
}

// Expose globally for legacy scripts
window.generateStudentId = generateStudentId;
window.registerStudentAccount = registerStudentAccount;
window.loginUserAccount = loginStudentAccount; // Fallback alias
window.loginStudentAccount = loginStudentAccount;
window.resetStudentPassword = resetStudentPassword;
window.logoutSession = logoutStudentSession; // Fallback alias
window.logoutStudentSession = logoutStudentSession;
window.protectPageAccess = protectStudentPage; // Fallback alias
window.protectStudentPage = protectStudentPage;
