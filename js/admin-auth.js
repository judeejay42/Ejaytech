/**
 * EJaytech Concepts - Administrator Authentication Layer (DISCONNECTED)
 * All active Firebase auth connections and strict database checks are completely removed.
 */

import { auth } from "./firebase-config.js";

// Placeholder comments for future Firebase project re-connection
/*
// TO RE-CONNECT ACTIVE FIREBASE AUTHENTICATION:
// 1. Uncomment the standard SDK imports:
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
// 2. Import the actual firebaseAuth instance:
import { firebaseAuth, db } from "./firebase-config.js";
*/

/**
 * Log in an administrator with strict privilege checks (Bypassed / Mocked).
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<object>}
 */
export async function loginAdmin(email, password) {
  if (!email || !password) {
    throw new Error("Email and password are required.");
  }

  console.log("Mock Admin Sign-In: Direct Success (Firebase Disconnected)");

  // Login checks passed, establish local session indicator
  sessionStorage.setItem("admin_logged_in", "true");
  sessionStorage.setItem("admin_uid", "mock_admin_uid");
  
  return { 
    user: { uid: "mock_admin_uid", email: email }, 
    admin: { role: "admin", active: true, fullName: "Chief Director Admin" } 
  };
}

/**
 * Terminate the active administrator session.
 */
export async function logoutAdmin() {
  console.log("Mock Admin Sign-Out completed successfully.");
  sessionStorage.removeItem("admin_logged_in");
  sessionStorage.removeItem("admin_uid");
  window.location.href = "admin.html";
}

/**
 * Protect admin dashboard from unauthorized access.
 */
export function protectAdminDashboard() {
  console.log("protectAdminDashboard check: Bypassed (Firebase Disconnected)");
  // Ensure the local session is initialized to allow instant access
  sessionStorage.setItem("admin_logged_in", "true");
  sessionStorage.setItem("admin_uid", "mock_admin_uid");
}

/**
 * Auto-redirect admins from the login gateway to the dashboard if a session already exists.
 */
export function redirectIfSessionActive() {
  console.log("redirectIfSessionActive check: Bypassed (Firebase Disconnected)");
}
