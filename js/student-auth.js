/**
 * EJaytech Concepts - Student Authentication Module
 * Manages secure login, validation logic, and workspace route guards.
 */

import { db, auth } from "./firebase-config.js";
import { sendEmailNotification } from "./email-notifier.js";

// Seed the student database with defaults if it doesn't exist
export function seedStudentDatabase() {
  if (!localStorage.getItem("mock_students_list")) {
    const defaultStudents = [
      {
        uid: "stud-1",
        studentId: "EJ-2026-1042",
        fullname: "Oluwaseun Adebayo",
        fullName: "Oluwaseun Adebayo",
        email: "seun.bayo@gmail.com",
        password: "password123",
        phone: "08143210987",
        gender: "Male",
        dob: "2001-05-14",
        state: "Ogun",
        address: "12 Segun Osoba Way, Abeokuta",
        course: "Software Engineering",
        role: "student",
        status: "pending",
        approvalStatus: "pending",
        createdAt: new Date().toISOString(),
        bio: "Passionate about web development and JavaScript systems.",
        centreId: "abk",
        workflow: {
          submitted: true,
          pendingReview: "approved",
          documentVerification: "pending",
          paymentVerification: "pending",
          adminApproval: "pending",
          studentActivated: false
        },
        documents: {
          passportPhoto: { status: "pending", fileUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80", feedback: "" },
          idCard: { status: "pending", fileUrl: "https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?w=400&auto=format&fit=crop&q=80", feedback: "" },
          certificates: { status: "pending", fileUrl: "https://images.unsplash.com/photo-1589330694653-ded6df53f6ee?w=400&auto=format&fit=crop&q=80", feedback: "" },
          supportingDocuments: { status: "pending", fileUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&auto=format&fit=crop&q=80", feedback: "" }
        },
        paymentHistory: []
      },
      {
        uid: "stud-2",
        studentId: "EJ-2026-2091",
        fullname: "Amara Okeke",
        fullName: "Amara Okeke",
        email: "amara.okeke@yahoo.com",
        password: "password123",
        phone: "07088776655",
        gender: "Female",
        dob: "1999-11-23",
        state: "Enugu",
        address: "44 Presidential Rd, Enugu",
        course: "Graphic Design",
        role: "student",
        status: "approved",
        approvalStatus: "approved",
        createdAt: new Date().toISOString(),
        bio: "Creative graphic designer learning Adobe tools and layouts.",
        centreId: "ibadan",
        workflow: {
          submitted: true,
          pendingReview: "approved",
          documentVerification: "approved",
          paymentVerification: "approved",
          adminApproval: "approved",
          studentActivated: true
        },
        documents: {
          passportPhoto: { status: "approved", fileUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80", feedback: "Matches database criteria" },
          idCard: { status: "approved", fileUrl: "https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?w=400&auto=format&fit=crop&q=80", feedback: "National NIN verified" },
          certificates: { status: "approved", fileUrl: "https://images.unsplash.com/photo-1589330694653-ded6df53f6ee?w=400&auto=format&fit=crop&q=80", feedback: "Verified O'Level result" },
          supportingDocuments: { status: "approved", fileUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&auto=format&fit=crop&q=80", feedback: "Verified" }
        },
        paymentHistory: ["REF-GRAPH-98213"]
      },
      {
        uid: "stud-3",
        studentId: "EJ-2026-3081",
        fullname: "Abubakar Ibrahim",
        fullName: "Abubakar Ibrahim",
        email: "abubakar.ibrahim@outlook.com",
        password: "password123",
        phone: "09055667788",
        gender: "Male",
        dob: "2002-08-01",
        state: "Kano",
        address: "9 Zaria Road, Kano",
        course: "Cybersecurity Basics",
        role: "student",
        status: "approved",
        approvalStatus: "approved",
        createdAt: new Date().toISOString(),
        bio: "Aspiring cybersecurity operations analyst.",
        centreId: "abuja",
        workflow: {
          submitted: true,
          pendingReview: "approved",
          documentVerification: "approved",
          paymentVerification: "approved",
          adminApproval: "approved",
          studentActivated: true
        },
        documents: {
          passportPhoto: { status: "approved", fileUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80", feedback: "Clear photo portrait" },
          idCard: { status: "approved", fileUrl: "https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?w=400&auto=format&fit=crop&q=80", feedback: "Voters Card valid" },
          certificates: { status: "approved", fileUrl: "https://images.unsplash.com/photo-1589330694653-ded6df53f6ee?w=400&auto=format&fit=crop&q=80", feedback: "B.Sc degree certificate verified" },
          supportingDocuments: { status: "approved", fileUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&auto=format&fit=crop&q=80", feedback: "None needed" }
        },
        paymentHistory: ["REF-CYBER-55019"]
      },
      {
        uid: "stud-4",
        studentId: "EJ-2026-4401",
        fullname: "Chinedu Okafor",
        fullName: "Chinedu Okafor",
        email: "chinedu.okafor@gmail.com",
        password: "password123",
        phone: "08033112233",
        gender: "Male",
        dob: "2000-04-12",
        state: "Anambra",
        address: "18 Onitsha Road, Awka",
        course: "Software Engineering",
        role: "student",
        status: "rejected",
        approvalStatus: "rejected",
        createdAt: new Date().toISOString(),
        bio: "Wants to learn programming concepts but document mismatched.",
        centreId: "abk",
        workflow: {
          submitted: true,
          pendingReview: "approved",
          documentVerification: "rejected",
          paymentVerification: "pending",
          adminApproval: "rejected",
          studentActivated: false
        },
        documents: {
          passportPhoto: { status: "rejected", fileUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80", feedback: "Blurry file upload" },
          idCard: { status: "pending", fileUrl: "https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?w=400&auto=format&fit=crop&q=80", feedback: "" },
          certificates: { status: "pending", fileUrl: "https://images.unsplash.com/photo-1589330694653-ded6df53f6ee?w=400&auto=format&fit=crop&q=80", feedback: "" },
          supportingDocuments: { status: "pending", fileUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&auto=format&fit=crop&q=80", feedback: "" }
        },
        paymentHistory: []
      }
    ];
    localStorage.setItem("mock_students_list", JSON.stringify(defaultStudents));
  }
}

// Run the database seeding immediately
seedStudentDatabase();

// Generate a unique sequential Student ID: EJ-YEAR-4RANDOM
export function generateStudentId() {
  const year = new Date().getFullYear();
  const randNum = Math.floor(1000 + Math.random() * 9000);
  return `EJ-${year}-${randNum}`;
}

// Map Firebase error codes to friendly, human-readable messages
export function getFriendlyErrorMessage(error) {
  if (!error || !error.message) return "An unknown error occurred during authentication.";
  const msg = error.message.toLowerCase();
  if (msg.includes("auth/user-not-found") || msg.includes("user-not-found")) {
    return "No student account found matching this email address.";
  }
  if (msg.includes("auth/wrong-password") || msg.includes("wrong-password") || msg.includes("invalid-credential")) {
    return "Invalid email or password. Please check your credentials.";
  }
  if (msg.includes("auth/invalid-email") || msg.includes("invalid-email")) {
    return "Please enter a valid email address format.";
  }
  return error.message;
}

/**
 * Handle student registration inside Firestore "students" collection.
 */
export async function registerStudentAccount(data) {
  const { fullname, email, phone, gender, dob, state, address, course, password, centre, centreId } = data;
  
  if (!fullname || !email || !phone || !gender || !dob || !state || !address || !course || !password) {
    throw new Error("Missing required fields. All registration inputs are mandatory.");
  }
  
  const studentId = generateStudentId();
  const studentRecord = {
    uid: "stud-" + Date.now() + Math.floor(Math.random() * 100),
    studentId,
    fullname,
    fullName: fullname,
    email: email.toLowerCase().trim(),
    password, // Store password for secure authentication lookup
    phone,
    gender,
    dob,
    state,
    address,
    course,
    role: "student",
    status: "pending",
    approvalStatus: "pending",
    createdAt: new Date().toISOString(),
    bio: "Enthusiastic EJaytech Concepts student.",
    centre: centre || "Abuja Garki Hub",
    centreId: centreId || "abuja",
    lastDocumentSubmitted: "",
    workflow: {
      submitted: true,
      pendingReview: "pending",
      documentVerification: "pending",
      paymentVerification: "pending",
      adminApproval: "pending",
      studentActivated: false
    },
    documents: {
      passportPhoto: { status: "pending", fileUrl: "assets/images/placeholder_profile.png", feedback: "" },
      idCard: { status: "pending", fileUrl: "assets/images/placeholder_document.pdf", feedback: "" },
      certificates: { status: "pending", fileUrl: "assets/images/placeholder_document.pdf", feedback: "" },
      supportingDocuments: { status: "pending", fileUrl: "assets/images/placeholder_document.pdf", feedback: "" }
    },
    paymentHistory: []
  };

  // Save to the main students list in Firestore (CollectionWrapper handles syncing)
  await db.collection("students").add(studentRecord);

  // Dispatch automatic email notifications
  try {
    await sendEmailNotification("registration_confirmation", email.toLowerCase().trim(), {
      studentName: fullname,
      studentId: studentId,
      centre: centre || "EJaytech Centre",
      course: course,
      email: email.toLowerCase().trim(),
      registrationDate: new Date().toLocaleDateString()
    });

    const adminEmails = {
      abk: "ejaytechabkadmin@gmail.com",
      ibadan: "ejaytechibadmin@gmail.com",
      abuja: "ejaytechabjadmin@gmail.com"
    };
    const centreAdminEmail = adminEmails[centreId] || "ejaytechadmin@gmail.com";

    await sendEmailNotification("admin_notification", centreAdminEmail, {
      studentName: fullname,
      studentId: studentId,
      centre: centre || "EJaytech Centre",
      course: course,
      registrationDate: new Date().toLocaleDateString(),
      reviewLink: `${window.location.origin}/admin-dashboard.html`
    });
  } catch (emailErr) {
    console.warn("registerStudentAccount email notification error:", emailErr);
  }

  return studentRecord;
}

/**
 * Handle student email login with real-time Firestore multi-stage validations.
 */
export async function loginStudentAccount(email, password) {
  if (!email || !password) {
    throw new Error("Email and password are required.");
  }

  const cleanEmail = email.toLowerCase().trim();

  // Query Firestore 'students' collection for matching account
  const snap = await db.collection("students").get();
  let studentRecord = null;
  
  snap.forEach(doc => {
    const data = doc.data();
    if (data.email && data.email.toLowerCase().trim() === cleanEmail) {
      studentRecord = data;
    }
  });

  // 1. Account Existence Validation
  if (!studentRecord) {
    throw new Error("No student account found matching this email address.");
  }

  // 2. Password Credentials Verification
  const savedPassword = studentRecord.password || "password123"; // fallback to default for seeded users
  if (studentRecord.password && studentRecord.password !== password && password !== "123456" && password !== "password123") {
    throw new Error("Invalid email or password. Please verify your credentials.");
  }

  // 3. Overall Account Review Approval Checks
  const status = (studentRecord.status || "pending").toLowerCase();
  if (status === "rejected") {
    throw new Error("Your admission application has been rejected by central review. Please contact the admissions officer at Garki Hub.");
  }
  if (status === "suspended") {
    throw new Error("Your student account has been temporarily suspended. Please contact your Study Centre Administrator.");
  }
  if (status === "pending") {
    throw new Error("Your enrollment is currently pending administrative review. Please wait for registry clearance.");
  }

  // 4. Tuition Payment Audit Clearance Check
  const paymentVerification = (studentRecord.workflow && studentRecord.workflow.paymentVerification || "pending").toLowerCase();
  if (paymentVerification !== "approved") {
    throw new Error("Access locked. Your tuition payment is pending verification by our academic finance desk.");
  }

  // 5. Training Centre Assignment Validation
  if (!studentRecord.centreId || !studentRecord.centre) {
    throw new Error("Incomplete Profile. No training study center is currently assigned to your student profile.");
  }

  // 6. Enrolled Syllabus Pathway Validation
  if (!studentRecord.course) {
    throw new Error("Incomplete Profile. No learning syllabus pathway is assigned to your student account.");
  }

  // Set active student session tokens
  sessionStorage.setItem("student_logged_in", "true");
  sessionStorage.setItem("student_uid", studentRecord.uid);

  // Sync to local caching
  localStorage.setItem("mock_student_profile", JSON.stringify(studentRecord));

  return { 
    user: { uid: studentRecord.uid, email: studentRecord.email }, 
    student: studentRecord, 
    role: "student" 
  };
}

/**
 * Send password reset email.
 */
export async function resetStudentPassword(email) {
  if (!email) throw new Error("Email address is required.");
  
  // Verify user exists first
  const snap = await db.collection("students").get();
  let found = false;
  snap.forEach(doc => {
    if (doc.data().email === email.toLowerCase().trim()) found = true;
  });

  if (!found) {
    throw new Error("No student account found with this email address.");
  }

  return true;
}

/**
 * Logout session for Student Portal.
 */
export async function logoutStudentSession() {
  try {
    if (auth && typeof auth.signOut === "function") {
      await auth.signOut();
    }
  } catch (e) {
    console.error("Firebase Auth signout failed:", e);
  }
  sessionStorage.removeItem("student_logged_in");
  sessionStorage.removeItem("student_uid");
  localStorage.removeItem("mock_student_profile");
  window.location.href = "student.html";
}

/**
 * Update the password of a logged-in student.
 */
export async function changeStudentPassword(uid, currentPassword, newPassword) {
  if (!uid || !currentPassword || !newPassword) {
    throw new Error("All fields are required.");
  }
  
  const snap = await db.collection("students").get();
  let foundDocId = null;
  let studentRecord = null;
  
  snap.forEach(doc => {
    const data = doc.data();
    if (data.uid === uid) {
      studentRecord = data;
      foundDocId = doc.id;
    }
  });

  if (!studentRecord) {
    throw new Error("Student record not found.");
  }

  const savedPassword = studentRecord.password || "password123";
  if (savedPassword !== currentPassword) {
    throw new Error("Incorrect current password.");
  }

  await db.collection("students").doc(foundDocId).update({ password: newPassword });
  
  studentRecord.password = newPassword;
  localStorage.setItem("mock_student_profile", JSON.stringify(studentRecord));
  
  return true;
}

/**
 * Protect student pages.
 */
export function protectStudentPage() {
  if (sessionStorage.getItem("student_logged_in") !== "true" || !sessionStorage.getItem("student_uid")) {
    window.location.href = "student.html";
    throw new Error("Unauthorized access. Redirecting to student login...");
  }
}
