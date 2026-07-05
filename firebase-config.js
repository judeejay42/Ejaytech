/**
 * EJaytech Concepts - Real Firebase Database & Authentication Layer
 * Connected to live Firebase project: ejaytech-concepts
 */

const firebaseConfig = {
  apiKey: "AIzaSyDQsHkDn_P4lyX5YnyTYKJGQumhIG6wESI",
  authDomain: "ejaytech-concepts.firebaseapp.com",
  projectId: "ejaytech-concepts",
  storageBucket: "ejaytech-concepts.firebasestorage.app",
  messagingSenderId: "802065299790",
  appId: "1:802065299790:web:800ab9b7666d4de69e461f"
};

// Initialize Live Firebase SDK
if (typeof firebase !== 'undefined') {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
} else {
  console.warn("Firebase SDK is not loaded. Ensure Firebase Compat scripts are included in HTML head.");
}

// Global active instances
const realDb = typeof firebase !== 'undefined' ? firebase.firestore() : null;
const auth = typeof firebase !== 'undefined' ? firebase.auth() : null;
const storage = typeof firebase !== 'undefined' ? firebase.storage() : null;

const OperationType = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  LIST: 'list',
  GET: 'get',
  WRITE: 'write',
};

/**
 * Handle Firestore errors according to specific skill instructions.
 */
function handleFirestoreError(error, operationType, path) {
  const errMsg = error && error.message ? error.message : String(error);
  const isPermissionError = errMsg.toLowerCase().includes("permission") || errMsg.toLowerCase().includes("insufficient");
  
  if (isPermissionError) {
    const errInfo = {
      error: errMsg,
      authInfo: {
        userId: auth && auth.currentUser ? auth.currentUser.uid : null,
        email: auth && auth.currentUser ? auth.currentUser.email : null,
        emailVerified: auth && auth.currentUser ? auth.currentUser.emailVerified : null,
        isAnonymous: auth && auth.currentUser ? auth.currentUser.isAnonymous : null,
        tenantId: auth && auth.currentUser ? auth.currentUser.tenantId : null,
        providerInfo: auth && auth.currentUser && auth.currentUser.providerData ? auth.currentUser.providerData.map(provider => ({
          providerId: provider.providerId,
          email: provider.email,
        })) : []
      },
      operationType: operationType,
      path: path
    };
    console.error('Firestore Error: ', JSON.stringify(errInfo));
    throw new Error(JSON.stringify(errInfo));
  }
  throw error;
}

/**
 * Create a transparent proxy wrapper around Firestore references to intercept error pathways.
 */
function wrapRef(ref, path = "") {
  if (!ref) return ref;
  
  return new Proxy(ref, {
    get(target, prop, receiver) {
      const val = Reflect.get(target, prop, receiver);
      if (typeof val === "function") {
        return function(...args) {
          if (prop === "collection") {
            const colName = args[0];
            const nextPath = path ? `${path}/${colName}` : colName;
            return wrapRef(val.apply(target, args), nextPath);
          }
          if (prop === "doc") {
            const docId = args[0] || "unknown";
            const nextPath = path ? `${path}/${docId}` : docId;
            return wrapRef(val.apply(target, args), nextPath);
          }
          if (prop === "where" || prop === "orderBy" || prop === "limit") {
            return wrapRef(val.apply(target, args), path);
          }
          
          if (prop === "get") {
            return val.apply(target, args).catch(err => {
              const isCollection = typeof target.add === "function";
              const op = isCollection ? OperationType.LIST : OperationType.GET;
              handleFirestoreError(err, op, path);
            });
          }
          if (prop === "set") {
            return val.apply(target, args).catch(err => {
              handleFirestoreError(err, OperationType.WRITE, path);
            });
          }
          if (prop === "add") {
            return val.apply(target, args).catch(err => {
              handleFirestoreError(err, OperationType.CREATE, path);
            });
          }
          if (prop === "update") {
            return val.apply(target, args).catch(err => {
              handleFirestoreError(err, OperationType.UPDATE, path);
            });
          }
          if (prop === "delete") {
            return val.apply(target, args).catch(err => {
              handleFirestoreError(err, OperationType.DELETE, path);
            });
          }
          if (prop === "onSnapshot") {
            let onNext = args[0];
            let onError = args[1];
            
            if (typeof args[1] !== "function") {
              onError = (err) => {
                const isCollection = typeof target.add === "function";
                const op = isCollection ? OperationType.LIST : OperationType.GET;
                handleFirestoreError(err, op, path);
              };
              args[0] = function(snap) {
                try {
                  onNext(snap);
                } catch (callbackErr) {
                  console.error("onSnapshot onNext callback error:", callbackErr);
                }
              };
              args[1] = onError;
            } else {
              args[0] = function(snap) {
                try {
                  onNext(snap);
                } catch (callbackErr) {
                  console.error("onSnapshot onNext callback error:", callbackErr);
                }
              };
              args[1] = function(err) {
                const isCollection = typeof target.add === "function";
                const op = isCollection ? OperationType.LIST : OperationType.GET;
                try {
                  handleFirestoreError(err, op, path);
                } catch (wrappedErr) {
                  onError(wrappedErr);
                }
              };
            }
            return val.apply(target, args);
          }
          
          return val.apply(target, args);
        };
      }
      if (val && typeof val === "object" && (val.collection || val.doc || val.get)) {
        return wrapRef(val, path);
      }
      return val;
    }
  });
}

// Proxied database reference that automatically handles error intercept paths
const db = wrapRef(realDb);

// Expose them globally
window.db = db;
window.auth = auth;
window.storage = storage;
window.isRealFirebase = true;

// Validate Connection to Firestore on boot (Prerequisite check)
async function testConnection() {
  if (db) {
    try {
      await db.doc('test/connection').get({ source: 'server' });
    } catch (error) {
      if (error && error.message && error.message.toLowerCase().includes('offline')) {
        console.error("Please check your Firebase configuration: Client is offline.");
      }
    }
  }
}
testConnection();
