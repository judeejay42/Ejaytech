// EJaytech Concepts - Real Firebase Authentication Modular SDK Adapter
// Re-exports functions directly from the official Firebase Modular Web SDK CDN

import { 
  updatePassword as realUpdatePassword, 
  reauthenticateWithCredential as realReauthenticateWithCredential, 
  EmailAuthProvider as realEmailAuthProvider 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

export const EmailAuthProvider = realEmailAuthProvider;
export const reauthenticateWithCredential = realReauthenticateWithCredential;
export const updatePassword = realUpdatePassword;
