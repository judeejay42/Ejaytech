/**
 * EJaytech Concepts - Unified Authentication Wrapper & Global Settings Module
 * Backward-compatible bridge pointing to the modern students and administrators databases.
 */

import { firebaseConfig, firebaseAuth, db, auth } from "./firebase-config.js";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Generate a unique sequential-style Student ID index: EJ-YEAR-4RANDOM
export function generateStudentId() {
  const year = new Date().getFullYear();
  const randNum = Math.floor(1000 + Math.random() * 9000);
  return `EJ-${year}-${randNum}`;
}

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
      return "Invalid email address or security passcode. Please double-check spelling and try again.";
    case "auth/email-already-in-use":
      return "This email address is already registered. If you forgot your password, please use the reset link.";
    case "auth/weak-password":
      return "The password is too weak. It must be at least 6 characters long with mixed characters.";
    case "auth/network-request-failed":
      return "A network connection error occurred. Please check your internet connection and try again.";
    case "auth/too-many-requests":
      return "Too many failed login attempts. This account has been temporarily locked. Please try again later.";
    default:
      return error.message || "An error occurred during authentication.";
  }
}

/**
 * Backward-compatible Student Registration
 */
export async function registerStudentAccount(data) {
  const { fullname, email, phone, gender, dob, state, address, course, password } = data;
  
  if (!fullname || !email || !phone || !gender || !dob || !state || !address || !course || !password) {
    throw new Error("Missing required fields. All registration inputs are mandatory.");
  }
  
  try {
    const credential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
    const user = credential.user;
    
    const studentId = generateStudentId();
    const userRecord = {
      uid: user.uid,
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
      status: "pending",
      createdAt: window.firebaseServerTimestamp ? window.firebaseServerTimestamp() : new Date().toISOString(),
      bio: "Enthusiastic EJaytech Concepts student.",
      lastDocumentSubmitted: ""
    };
    
    await db.collection("students").doc(user.uid).set(userRecord);
    
    const welcomeNotif = {
      studentId: studentId,
      title: "Application Received Under Review",
      message: `Welcome ${fullname}! Your student identification ID is assigned as ${studentId}. It is currently under administrative audit. Check back soon!`,
      status: "unread",
      createdAt: new Date().toISOString()
    };
    await db.collection("notifications").add(welcomeNotif);

    return userRecord;
  } catch (err) {
    console.error("Registration error:", err);
    throw new Error(getFriendlyErrorMessage(err));
  }
}

/**
 * Backward-compatible Login wrapper that correctly determines roles across the separate collections
 */
export async function loginUserAccount(email, password) {
  const normalizedEmail = email.toLowerCase().trim();
  try {
    const credential = await signInWithEmailAndPassword(firebaseAuth, normalizedEmail, password);
    const user = credential.user;
    
    // Check administrators first
    let adminDoc = await db.collection("administrators").doc(user.uid).get();
    if (adminDoc.exists) {
      const adminData = adminDoc.data();
      return { user, student: adminData, role: "admin" };
    }
    
    // Check students
    let studentDoc = await db.collection("students").doc(user.uid).get();
    if (studentDoc.exists) {
      const studentData = studentDoc.data();
      return { user, student: studentData, role: "student" };
    }
    
    throw new Error("User record not found in the database. Please contact support.");
  } catch (err) {
    console.error("Login failure:", err);
    throw new Error(getFriendlyErrorMessage(err));
  }
}

export async function resetStudentPassword(email) {
  if (!email) throw new Error("Email address is required to reset passwords.");
  try {
    await sendPasswordResetEmail(firebaseAuth, email);
  } catch (err) {
    throw new Error(getFriendlyErrorMessage(err));
  }
}

export async function logoutSession() {
  await signOut(firebaseAuth);
  window.location.href = "student.html";
}

export function protectPageAccess(requiredRole) {
  onAuthStateChanged(firebaseAuth, async (user) => {
    if (!user) {
      window.location.href = requiredRole === "admin" ? "admin.html" : "student.html";
      return;
    }

    try {
      if (requiredRole === "admin") {
        const adminDoc = await db.collection("administrators").doc(user.uid).get();
        if (!adminDoc.exists || adminDoc.data().role !== "admin") {
          await signOut(firebaseAuth);
          window.location.href = "admin.html";
        }
      } else {
        const studentDoc = await db.collection("students").doc(user.uid).get();
        if (!studentDoc.exists) {
          await signOut(firebaseAuth);
          window.location.href = "student.html";
        }
      }
    } catch (err) {
      console.error("Protection check error:", err);
    }
  });
}

/**
 * Dynamic Website Settings Replacer
 */
export async function applyGlobalSettings() {
  let settings = {
    siteName: "EJaytech Concepts",
    contactPhone: "07033719342",
    contactEmail: "ejaytechconcepts@gmail.com",
    headOfficeAddress: "04 Akande Oke Street, Eleweran, Abeokuta"
  };

  try {
    let fetched = false;
    let dat = null;
    
    if (firebaseAuth.currentUser) {
      const doc = await db.collection("administrators").doc(firebaseAuth.currentUser.uid).get();
      if (doc.exists && doc.data().websiteSettings) {
        dat = doc.data().websiteSettings;
        fetched = true;
      }
    }
    
    if (!fetched) {
      // Look up under generic admin site configurations
      const snapshot = await db.collection("administrators").limit(1).get();
      if (!snapshot.empty) {
        const firstAdmin = snapshot.docs[0].data();
        if (firstAdmin.websiteSettings) {
          dat = firstAdmin.websiteSettings;
          fetched = true;
        }
      }
    }

    if (fetched && dat) {
      settings = dat;
    }
  } catch (err) {
    console.log("Global settings load skipped, falling back to static markup properties.", err);
  }

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
onAuthStateChanged(firebaseAuth, () => {
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
