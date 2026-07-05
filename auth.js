/**
 * EJaytech Concepts - Authentication Module
 * Manages sign up, custom registrations, role checks, and session states.
 */

// Generate a unique sequential-style Student ID index: EJ-YEAR-4RANDOM
function generateStudentId() {
  const year = new Date().getFullYear();
  const randNum = Math.floor(1000 + Math.random() * 9000);
  return `EJ-${year}-${randNum}`;
}

/**
 * Handle student application registration
 */
async function registerStudentAccount(data) {
  const { fullname, email, phone, gender, dob, state, address, course, password } = data;
  
  if (!fullname || !email || !phone || !gender || !dob || !state || !address || !course || !password) {
    throw new Error("Missing required fields. All registration inputs are mandatory.");
  }
  
  // 1. Create standard Firebase Authentication login credential
  const credential = await auth.createUserWithEmailAndPassword(email, password);
  const user = credential.user;
  
  // 2. Formulate student record inside Firestore under the student's unique authentication UID
  const studentId = generateStudentId();
  const studentRecord = {
    uid: user.uid,
    studentId,
    fullname,
    email: email.toLowerCase().trim(),
    phone,
    gender,
    dob,
    state,
    address,
    course,
    status: "Pending", // Awaiting administrator approval
    createdAt: isRealFirebase ? firebase.firestore.FieldValue.serverTimestamp() : new Date().toISOString(),
    bio: "Enthusiastic EJaytech Concepts student.",
    lastDocumentSubmitted: ""
  };
  
  await db.collection("students").doc(user.uid).set(studentRecord);
  
  // 3. Create initial notification alert welcomed to their portal
  const welcomeNotif = {
    studentId: studentId,
    title: "Application Received Under Review",
    message: `Welcome ${fullname}! Your student identification ID is assigned as ${studentId}. It is currently under administrative audit. Checked back soon!`,
    status: "unread",
    createdAt: new Date().toISOString()
  };
  await db.collection("notifications").add(welcomeNotif);

  return studentRecord;
}

/**
 * Handle user email login
 */
async function loginUserAccount(email, password) {
  const credential = await auth.signInWithEmailAndPassword(email, password);
  const user = credential.user;
  const normalizedEmail = email.toLowerCase().trim();
  
  // Check if they are admin in admins collection
  const adminDoc = await db.collection("admins").doc(user.uid).get();
  if (adminDoc.exists || normalizedEmail === "admin@ejaytech.com") {
    if (!adminDoc.exists) {
      await db.collection("admins").doc(user.uid).set({
        username: "EJaytech Chief Admin",
        email: normalizedEmail,
        profilePictureUrl: "",
        darkModeEnabled: false,
        websiteSettings: {
          siteName: "EJaytech Concepts",
          contactPhone: "07033719342",
          contactEmail: "ejaytechconcepts@gmail.com",
          headOfficeAddress: "04 Akande Oke Street, Eleweran, Abeokuta"
        },
        createdAt: new Date().toISOString()
      });
    }
    return { user, role: "admin" };
  }

  // Retrieve student profile record
  const studentDoc = await db.collection("students").doc(user.uid).get();
  
  if (!studentDoc.exists) {
    throw new Error("Student registration record not found in the database. Please contact support.");
  }
  
  const student = studentDoc.data();
  return { user, student, role: "student" };
}

/**
 * Send password reset email
 */
async function resetStudentPassword(email) {
  if (!email) throw new Error("Email address is required to reset passwords.");
  await auth.sendPasswordResetEmail(email);
}

/**
 * Logout session
 */
async function logoutSession() {
  await auth.signOut();
  window.location.href = "portal.html";
}

/**
 * Synchronize and enforce secure Session access on Student and Admin pages
 */
function protectPageAccess(requiredRole) {
  auth.onAuthStateChanged(async (user) => {
    if (!user) {
      console.log("No authenticated user session, redirecting to portal.");
      window.location.href = "portal.html";
      return;
    }

    if (requiredRole === "admin") {
      const adminDoc = await db.collection("admins").doc(user.uid).get();
      if (!adminDoc.exists && user.email !== "admin@ejaytech.com") {
        console.warn("Unauthorized administrative access attempt, booting to student page!");
        window.location.href = "student-dashboard.html";
      }
    } else if (requiredRole === "student") {
      const adminDoc = await db.collection("admins").doc(user.uid).get();
      if (adminDoc.exists || user.email === "admin@ejaytech.com") {
        window.location.href = "admin-dashboard.html";
        return;
      }
      
      // Load current student record to check status
      try {
        const studentDoc = await db.collection("students").doc(user.uid).get();
        if (studentDoc.exists) {
          const student = studentDoc.data();
          if (student.status === "Rejected") {
            alert("Your student application details have been audited and rejected on administrative basis.");
            await auth.signOut();
            window.location.href = "portal.html";
          }
        } else {
          // If a student doesn't exist, sign out
          await auth.signOut();
          window.location.href = "portal.html";
        }
      } catch (err) {
        console.error("Session verification fetch failed:", err);
      }
    }
  });
}

/**
 * Dynamic Website Settings Replacer
 * Synchronizes the physical head office, contact phone, and contact email with database overrides.
 */
async function applyGlobalSettings() {
  let settings = {
    siteName: "EJaytech Concepts",
    contactPhone: "07033719342",
    contactEmail: "ejaytechconcepts@gmail.com",
    headOfficeAddress: "04 Akande Oke Street, Eleweran, Abeokuta"
  };

  try {
    let fetched = false;
    let dat = null;
    
    if (auth.currentUser) {
      const doc = await db.collection("admins").doc(auth.currentUser.uid).get();
      if (doc.exists && doc.data().websiteSettings) {
        dat = doc.data().websiteSettings;
        fetched = true;
      }
    }
    
    if (!fetched) {
      const gdoc = await db.collection("admins").doc("admin-master").get();
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
auth.onAuthStateChanged(() => {
  applyGlobalSettings();
});

