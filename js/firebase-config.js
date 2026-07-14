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
  getColPath() {
    const parts = this.path.split("/");
    return parts[parts.length - 2];
  }
  async get() {
    const colPath = this.getColPath();
    const col = new CollectionWrapper(null, colPath);
    const data = col.getCurrentData();
    const item = data.find(i => (i.uid === this.id || i.id === this.id));
    return {
      exists: !!item,
      id: this.id,
      ref: this,
      data: () => item || {}
    };
  }
  async set(fields) {
    const colPath = this.getColPath();
    const col = new CollectionWrapper(null, colPath);
    const data = col.getCurrentData();
    const idx = data.findIndex(i => (i.uid === this.id || i.id === this.id));
    if (idx !== -1) {
      data[idx] = { ...data[idx], ...fields };
    } else {
      data.push({ uid: this.id, id: this.id, ...fields });
    }
    col.saveCurrentData(data);
    return true;
  }
  async update(fields) {
    const colPath = this.getColPath();
    const col = new CollectionWrapper(null, colPath);
    const data = col.getCurrentData();
    const idx = data.findIndex(i => (i.uid === this.id || i.id === this.id));
    if (idx !== -1) {
      data[idx] = { ...data[idx], ...fields };
      col.saveCurrentData(data);
      return true;
    }
    throw new Error("Document not found for update: " + this.id);
  }
  async delete() {
    const colPath = this.getColPath();
    const col = new CollectionWrapper(null, colPath);
    const data = col.getCurrentData();
    const filtered = data.filter(i => (i.uid !== this.id && i.id !== this.id));
    col.saveCurrentData(filtered);
    return true;
  }
}

class QueryWrapper {
  constructor(firestoreInstance, colPath) {
    this.colPath = colPath;
  }
  where() { return this; }
  orderBy() { return this; }
  limit() { return this; }
  async get() {
    const col = new CollectionWrapper(null, this.colPath);
    return col.get();
  }
  onSnapshot(callback) {
    const col = new CollectionWrapper(null, this.colPath);
    return col.onSnapshot(callback);
  }
}

class CollectionWrapper {
  constructor(firestoreInstance, colPath) {
    this.colPath = colPath;
    
    // Add window storage event listener to listen to registrations/updates from other tabs/iframes
    window.addEventListener('storage', (e) => {
      if (e.key === this.getStorageKey()) {
        console.log(`[Storage Sync] ${this.colPath} storage modified in another window. Syncing UI.`);
        this.triggerListeners();
      }
    });
  }
  
  getStorageKey() {
    if (this.colPath === "students" || this.colPath === "registrations") {
      return "mock_students_list";
    } else if (this.colPath === "payments") {
      return "mock_payments";
    } else if (this.colPath === "courses") {
      return "mock_courses";
    }
    return `mock_${this.colPath}`;
  }

  getListeners() {
    if (!window._firestore_listeners) {
      window._firestore_listeners = {};
    }
    if (!window._firestore_listeners[this.colPath]) {
      window._firestore_listeners[this.colPath] = [];
    }
    return window._firestore_listeners[this.colPath];
  }

  triggerListeners() {
    const listeners = this.getListeners();
    const data = this.getCurrentData();
    const snapshot = {
      docs: data.map(item => ({
        id: item.uid || item.id || 'mock_id',
        exists: true,
        ref: new DocRefWrapper(null, `${this.colPath}/${item.uid || item.id}`),
        data: () => item
      })),
      empty: data.length === 0,
      forEach: function(cb) {
        this.docs.forEach(cb);
      },
      size: data.length
    };
    listeners.forEach(cb => {
      try { cb(snapshot); } catch(e) { console.error("onSnapshot callback execution error:", e); }
    });
  }

  getCurrentData() {
    const key = this.getStorageKey();
    const str = localStorage.getItem(key) || "[]";
    return JSON.parse(str);
  }

  saveCurrentData(data) {
    const key = this.getStorageKey();
    localStorage.setItem(key, JSON.stringify(data));
    this.triggerListeners();
    
    // Cross-collection triggering for registrations/students since they share the same storage key!
    if (this.colPath === "students" || this.colPath === "registrations") {
      const otherCol = this.colPath === "students" ? "registrations" : "students";
      if (window._firestore_listeners && window._firestore_listeners[otherCol]) {
        const otherListeners = window._firestore_listeners[otherCol];
        const snapshot = {
          docs: data.map(item => ({
            id: item.uid || item.id || 'mock_id',
            exists: true,
            ref: new DocRefWrapper(null, `${otherCol}/${item.uid || item.id}`),
            data: () => item
          })),
          empty: data.length === 0,
          forEach: function(cb) { this.docs.forEach(cb); },
          size: data.length
        };
        otherListeners.forEach(cb => {
          try { cb(snapshot); } catch(e) { console.error(e); }
        });
      }
    }
  }

  doc(docId) {
    return new DocRefWrapper(null, `${this.colPath}/${docId || "new_id"}`);
  }
  async add(item) {
    try {
      const id = item.uid || "stud-" + Date.now() + Math.floor(Math.random() * 1000);
      const newItem = {
        uid: id,
        id: id,
        createdAt: new Date().toISOString(),
        ...item
      };
      const current = this.getCurrentData();
      current.unshift(newItem);
      this.saveCurrentData(current);
      return {
        id: id,
        ref: new DocRefWrapper(null, `${this.colPath}/${id}`)
      };
    } catch (err) {
      console.error("[Firestore Mock Add Error] Logged for debugging:", err);
      throw err;
    }
  }
  async get() {
    const data = this.getCurrentData();
    return {
      docs: data.map(item => ({
        id: item.uid || item.id || 'mock_id',
        exists: true,
        ref: new DocRefWrapper(null, `${this.colPath}/${item.uid || item.id}`),
        data: () => item
      })),
      empty: data.length === 0,
      forEach: function(cb) {
        this.docs.forEach(cb);
      },
      size: data.length
    };
  }
  onSnapshot(callback) {
    const listeners = this.getListeners();
    listeners.push(callback);
    
    // Call immediately with current data
    const data = this.getCurrentData();
    const snapshot = {
      docs: data.map(item => ({
        id: item.uid || item.id || 'mock_id',
        exists: true,
        ref: new DocRefWrapper(null, `${this.colPath}/${item.uid || item.id}`),
        data: () => item
      })),
      empty: data.length === 0,
      forEach: function(cb) {
        this.docs.forEach(cb);
      },
      size: data.length
    };
    setTimeout(() => {
      try { callback(snapshot); } catch(e) { console.error(e); }
    }, 0);

    return () => {
      const idx = listeners.indexOf(callback);
      if (idx !== -1) {
        listeners.splice(idx, 1);
      }
    };
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
