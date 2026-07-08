/**
 * EJaytech Concepts - Administrator Authentication Module
 * Manages admin login, session isolation, and administrative page protection.
 */

import { firebaseAuth } from "/firebase-config.js";
import { 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Parse Firebase error codes and return friendly messages
export function getFriendlyErrorMessage(error) {
  if (!error) return "An unknown error occurred during administrative authentication.";
  const code = error.code || error.message;
  
  switch (code) {
    case "auth/invalid-email":
      return "The email address format is invalid. Please double-check for typos.";
    case "auth/user-disabled":
      return "This administrator account has been disabled.";
    case "auth/user-not-found":
    case "auth/invalid-credential":
    case "auth/wrong-password":
      return "Invalid email address or security passcode. Please double-check spelling and try again.";
    case "auth/network-request-failed":
      return "A network connection error occurred. Please check your internet connection and try again.";
    case "auth/too-many-requests":
      return "Too many failed attempts. This account has been temporarily locked. Please try again later.";
    default:
      return error.message || "An error occurred during administrative authentication.";
  }
}

/**
 * Handle administrative login with credentials verification in the "administrators" collection.
 */
export async function loginAdminAccount(email, password) {
  let normalizedEmail = email.toLowerCase().trim();
  const db = window.db;

  // Append default domain if not full email
  if (!normalizedEmail.includes("@")) {
    normalizedEmail = normalizedEmail + "@ejaytech.com";
  }

  try {
    // 1. Await signInWithEmailAndPassword properly
    const credential = await signInWithEmailAndPassword(firebaseAuth, normalizedEmail, password);
    
    // 2. Verify the Firebase Authentication user exists
    if (!credential || !credential.user) {
      const authErr = new Error("Authentication failed: No user record returned from Firebase Auth.");
      console.error("[Auth Failure]", authErr);
      throw authErr;
    }
    
    const user = credential.user;
    
    // Check if user is the designated chief administrator or staff email
    const isCandidateAdmin = (
      normalizedEmail === "elijahyahuza@gmail.com" ||
      normalizedEmail.endsWith("@ejaytech.com") ||
      normalizedEmail.includes("@ejaytech")
    );

    // 3. Fetch profile from the dedicated "administrators" collection with try/catch
    let adminDoc;
    try {
      adminDoc = await db.collection("administrators").doc(user.uid).get();
    } catch (fsErr) {
      console.error("[Firestore Failure] Failed to look up administrator document:", fsErr);
      throw new Error(`Database query failed: ${fsErr.message || fsErr}`);
    }
    
    // Auto-create designated chief administrator record if it doesn't exist yet in the administrators collection
    if (!adminDoc.exists && isCandidateAdmin) {
      console.log("Auto-initializing chief administrator profile...");
      const defaultAdminRecord = {
        uid: user.uid,
        fullName: "EJaytech Chief Admin",
        fullname: "EJaytech Chief Admin",
        email: normalizedEmail,
        role: "admin",
        status: "approved",
        createdAt: new Date().toISOString(),
        username: "EJaytech Chief Admin",
        darkModeEnabled: false,
        profilePictureUrl: "",
        websiteSettings: {
          siteName: "EJaytech Concepts",
          contactPhone: "07033719342",
          contactEmail: "ejaytechconcepts@gmail.com",
          headOfficeAddress: "04 Akande Oke Street, Eleweran, Abeokuta"
        }
      };
      try {
        await db.collection("administrators").doc(user.uid).set(defaultAdminRecord);
        adminDoc = await db.collection("administrators").doc(user.uid).get();
      } catch (fsCreateErr) {
        console.error("[Firestore Failure] Failed to auto-initialize administrator profile document:", fsCreateErr);
        throw new Error(`Database write failed: ${fsCreateErr.message || fsCreateErr}`);
      }
    }

    // 4. Verify the administrator Firestore document exists
    if (!adminDoc || !adminDoc.exists) {
      await signOut(firebaseAuth);
      const docErr = new Error("Access denied. Administrator profile record not found in the database.");
      console.error("[Auth Privilege Error]", docErr);
      throw docErr;
    }

    // Verify presence and role inside the administrators collection
    if (adminDoc.data().role !== "admin") {
      await signOut(firebaseAuth);
      const roleErr = new Error("Access denied. You are not authorized to access the Administrator Portal.");
      console.error("[Auth Privilege Error]", roleErr);
      throw roleErr;
    }

    // Save separate admin session indicator
    sessionStorage.setItem("admin_logged_in", "true");
    sessionStorage.setItem("admin_uid", user.uid);

    return { user, admin: adminDoc.data(), role: "admin" };
  } catch (err) {
    // 5. Add console.error() for every authentication and Firestore failure
    console.error("Admin authentication flow failure:", err.code || err.message, err);
    
    let msg = getFriendlyErrorMessage(err);
    if (err.message && err.message.includes("Access denied")) {
      msg = err.message;
    } else if (err.message && err.message.includes("failed")) {
      msg = err.message;
    }
    
    const errorObj = new Error(msg);
    errorObj.code = err.code || "auth/unknown";
    throw errorObj;
  }
}

/**
 * Logout session for Administrator Portal
 */
export async function logoutAdminSession() {
  sessionStorage.removeItem("admin_logged_in");
  sessionStorage.removeItem("admin_uid");
  
  // Only sign out from Firebase Auth if student is not also logged in
  if (sessionStorage.getItem("student_logged_in") !== "true") {
    await signOut(firebaseAuth);
  }
  
  window.location.href = "admin.html";
}

/**
 * Protect administrator pages (redirects to admin.html if not authenticated)
 */
export function protectAdminPage() {
  onAuthStateChanged(firebaseAuth, async (user) => {
    const isSessionActive = sessionStorage.getItem("admin_logged_in") === "true";
    if (!user || !isSessionActive) {
      console.log("No authenticated admin session, redirecting to admin login.");
      window.location.href = "admin.html";
      return;
    }

    try {
      const db = window.db;
      const adminDoc = await db.collection("administrators").doc(user.uid).get();
      if (!adminDoc.exists || adminDoc.data().role !== "admin") {
        console.error("Access denied. User does not have administrative permissions.");
        sessionStorage.removeItem("admin_logged_in");
        sessionStorage.removeItem("admin_uid");
        if (sessionStorage.getItem("student_logged_in") !== "true") {
          await signOut(firebaseAuth);
        }
        window.location.href = "admin.html";
        return;
      }
    } catch (err) {
      console.error("Admin session verification failed:", err);
    }
  });
}

// Expose globally for legacy scripts
window.loginAdminAccount = loginAdminAccount;
window.logoutAdminSession = logoutAdminSession;
window.logoutSession = logoutAdminSession; // Fallback alias
window.protectAdminPage = protectAdminPage;
window.protectPageAccess = protectAdminPage; // Fallback alias
