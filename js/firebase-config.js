/**
 * EJaytech Concepts - Firebase Configuration & Initialization Layer (DISCONNECTED)
 * 
 * =========================================================================
 * PLACEHOLDER CONFIGURATION:
 * This project is currently disconnected from any active Firebase backend.
 * To connect a new Firebase project, follow the instructions in the comments below.
 * =========================================================================
 */

/*
// TO RE-CONNECT A FRESH FIREBASE PROJECT IN THE FUTURE:
// 1. Uncomment the following standard SDK imports:
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  sendPasswordResetEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  serverTimestamp,
  onSnapshot 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";
*/

// TODO: Replace with your actual Firebase Configuration credentials
export const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_AUTH_DOMAIN_HERE",
  projectId: "YOUR_PROJECT_ID_HERE",
  storageBucket: "YOUR_STORAGE_BUCKET_HERE",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID_HERE",
  appId: "YOUR_APP_ID_HERE"
};

// Disconnected Firebase service instance placeholders
const app = null;
const firestore = null;
const firebaseAuth = null;
const storageInstance = null;

/**
 * =========================================================================
 * NO-OP / MOCK OFFLINE WORKSPACE WRAPPERS
 * To prevent client-side script crashes across other sections of the portal.
 * =========================================================================
 */

class DocRefWrapper {
  constructor(firestoreInstance, path) {
    this.path = path;
  }
  get id() {
    const parts = this.path.split("/");
    return parts[parts.length - 1];
  }
  get ref() {
    return this;
  }
  async get() {
    return {
      exists: false,
      id: this.id,
      ref: this,
      data: () => ({})
    };
  }
  async set() { return true; }
  async update() { return true; }
  async delete() { return true; }
}

class QueryWrapper {
  constructor(firestoreInstance, colPath) {
    this.colPath = colPath;
  }
  where() { return this; }
  orderBy() { return this; }
  limit() { return this; }
  async get() {
    return {
      docs: [],
      empty: true,
      forEach: () => {},
      size: 0
    };
  }
  onSnapshot(callback) {
    callback({
      docs: [],
      empty: true,
      forEach: () => {},
      size: 0
    });
    return () => {}; // No-op unsubscribe
  }
}

class CollectionWrapper {
  constructor(firestoreInstance, colPath) {
    this.colPath = colPath;
  }
  doc(docId) {
    return new DocRefWrapper(null, `${this.colPath}/${docId || "new_id"}`);
  }
  async add() {
    return {
      id: "mock_id",
      ref: new DocRefWrapper(null, `${this.colPath}/mock_id`)
    };
  }
  async get() {
    return {
      docs: [],
      empty: true,
      forEach: () => {},
      size: 0
    };
  }
  onSnapshot(callback) {
    callback({
      docs: [],
      empty: true,
      forEach: () => {},
      size: 0
    });
    return () => {};
  }
  where() { return new QueryWrapper(null, this.colPath); }
  orderBy() { return new QueryWrapper(null, this.colPath); }
  limit() { return new QueryWrapper(null, this.colPath); }
}

class DbWrapper {
  collection(colName) {
    return new CollectionWrapper(null, colName);
  }
  doc(docPath) {
    return new DocRefWrapper(null, docPath);
  }
}

class StorageRefWrapper {
  constructor(path) { this.path = path; }
  child(childPath) {
    return new StorageRefWrapper(this.path ? `${this.path}/${childPath}` : childPath);
  }
  async put() {
    return {
      ref: {
        async getDownloadURL() { return ""; }
      }
    };
  }
}

class StorageWrapper {
  ref(path = "") {
    return new StorageRefWrapper(path);
  }
}

// Instantiate offline dummy interfaces
const db = new DbWrapper();
const auth = {
  get currentUser() {
    return {
      uid: "mock_user_uid",
      email: "ejaytechadmin@gmail.com",
      displayName: "Chief Director Admin"
    };
  },
  async signInWithEmailAndPassword() {
    return { user: { uid: "mock_user_uid", email: "ejaytechadmin@gmail.com" } };
  },
  async createUserWithEmailAndPassword() {
    return { user: { uid: "mock_user_uid", email: "ejaytechadmin@gmail.com" } };
  },
  async signOut() {
    return true;
  },
  onAuthStateChanged(callback) {
    // Trigger onAuthStateChanged callback synchronously with mock admin user so UI bypasses loading
    callback({
      uid: "mock_user_uid",
      email: "ejaytechadmin@gmail.com",
      displayName: "Chief Director Admin"
    });
    return () => {};
  },
  async sendPasswordResetEmail() {
    return true;
  }
};
const storage = new StorageWrapper();

// Attach stub wrappers globally to the window
window.db = db;
window.auth = auth;
window.storage = storage;
window.isRealFirebase = false;
window.firebaseServerTimestamp = () => new Date().toISOString();

// Empty compatible module exports
const updatePassword = async () => {};
const reauthenticateWithCredential = async () => {};
const EmailAuthProvider = {};

export {
  app,
  firestore,
  firebaseAuth,
  storageInstance,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  db,
  auth,
  storage
};
