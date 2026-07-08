import { firebaseAuth, db } from "./firebase-config.js";
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

/**
 * Log in an administrator with strict privilege checks.
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<object>}
 */
export async function loginAdmin(email, password) {
  if (!email || !password) {
    throw new Error("Email and password are required.");
  }

  try {
    // 1. Authenticate with Firebase Auth
    const credential = await signInWithEmailAndPassword(firebaseAuth, email, password);
    const user = credential.user;

    // 2. Query Firestore collection: administrators using uid
    const adminDocRef = db.collection("administrators").doc(user.uid);
    const adminDoc = await adminDocRef.get();

    // If the administrator document is missing
    if (!adminDoc.exists) {
      await signOut(firebaseAuth);
      sessionStorage.removeItem("admin_logged_in");
      sessionStorage.removeItem("admin_uid");
      const err = new Error("This account is not an administrator.");
      err.code = "auth/not-admin";
      throw err;
    }

    const adminData = adminDoc.data();

    // Check if role is admin and account is active
    if (adminData.role !== "admin" || adminData.active !== true) {
      await signOut(firebaseAuth);
      sessionStorage.removeItem("admin_logged_in");
      sessionStorage.removeItem("admin_uid");
      const err = new Error("Access denied. Administrator privileges required.");
      err.code = "auth/privilege-denied";
      throw err;
    }

    // Login checks passed, establish local session indicator
    sessionStorage.setItem("admin_logged_in", "true");
    sessionStorage.setItem("admin_uid", user.uid);
    return { user, admin: adminData };

  } catch (error) {
    // Handle Firebase specific authentication errors
    console.error("Admin Authentication Error:", error);
    
    // Check if the error is our custom admin or privilege error
    if (error.code === "auth/not-admin" || error.code === "auth/privilege-denied") {
      throw error;
    }

    // Map common Firebase Auth codes to customer requirements
    const code = error.code;
    if (code === "auth/wrong-password" || code === "auth/invalid-credential" || code === "auth/user-not-found") {
      const err = new Error("Incorrect email or password.");
      err.code = "auth/incorrect-credentials";
      throw err;
    } else if (code === "auth/network-request-failed") {
      const err = new Error("Network failure. Please check your internet connection and try again.");
      err.code = code;
      throw err;
    } else if (code === "auth/too-many-requests") {
      const err = new Error("Too many failed attempts. This account has been temporarily locked.");
      err.code = code;
      throw err;
    } else {
      // General handler for any other errors (Firestore permission-denied, timeout, etc.)
      const err = new Error(error.message || "An error occurred during authentication.");
      err.code = code || "auth/unknown";
      throw err;
    }
  }
}

/**
 * Terminate the active administrator session.
 */
export async function logoutAdmin() {
  try {
    await signOut(firebaseAuth);
  } catch (error) {
    console.error("Firebase SignOut Error:", error);
  } finally {
    sessionStorage.removeItem("admin_logged_in");
    sessionStorage.removeItem("admin_uid");
    localStorage.removeItem("admin_dark_mode"); // optional UI setting cleanup if needed
    window.location.href = "admin.html";
  }
}

/**
 * Protect admin dashboard from unauthorized access.
 */
export function protectAdminDashboard() {
  // To avoid flicker and ensure immediate redirect if local session indicator is missing
  const isLocalSession = sessionStorage.getItem("admin_logged_in") === "true";
  if (!isLocalSession) {
    console.log("No local admin session detected. Redirecting to admin.html");
    window.location.href = "admin.html";
    return;
  }

  // Subscribe to live auth state for deep verification
  onAuthStateChanged(firebaseAuth, async (user) => {
    if (!user) {
      console.log("No active Firebase session detected. Redirecting to admin.html");
      sessionStorage.removeItem("admin_logged_in");
      sessionStorage.removeItem("admin_uid");
      window.location.href = "admin.html";
      return;
    }

    try {
      const adminDoc = await db.collection("administrators").doc(user.uid).get();
      if (!adminDoc.exists || adminDoc.data().role !== "admin" || adminDoc.data().active !== true) {
        console.warn("Privilege check failed on dashboard load.");
        await signOut(firebaseAuth);
        sessionStorage.removeItem("admin_logged_in");
        sessionStorage.removeItem("admin_uid");
        window.location.href = "admin.html";
      }
    } catch (error) {
      console.error("Dashboard route protection check error:", error);
      // In case of Firestore or query failure, do not lock user out instantly if we are offline,
      // but if permissions denied, force logout.
      if (error.code === "permission-denied") {
        await signOut(firebaseAuth);
        sessionStorage.removeItem("admin_logged_in");
        sessionStorage.removeItem("admin_uid");
        window.location.href = "admin.html";
      }
    }
  });
}

/**
 * Auto-redirect admins from the login gateway to the dashboard if a session already exists.
 */
export function redirectIfSessionActive() {
  onAuthStateChanged(firebaseAuth, async (user) => {
    const isLocalSession = sessionStorage.getItem("admin_logged_in") === "true";
    if (user && isLocalSession) {
      try {
        const adminDoc = await db.collection("administrators").doc(user.uid).get();
        if (adminDoc.exists && adminDoc.data().role === "admin" && adminDoc.data().active === true) {
          window.location.href = "admin-dashboard.html";
        } else {
          // Clean up invalid session
          await signOut(firebaseAuth);
          sessionStorage.removeItem("admin_logged_in");
          sessionStorage.removeItem("admin_uid");
        }
      } catch (e) {
        console.error("Session verification failed on login gateway:", e);
      }
    }
  });
}
