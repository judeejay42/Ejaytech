/**
 * EJaytech Concepts - Real Firebase Database & Authentication Layer
 * Connected to live Firebase project: ejaytech-de88d using Firebase Modular SDK
 */

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
  serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyDo-pOH9qR6dd-kDBFikkr2ohpZKK7EzGc",
  authDomain: "ejaytech-de88d.firebaseapp.com",
  projectId: "ejaytech-de88d",
  storageBucket: "ejaytech-de88d.firebasestorage.app",
  messagingSenderId: "35030264525",
  appId: "1:35030264525:web:bd020efd61b7c7f2935784",
  measurementId: "G-VK8YT2BE53"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const firebaseAuth = getAuth(app);
const storageInstance = getStorage(app);

// Custom Compatibility Classes for Firestore
class DocRefWrapper {
  constructor(firestoreInstance, path) {
    this.firestoreInstance = firestoreInstance;
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
    const d = doc(this.firestoreInstance, this.path);
    const snap = await getDoc(d);
    return {
      exists: snap.exists(),
      id: snap.id,
      ref: this,
      data: () => snap.data()
    };
  }

  async set(data) {
    const d = doc(this.firestoreInstance, this.path);
    await setDoc(d, data);
  }

  async update(data) {
    const d = doc(this.firestoreInstance, this.path);
    await updateDoc(d, data);
  }

  async delete() {
    const d = doc(this.firestoreInstance, this.path);
    await deleteDoc(d);
  }
}

class QueryWrapper {
  constructor(firestoreInstance, colPath, constraints = []) {
    this.firestoreInstance = firestoreInstance;
    this.colPath = colPath;
    this.constraints = constraints;
  }

  where(field, op, value) {
    return new QueryWrapper(this.firestoreInstance, this.colPath, [...this.constraints, where(field, op, value)]);
  }

  orderBy(field, dir) {
    return new QueryWrapper(this.firestoreInstance, this.colPath, [...this.constraints, orderBy(field, dir)]);
  }

  limit(n) {
    return new QueryWrapper(this.firestoreInstance, this.colPath, [...this.constraints, limit(n)]);
  }

  async get() {
    const colRef = collection(this.firestoreInstance, this.colPath);
    let q;
    if (this.constraints.length > 0) {
      q = query(colRef, ...this.constraints);
    } else {
      q = colRef;
    }
    const snap = await getDocs(q);
    const docs = snap.docs.map(d => ({
      id: d.id,
      ref: new DocRefWrapper(this.firestoreInstance, `${this.colPath}/${d.id}`),
      data: () => d.data()
    }));
    return {
      docs,
      forEach: (callback) => docs.forEach(callback),
      size: docs.length
    };
  }
}

class CollectionWrapper {
  constructor(firestoreInstance, colPath) {
    this.firestoreInstance = firestoreInstance;
    this.colPath = colPath;
  }

  doc(docId) {
    if (!docId) {
      const newDocRef = doc(collection(this.firestoreInstance, this.colPath));
      return new DocRefWrapper(this.firestoreInstance, `${this.colPath}/${newDocRef.id}`);
    }
    return new DocRefWrapper(this.firestoreInstance, `${this.colPath}/${docId}`);
  }

  async add(data) {
    const colRef = collection(this.firestoreInstance, this.colPath);
    const res = await addDoc(colRef, data);
    return {
      id: res.id,
      ref: new DocRefWrapper(this.firestoreInstance, `${this.colPath}/${res.id}`)
    };
  }

  async get() {
    const colRef = collection(this.firestoreInstance, this.colPath);
    const snap = await getDocs(colRef);
    const docs = snap.docs.map(d => ({
      id: d.id,
      ref: new DocRefWrapper(this.firestoreInstance, `${this.colPath}/${d.id}`),
      data: () => d.data()
    }));
    return {
      docs,
      forEach: (callback) => docs.forEach(callback),
      size: docs.length
    };
  }

  where(field, op, value) {
    return new QueryWrapper(this.firestoreInstance, this.colPath, [where(field, op, value)]);
  }

  orderBy(field, dir) {
    return new QueryWrapper(this.firestoreInstance, this.colPath, [orderBy(field, dir)]);
  }

  limit(n) {
    return new QueryWrapper(this.firestoreInstance, this.colPath, [limit(n)]);
  }
}

class DbWrapper {
  constructor(firestoreInstance) {
    this.firestoreInstance = firestoreInstance;
  }

  collection(colName) {
    return new CollectionWrapper(this.firestoreInstance, colName);
  }

  doc(docPath) {
    return new DocRefWrapper(this.firestoreInstance, docPath);
  }
}

// Custom Compatibility Classes for Storage
class StorageRefWrapper {
  constructor(storageInst, path = "") {
    this.storageInst = storageInst;
    this.path = path;
  }

  child(childPath) {
    return new StorageRefWrapper(this.storageInst, this.path ? `${this.path}/${childPath}` : childPath);
  }

  async put(fileObj) {
    const storageRef = ref(this.storageInst, this.path);
    await uploadBytes(storageRef, fileObj);
    const storageRefForUrl = storageRef;
    return {
      ref: {
        async getDownloadURL() {
          return await getDownloadURL(storageRefForUrl);
        }
      }
    };
  }
}

class StorageWrapper {
  constructor(storageInst) {
    this.storageInst = storageInst;
  }

  ref(path = "") {
    return new StorageRefWrapper(this.storageInst, path);
  }
}

// Expose instances globally
window.db = new DbWrapper(firestore);
window.auth = {
  get currentUser() {
    return firebaseAuth.currentUser;
  },
  async signInWithEmailAndPassword(email, password) {
    return await signInWithEmailAndPassword(firebaseAuth, email, password);
  },
  async createUserWithEmailAndPassword(email, password) {
    return await createUserWithEmailAndPassword(firebaseAuth, email, password);
  },
  async signOut() {
    return await signOut(firebaseAuth);
  },
  onAuthStateChanged(callback) {
    return onAuthStateChanged(firebaseAuth, callback);
  },
  async sendPasswordResetEmail(email) {
    return await sendPasswordResetEmail(firebaseAuth, email);
  }
};
window.storage = new StorageWrapper(storageInstance);
window.isRealFirebase = true;
window.firebaseServerTimestamp = serverTimestamp;

// Expose SDK functions for ES Module scripts that need them
export {
  app,
  firestore,
  firebaseAuth,
  storageInstance,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider
};
