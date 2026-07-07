/**
 * EJaytech Concepts - Authentication Module (Real Firebase Project Integration)
 * Manages sign up, custom registrations, role checks, and session states.
 * 
 * DESIGN CONSTRAINTS COMPLIANCE:
 * Uses pure Firebase Modular SDK (v12+) imports and operations for all authentication.
 */

import { firebaseConfig, firebaseAuth } from "./firebase-config.js";
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

/**
 * Requirement 6: Parse Firebase error codes and return friendly, human-readable messages.
 */
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
      if (typeof code === "string" && code.toLowerCase().includes("wrong-password")) {
        return "Invalid email address or security passcode. Please double-check spelling and try again.";
      }
      return error.message || "An error occurred during authentication.";
  }
}


/**
 * Handle student application registration using Firebase Authentication
 */
export async function registerStudentAccount(data) {
  const { fullname, email, phone, gender, dob, state, address, course, password } = data;
  
  if (!fullname || !email || !phone || !gender || !dob || !state || !address || !course || !password) {
    throw new Error("Missing required fields. All registration inputs are mandatory.");
  }
  
  try {
    // 1. Create student in Firebase Auth using Modular SDK directly on firebaseAuth
    const credential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
    const user = credential.user;
    
    // 2. Formulate student record inside Firestore users collection under user's unique authentication UID
    const studentId = generateStudentId();
    const userRecord = {
      uid: user.uid,
      studentId,
      fullName: fullname, // Requirement 6: fullName
      fullname: fullname, // Compatibility fallback
      email: email.toLowerCase().trim(),
      phone,
      gender,
      dob,
      state,
      address,
      course,
      role: "student", // Requirement 6: role ("student" by default)
      status: "pending", // Requirement 6: status ("pending" by default)
      createdAt: window.firebaseServerTimestamp ? window.firebaseServerTimestamp() : new Date().toISOString(),
      bio: "Enthusiastic EJaytech Concepts student.",
      lastDocumentSubmitted: ""
    };
    
    await db.collection("users").doc(user.uid).set(userRecord);
    
    // 3. Create initial notification alert welcomed to their portal
    const welcomeNotif = {
      studentId: studentId,
      title: "Application Received Under Review",
      message: `Welcome ${fullname}! Your student identification ID is assigned as ${studentId}. It is currently under administrative audit. Checked back soon!`,
      status: "unread",
      createdAt: new Date().toISOString()
    };
    await db.collection("notifications").add(welcomeNotif);

    return userRecord;
  } catch (err) {
    const errorObj = new Error(getFriendlyErrorMessage(err));
    if (err.code) {
      errorObj.code = err.code;
    }
    throw errorObj;
  }
}

/**
 * Handle user email login using Firebase Authentication
 */
export async function loginUserAccount(email, password) {
  try {
    // Authenticate credentials using Modular SDK directly on firebaseAuth
    const credential = await signInWithEmailAndPassword(firebaseAuth, email, password);
    const user = credential.user;
    const normalizedEmail = email.toLowerCase().trim();
    
    // Retrieve user record from "users" collection
    let userDoc = await db.collection("users").doc(user.uid).get();
    
    if (normalizedEmail === "admin@ejaytech.com") {
      // If admin document doesn't exist, create it in "users" collection
      if (!userDoc.exists) {
        await db.collection("users").doc(user.uid).set({
          uid: user.uid,
          fullName: "EJaytech Chief Admin",
          fullname: "EJaytech Chief Admin",
          email: normalizedEmail,
          role: "admin",
          status: "Approved",
          createdAt: window.firebaseServerTimestamp ? window.firebaseServerTimestamp() : new Date().toISOString(),
          username: "EJaytech Chief Admin",
          darkModeEnabled: false,
          profilePictureUrl: "",
          websiteSettings: {
            siteName: "EJaytech Concepts",
            contactPhone: "07033719342",
            contactEmail: "ejaytechconcepts@gmail.com",
            headOfficeAddress: "04 Akande Oke Street, Eleweran, Abeokuta"
          }
        });
        userDoc = await db.collection("users").doc(user.uid).get();
      }
    }

    if (!userDoc.exists) {
      throw new Error("User registration record not found in the database. Please contact support.");
    }
    
    const userData = userDoc.data();
    
    // Requirement 8: Prevent users whose status is "pending" from accessing the dashboard.
    if (userData.role !== "admin" && (userData.status || '').toLowerCase() === "pending") {
      await signOut(firebaseAuth);
      throw new Error("Your account application is pending administrative approval.");
    }
    
    return { user, student: userData, role: userData.role };
  } catch (err) {
    if (email.toLowerCase().trim() === "admin@ejaytech.com") {
      throw new Error("Invalid administrator email or password.");
    }
    throw new Error(getFriendlyErrorMessage(err));
  }
}

/**
 * Send password reset email using Firebase Authentication
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
 * Logout session using Firebase Authentication
 */
export async function logoutSession() {
  await signOut(firebaseAuth);
  window.location.href = "portal.html";
}

/**
 * Synchronize and enforce secure Session access on Student and Admin pages
 */
export function protectPageAccess(requiredRole) {
  onAuthStateChanged(firebaseAuth, async (user) => {
    if (!user) {
      console.log("No authenticated user session, redirecting to portal.");
      window.location.href = "portal.html";
      return;
    }

    try {
      const userDoc = await db.collection("users").doc(user.uid).get();
      if (!userDoc.exists) {
        // Fallback for admin
        if (user.email === "admin@ejaytech.com" && requiredRole === "admin") {
          return;
        }
        await signOut(firebaseAuth);
        window.location.href = "portal.html";
        return;
      }

      const userData = userDoc.data();
      
      // Requirement 8: Prevent users whose status is "pending" from accessing the dashboard.
      if (userData.role !== "admin" && (userData.status || '').toLowerCase() === "pending") {
        alert("Your student application is pending administrative approval.");
        await signOut(firebaseAuth);
        window.location.href = "portal.html";
        return;
      }
      
      if (userData.role !== "admin" && (userData.status || '').toLowerCase() === "rejected") {
        alert("Your student application details have been audited and rejected on administrative basis.");
        await signOut(firebaseAuth);
        window.location.href = "portal.html";
        return;
      }

      // Requirement 9: Allow only users with role "admin" to access the admin dashboard.
      if (requiredRole === "admin" && userData.role !== "admin") {
        console.warn("Unauthorized administrative access attempt, booting to student page!");
        window.location.href = "student-dashboard.html";
        return;
      }

      if (requiredRole === "student" && userData.role === "admin") {
        window.location.href = "admin-dashboard.html";
        return;
      }

    } catch (err) {
      console.error("Session verification fetch failed:", err);
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
      const doc = await db.collection("users").doc(firebaseAuth.currentUser.uid).get();
      if (doc.exists && doc.data().websiteSettings) {
        dat = doc.data().websiteSettings;
        fetched = true;
      }
    }
    
    if (!fetched) {
      const gdoc = await db.collection("users").doc("admin-master").get();
      if (gdoc.exists && gdoc.data().websiteSettings) {
        dat = gdoc.data().websiteSettings;
        fetched = true;
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
  
  // Phone updater
  document.querySelectorAll(".settings-phone").forEach(el => {
    if (el.tagName === "A") {
      el.href = `tel:${settings.contactPhone}`;
      if (el.textContent.includes("0703") || el.textContent.includes("+234") || el.querySelector("span") || el.textContent.trim().length > 0) {
        const icon = el.querySelector("i");
        if (icon) {
          el.innerHTML = "";
          el.appendChild(icon);
          el.appendChild(document.createTextNode(" " + settings.contactPhone));
        } else {
          el.textContent = settings.contactPhone;
        }
      }
    } else {
      el.textContent = settings.contactPhone;
    }
  });

  // Email updater
  document.querySelectorAll(".settings-email").forEach(el => {
    if (el.tagName === "A") {
      el.href = `mailto:${settings.contactEmail}`;
      if (el.textContent.includes("@") || el.querySelector("span") || el.textContent.trim().length > 0) {
        const icon = el.querySelector("i");
         if (icon) {
          el.innerHTML = "";
          el.appendChild(icon);
          el.appendChild(document.createTextNode(" " + settings.contactEmail));
        } else {
          el.textContent = settings.contactEmail;
        }
      }
    } else {
      el.textContent = settings.contactEmail;
    }
  });

  // Address updater
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
