/**
 * EJaytech Concepts - Administrator Dashboard Logic Layer (DECOUPLED / OFFLINE SECURE SECURE ENGINE)
 * Fully compliant with AGENTS.md, GEMINI.md, and custom constraints.
 * Operates on a simulated browser-persistent JSON engine in localStorage.
 * Integrates:
 * - Real-Time Dashboard Metrics
 * - Multi-stage Student Registration Review Workflow
 * - Multi-document Verification (Passport Photo, ID, Certificates, etc.)
 * - Finance Audit & Payment Verification (Bank Transfers, Reference Numbers, Offline Payments, Receipts)
 * - Course Management (Create, Edit, Set Deadlines, Set Fees, Archive, Assign Instructors)
 * - Student Directory & Profile Management
 * - Notification Centre (Simulating instant in-app alerts and secure email receipts)
 * - Visual Business Reports with client-side exports to Excel, CSV, and PDF print formats
 * - Dynamic Audit Logs tracking Admin accounts, Actions, Date, Time, and IP addresses
 * - Role-Based Access Control (RBAC) with full runtime simulation of permissions
 */

import { db, auth } from "./js/firebase-config.js";

// --- SEED COMPREHENSIVE LOCAL DATABASE ---
export function seedAdminMockDatabase() {
  // 1. Seed Courses list
  if (!localStorage.getItem("mock_courses")) {
    const defaultCourses = [
      {
        id: "course-1",
        title: "Software Engineering",
        courseName: "Software Engineering",
        description: "Full-stack software engineering track covering HTML5/CSS3 layouts, JavaScript systems, Node.js API development, SQL, and cloud deployments.",
        duration: "6 Months",
        fee: 150000,
        requirements: "Basic computer literacy and a logical mindset.",
        learningOutcomes: "Ability to construct production-ready secure web portals.",
        courseImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&auto=format&fit=crop&q=60",
        isArchived: false,
        deadline: "2026-08-15",
        instructor: "Engr. Kayode",
        centreId: "abk"
      },
      {
        id: "course-2",
        title: "Graphic Design",
        courseName: "Graphic Design",
        description: "Professional creative visualization track focusing on layout grids, typography, digital image compositions, and master tools like Photoshop/Illustrator.",
        duration: "3 Months",
        fee: 85000,
        requirements: "Creative passion and access to a personal computer.",
        learningOutcomes: "Ability to engineer high-impact marketing assets and brand systems.",
        courseImage: "https://images.unsplash.com/photo-1561070791-26c113006238?w=500&auto=format&fit=crop&q=60",
        isArchived: false,
        deadline: "2026-07-30",
        instructor: "Mr. Femi Adeleye",
        centreId: "ibadan"
      },
      {
        id: "course-3",
        title: "Cybersecurity Basics",
        courseName: "Cybersecurity Basics",
        description: "Core network security principles, pen-testing, ethical hacking, malware analysis, and risk mitigation models.",
        duration: "4 Months",
        fee: 120000,
        requirements: "Intermediate computer skills and basic networking logic.",
        learningOutcomes: "Ability to analyze server firewalls and guard organizational domains.",
        courseImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=500&auto=format&fit=crop&q=60",
        isArchived: false,
        deadline: "2026-09-01",
        instructor: "Engr. Kayode",
        centreId: "abuja"
      }
    ];
    localStorage.setItem("mock_courses", JSON.stringify(defaultCourses));
  }

  // 2. Seed Students and Registrations
  if (!localStorage.getItem("mock_students_list")) {
    const defaultStudents = [
      {
        uid: "stud-1",
        studentId: "EJ-2026-1042",
        fullname: "Oluwaseun Adebayo",
        fullName: "Oluwaseun Adebayo",
        email: "seun.bayo@gmail.com",
        phone: "08143210987",
        gender: "Male",
        dob: "2001-05-14",
        state: "Ogun",
        address: "12 Segun Osoba Way, Abeokuta",
        course: "Software Engineering",
        role: "student",
        status: "pending", // overall status: pending, approved, rejected, suspended
        approvalStatus: "pending",
        createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
        bio: "Passionate about web development and JavaScript systems.",
        centreId: "abk",
        // Administrative multi-stage workflow status
        workflow: {
          submitted: true,
          pendingReview: "approved", // completed
          documentVerification: "pending", // current stage
          paymentVerification: "pending",
          adminApproval: "pending",
          studentActivated: false
        },
        // Embedded documents status
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
        phone: "07088776655",
        gender: "Female",
        dob: "1999-11-23",
        state: "Enugu",
        address: "44 Presidential Rd, Enugu",
        course: "Graphic Design",
        role: "student",
        status: "approved",
        approvalStatus: "approved",
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
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
        phone: "09055667788",
        gender: "Male",
        dob: "2002-08-01",
        state: "Kano",
        address: "9 Zaria Road, Kano",
        course: "Cybersecurity Basics",
        role: "student",
        status: "approved",
        approvalStatus: "approved",
        createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
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
        phone: "08033112233",
        gender: "Male",
        dob: "2000-04-12",
        state: "Anambra",
        address: "18 Onitsha Road, Awka",
        course: "Software Engineering",
        role: "student",
        status: "rejected",
        approvalStatus: "rejected",
        createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
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

  // 3. Seed Payments List
  if (!localStorage.getItem("mock_payments")) {
    const defaultPayments = [
      {
        id: "PAY-001",
        studentName: "Amara Okeke",
        studentId: "EJ-2026-2091",
        course: "Graphic Design",
        amount: 85000,
        paymentMethod: "Bank Transfer",
        paymentDate: "2026-07-12",
        referenceNumber: "REF-GRAPH-98213",
        proofOfPayment: "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=500&auto=format&fit=crop&q=60",
        status: "Verified", // Pending, Verified, Failed, Refunded
        centreId: "ibadan",
        createdAt: new Date(Date.now() - 3600000 * 23).toISOString()
      },
      {
        id: "PAY-002",
        studentName: "Abubakar Ibrahim",
        studentId: "EJ-2026-3081",
        course: "Cybersecurity Basics",
        amount: 120000,
        paymentMethod: "Bank Transfer",
        paymentDate: "2026-07-11",
        referenceNumber: "REF-CYBER-55019",
        proofOfPayment: "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=500&auto=format&fit=crop&q=60",
        status: "Verified",
        centreId: "abuja",
        createdAt: new Date(Date.now() - 3600000 * 47).toISOString()
      },
      {
        id: "PAY-003",
        studentName: "Oluwaseun Adebayo",
        studentId: "EJ-2026-1042",
        course: "Software Engineering",
        amount: 150000,
        paymentMethod: "Bank Transfer",
        paymentDate: "2026-07-14",
        referenceNumber: "REF-SOFT-77123",
        proofOfPayment: "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=500&auto=format&fit=crop&q=60",
        status: "Pending",
        centreId: "abk",
        createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
      }
    ];
    localStorage.setItem("mock_payments", JSON.stringify(defaultPayments));
  }

  // 4. Seed Administrators (RBAC System)
  if (!localStorage.getItem("mock_administrators")) {
    const defaultAdmins = [
      {
        id: "admin-super",
        name: "Chief Director Admin",
        email: "ejaytechadmin@gmail.com",
        username: "ejaytechadmin",
        role: "Super Admin", // Super Admin, Administrator, Finance Officer, Admissions Officer, Instructor
        avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=70",
        active: true,
        centreId: "all",
        createdAt: "2026-01-10T12:00:00Z"
      },
      {
        id: "admin-abk",
        name: "ABK Centre Admin",
        email: "ejaytechabkadmin@gmail.com",
        username: "abk_admin",
        role: "Centre Admin",
        avatarUrl: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=70",
        active: true,
        centreId: "abk",
        createdAt: "2026-02-15T09:30:00Z"
      },
      {
        id: "admin-ibadan",
        name: "Ibadan Centre Admin",
        email: "ejaytechibadmin@gmail.com",
        username: "ibadan_admin",
        role: "Centre Admin",
        avatarUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=70",
        active: true,
        centreId: "ibadan",
        createdAt: "2026-03-01T10:00:00Z"
      },
      {
        id: "admin-abuja",
        name: "Abuja Centre Admin",
        email: "ejaytechabjadmin@gmail.com",
        username: "abuja_admin",
        role: "Centre Admin",
        avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=70",
        active: true,
        centreId: "abuja",
        createdAt: "2026-03-12T14:15:00Z"
      },
      {
        id: "admin-instructor-abk",
        name: "Engr. Kayode",
        email: "instructor.abk@ejaytech.com",
        username: "kayode_abk",
        role: "Instructor",
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=70",
        active: true,
        centreId: "abk",
        createdAt: "2026-04-05T08:20:00Z"
      }
    ];
    localStorage.setItem("mock_administrators", JSON.stringify(defaultAdmins));
  }

  // 5. Seed Activity Logs (Audit Trail)
  if (!localStorage.getItem("mock_activity_logs")) {
    const defaultLogs = [
      {
        id: "log-1",
        adminName: "Chief Director Admin",
        adminEmail: "ejaytechadmin@gmail.com",
        action: "Console Core Initialized",
        message: "System initialized with client-side persistent database layers.",
        date: "2026-07-14",
        time: "10:15:22",
        ip: "197.210.64.12"
      },
      {
        id: "log-2",
        adminName: "ABK Centre Admin",
        adminEmail: "ejaytechabkadmin@gmail.com",
        action: "Student Review Started",
        message: "Opened multi-stage verification dossier for Oluwaseun Adebayo.",
        date: "2026-07-14",
        time: "11:32:01",
        ip: "197.210.65.23"
      }
    ];
    localStorage.setItem("mock_activity_logs", JSON.stringify(defaultLogs));
  }

  // 6. Seed Notifications History
  if (!localStorage.getItem("mock_notifications_history")) {
    const defaultNotifs = [
      {
        id: "notif-1",
        studentName: "Amara Okeke",
        studentId: "EJ-2026-2091",
        email: "amara.okeke@yahoo.com",
        title: "Registration Approved & Activated",
        message: "Congratulations! Your registration for Graphic Design has been verified and fully approved.",
        type: "Admission Status",
        channel: "In-App & Email Dispatched",
        centreId: "ibadan",
        createdAt: new Date(Date.now() - 3600000 * 22).toISOString()
      },
      {
        id: "notif-2",
        studentName: "Abubakar Ibrahim",
        studentId: "EJ-2026-3081",
        email: "abubakar.ibrahim@outlook.com",
        title: "Payment Verified Successfully",
        message: "Payment reference REF-CYBER-55019 of ₦120,000 has been verified by our Finance Desk.",
        type: "Payment Audit",
        channel: "In-App & Email Dispatched",
        centreId: "abuja",
        createdAt: new Date(Date.now() - 3600000 * 46).toISOString()
      }
    ];
    localStorage.setItem("mock_notifications_history", JSON.stringify(defaultNotifs));
  }

  // 7. Seed System Settings
  if (!localStorage.getItem("mock_admin_profile")) {
    const defaultProfile = {
      fullName: "Chief Director Admin",
      username: "ejaytechadmin",
      email: "ejaytechadmin@gmail.com",
      role: "Super Admin",
      darkModeEnabled: false,
      profilePictureUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=70",
      websiteSettings: {
        siteName: "EJaytech Concepts",
        contactPhone: "+2347033719342",
        contactEmail: "ejaytechconcepts@gmail.com",
        headOfficeAddress: "04 Akande Oke Street, Eleweran, Abeokuta",
        smtpServer: "smtp.gmail.com",
        smtpPort: "587",
        paymentAccountName: "EJaytech Concepts Limited",
        paymentAccountNumber: "1023948210",
        paymentBank: "Zenith Bank PLC"
      }
    };
    localStorage.setItem("mock_admin_profile", JSON.stringify(defaultProfile));
  }

  // 8. Seed Centres Registry
  if (!localStorage.getItem("mock_centres")) {
    const defaultCentres = [
      { id: "abk", name: "ABK Centre", email: "abk@ejaytech.com", prefix: "ABK", location: "Abeokuta, Ogun State", status: "enabled", isArchived: false, dateCreated: "2026-01-10" },
      { id: "ibadan", name: "Ibadan Centre", email: "ibadan@ejaytech.com", prefix: "IBA", location: "Ibadan, Oyo State", status: "enabled", isArchived: false, dateCreated: "2026-02-15" },
      { id: "abuja", name: "Abuja Centre", email: "abuja@ejaytech.com", prefix: "ABJ", location: "Abuja, FCT", status: "enabled", isArchived: false, dateCreated: "2026-03-05" }
    ];
    localStorage.setItem("mock_centres", JSON.stringify(defaultCentres));
  }
}

// --- SYSTEM AUDIT LOGGER ---
export async function logAdminActivity(action, message = "", centreId = "central", device = "") {
  try {
    const logsStr = localStorage.getItem("mock_activity_logs") || "[]";
    const logs = JSON.parse(logsStr);

    // Fetch current user details or active session details
    const activeAdmin = JSON.parse(localStorage.getItem("active_admin_session")) || {
      name: "Super Admin",
      email: "ejaytechadmin@gmail.com"
    };

    const now = new Date();
    const dateStr = now.toISOString().split("T")[0];
    const timeStr = now.toTimeString().split(" ")[0];

    // Build random valid Nigerian IP block
    const randomIP = `197.210.${Math.floor(Math.random() * 254) + 1}.${Math.floor(Math.random() * 254) + 1}`;

    // Detect device
    let devStr = device;
    if (!devStr && typeof navigator !== "undefined") {
      const ua = navigator.userAgent;
      if (ua.includes("Windows")) devStr = "Windows (PC)";
      else if (ua.includes("Macintosh")) devStr = "macOS (Apple)";
      else if (ua.includes("Linux")) devStr = "Linux (PC)";
      else if (ua.includes("iPhone") || ua.includes("iPad")) devStr = "iOS Device";
      else if (ua.includes("Android")) devStr = "Android Device";
      else devStr = "Web Browser";
    } else if (!devStr) {
      devStr = "Desktop Server Node";
    }

    const newLog = {
      id: "log-" + Date.now() + Math.floor(Math.random() * 1000),
      adminName: activeAdmin.name,
      adminEmail: activeAdmin.email,
      action: action,
      message: message || `${activeAdmin.name} performed action: ${action}`,
      date: dateStr,
      time: timeStr,
      ip: randomIP,
      centreId: centreId,
      device: devStr
    };

    logs.unshift(newLog);
    // Keep max 200 logs
    if (logs.length > 200) logs.pop();

    localStorage.setItem("mock_activity_logs", JSON.stringify(logs));
    return true;
  } catch (err) {
    console.error("Audit log creation failure:", err);
    return false;
  }
}

export async function getActivityLogsList() {
  const logsStr = localStorage.getItem("mock_activity_logs") || "[]";
  return JSON.parse(logsStr);
}

export async function purgeActivityLogs() {
  localStorage.setItem("mock_activity_logs", "[]");
  await logAdminActivity("System Logs Purged", "Cleared all active audit trails and historical activity logs.");
  return true;
}

// --- STUDENT REGISTRATION MANAGEMENT ---
export async function getRegisteredStudentsList() {
  const studentsStr = localStorage.getItem("mock_students_list") || "[]";
  return JSON.parse(studentsStr);
}

export async function editStudentRecordAdmin(uid, updatedData) {
  try {
    const list = await getRegisteredStudentsList();
    const index = list.findIndex(s => s.uid === uid);
    if (index === -1) throw new Error("Student dossier not located.");

    list[index] = { ...list[index], ...updatedData };
    localStorage.setItem("mock_students_list", JSON.stringify(list));

    await logAdminActivity("Student Information Modified", `Updated details for student dossier: ${list[index].fullname}`);
    return list[index];
  } catch (err) {
    console.error("editStudentRecordAdmin error:", err);
    throw err;
  }
}

export async function deleteStudentRecordAdmin(uid) {
  try {
    const list = await getRegisteredStudentsList();
    const student = list.find(s => s.uid === uid);
    if (!student) throw new Error("Student dossier not located.");

    const filtered = list.filter(s => s.uid !== uid);
    localStorage.setItem("mock_students_list", JSON.stringify(filtered));

    await logAdminActivity("Student Dossier Deleted", `Permanently purged record for applicant: ${student.fullname}`);
    return true;
  } catch (err) {
    console.error("deleteStudentRecordAdmin error:", err);
    throw err;
  }
}

// --- DOCUMENT VERIFICATION PROCESS ---
export async function updateDocumentStatus(uid, docType, status, feedback = "") {
  try {
    const list = await getRegisteredStudentsList();
    const index = list.findIndex(s => s.uid === uid);
    if (index === -1) throw new Error("Student dossier not located.");

    const student = list[index];
    if (!student.documents) {
      student.documents = {
        passportPhoto: { status: "pending", fileUrl: "", feedback: "" },
        idCard: { status: "pending", fileUrl: "", feedback: "" },
        certificates: { status: "pending", fileUrl: "", feedback: "" },
        supportingDocuments: { status: "pending", fileUrl: "", feedback: "" }
      };
    }

    if (!student.documents[docType]) {
      student.documents[docType] = { status: "pending", fileUrl: "", feedback: "" };
    }

    student.documents[docType].status = status;
    if (feedback !== undefined) student.documents[docType].feedback = feedback;

    // Recalculate Document stage in workflow
    const docs = student.documents;
    const allApproved = docs.passportPhoto.status === "approved" &&
                        docs.idCard.status === "approved" &&
                        docs.certificates.status === "approved";
    
    const anyRejected = docs.passportPhoto.status === "rejected" ||
                        docs.idCard.status === "rejected" ||
                        docs.certificates.status === "rejected";

    if (allApproved) {
      student.workflow.documentVerification = "approved";
    } else if (anyRejected) {
      student.workflow.documentVerification = "rejected";
    } else {
      student.workflow.documentVerification = "pending";
    }

    list[index] = student;
    localStorage.setItem("mock_students_list", JSON.stringify(list));

    // Audit Log
    await logAdminActivity(
      "Document Audit Updated", 
      `Document "${docType}" of ${student.fullname} audited as: ${status.toUpperCase()}. Feedback: ${feedback}`
    );

    // Notify student if rejected or resubmission is required
    if (status === "rejected" || status === "request_resubmission") {
      await sendSystemAlertNotification(
        student.fullname,
        student.studentId,
        student.email,
        "Document Correction Required",
        `Your submitted document [${docType.toUpperCase()}] requires correction. Reviewer feedback: "${feedback}". Please resubmit in your portal.`,
        "Document Audit"
      );
    }

    return student;
  } catch (err) {
    console.error("updateDocumentStatus error:", err);
    throw err;
  }
}

// --- DYNAMIC WORKFLOW MANAGER ---
export async function updateWorkflowStage(uid, stage, status) {
  try {
    const list = await getRegisteredStudentsList();
    const index = list.findIndex(s => s.uid === uid);
    if (index === -1) throw new Error("Student dossier not located.");

    const student = list[index];
    if (!student.workflow) {
      student.workflow = {
        submitted: true,
        pendingReview: "approved",
        documentVerification: "pending",
        paymentVerification: "pending",
        adminApproval: "pending",
        studentActivated: false
      };
    }

    student.workflow[stage] = status;

    // Trigger state progressions
    if (stage === "adminApproval" && status === "approved") {
      student.workflow.studentActivated = true;
      student.status = "approved";
      student.approvalStatus = "approved";

      // Dispatch alert
      await sendSystemAlertNotification(
        student.fullname,
        student.studentId,
        student.email,
        "Admission Application Approved",
        `Congratulations! Your enrollment for the ${student.course} course has been approved. You are now fully activated.`,
        "Admission Status"
      );
    } else if (stage === "adminApproval" && status === "rejected") {
      student.status = "rejected";
      student.approvalStatus = "rejected";
      student.workflow.studentActivated = false;

      await sendSystemAlertNotification(
        student.fullname,
        student.studentId,
        student.email,
        "Admission Application Rejected",
        `We regret to inform you that your registration for the ${student.course} course was rejected upon central review. Contact admissions for details.`,
        "Admission Status"
      );
    }

    list[index] = student;
    localStorage.setItem("mock_students_list", JSON.stringify(list));

    await logAdminActivity("Workflow Stage Adjusted", `Workflow stage "${stage}" of ${student.fullname} updated to: ${status.toUpperCase()}`);
    return student;
  } catch (err) {
    console.error("updateWorkflowStage error:", err);
    throw err;
  }
}

// --- FINANCE AUDIT & PAYMENTS VERIFICATION ---
export async function getPaymentsList() {
  const pStr = localStorage.getItem("mock_payments") || "[]";
  return JSON.parse(pStr);
}

export async function verifyPayment(paymentId, status, rejectionReason = "") {
  try {
    const paymentsStr = localStorage.getItem("mock_payments") || "[]";
    const payments = JSON.parse(paymentsStr);
    const index = payments.findIndex(p => p.id === paymentId);
    if (index === -1) throw new Error("Payment record not found.");

    const payment = payments[index];
    payment.status = status;
    payment.verificationFeedback = rejectionReason;
    payments[index] = payment;
    localStorage.setItem("mock_payments", JSON.stringify(payments));

    // Retrieve corresponding student and update workflow payment stage
    const students = await getRegisteredStudentsList();
    const studIndex = students.findIndex(s => s.studentId === payment.studentId);
    if (studIndex !== -1) {
      const student = students[studIndex];
      if (status === "Verified") {
        student.workflow.paymentVerification = "approved";
        if (!student.paymentHistory.includes(payment.referenceNumber)) {
          student.paymentHistory.push(payment.referenceNumber);
        }
      } else if (status === "Failed") {
        student.workflow.paymentVerification = "rejected";
      } else {
        student.workflow.paymentVerification = "pending";
      }
      students[studIndex] = student;
      localStorage.setItem("mock_students_list", JSON.stringify(students));

      // Dispatch alert
      const mailTitle = status === "Verified" ? "Payment Verification Succeeded" : "Payment Verification Failed";
      const mailText = status === "Verified"
        ? `We have confirmed receipt of your payment ₦${payment.amount.toLocaleString()} (Ref: ${payment.referenceNumber}) for ${payment.course}. Your payment is verified.`
        : `Your payment reference ${payment.referenceNumber} for ₦${payment.amount.toLocaleString()} was marked as FAILED. Reason: "${rejectionReason}". Please upload valid proof.`;

      await sendSystemAlertNotification(
        student.fullname,
        student.studentId,
        student.email,
        mailTitle,
        mailText,
        "Payment Audit"
      );
    }

    await logAdminActivity("Payment Audited", `Payment transaction ${payment.referenceNumber} marked as ${status.toUpperCase()}`);
    return payment;
  } catch (err) {
    console.error("verifyPayment error:", err);
    throw err;
  }
}

export async function recordOfflinePayment(studentName, studentId, course, amount, method, ref) {
  try {
    const paymentsStr = localStorage.getItem("mock_payments") || "[]";
    const payments = JSON.parse(paymentsStr);

    const refNum = ref || "REF-OFF-" + Math.floor(100000 + Math.random() * 900000);
    const newPayment = {
      id: "PAY-OFF-" + Date.now(),
      studentName,
      studentId,
      course,
      amount: parseFloat(amount),
      paymentMethod: method || "Cash / Offline",
      paymentDate: new Date().toISOString().split("T")[0],
      referenceNumber: refNum,
      proofOfPayment: "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=500&auto=format&fit=crop&q=60",
      status: "Verified", // Offline admin entries are pre-verified
      createdAt: new Date().toISOString()
    };

    payments.unshift(newPayment);
    localStorage.setItem("mock_payments", JSON.stringify(payments));

    // Also link to student record
    const students = await getRegisteredStudentsList();
    const index = students.findIndex(s => s.studentId === studentId);
    if (index !== -1) {
      const student = students[index];
      student.workflow.paymentVerification = "approved";
      if (!student.paymentHistory.includes(refNum)) {
        student.paymentHistory.push(refNum);
      }
      students[index] = student;
      localStorage.setItem("mock_students_list", JSON.stringify(students));
    }

    await logAdminActivity("Offline Payment Registered", `Manually logged ₦${parseFloat(amount).toLocaleString()} payment for student ID ${studentId}.`);
    return newPayment;
  } catch (err) {
    console.error("recordOfflinePayment error:", err);
    throw err;
  }
}

// --- COURSE MANAGEMENT ---
export async function getCoursesList() {
  const cStr = localStorage.getItem("mock_courses") || "[]";
  return JSON.parse(cStr);
}

export async function createCourseAdmin(title, fee, duration, description, deadline, instructor, requirements = "") {
  try {
    const courses = await getCoursesList();
    const id = "course-" + Date.now();
    const newCourse = {
      id,
      title,
      courseName: title,
      description,
      duration,
      fee: parseFloat(fee) || 0,
      requirements: requirements || "None specified.",
      learningOutcomes: "Professional competency certificates upon completion.",
      courseImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&auto=format&fit=crop&q=60",
      isArchived: false,
      deadline: deadline || "No deadline set",
      instructor: instructor || "Unassigned"
    };

    courses.push(newCourse);
    localStorage.setItem("mock_courses", JSON.stringify(courses));

    await logAdminActivity("New Course Created", `Launched a new syllabus course curriculum: "${title}".`);
    return newCourse;
  } catch (err) {
    console.error("createCourseAdmin error:", err);
    throw err;
  }
}

export async function updateCourseAdmin(courseId, updatedData) {
  try {
    const courses = await getCoursesList();
    const index = courses.findIndex(c => c.id === courseId);
    if (index === -1) throw new Error("Course not found in records.");

    courses[index] = { ...courses[index], ...updatedData };
    localStorage.setItem("mock_courses", JSON.stringify(courses));

    await logAdminActivity("Course Updated", `Updated properties of syllabus course: "${courses[index].title}".`);
    return courses[index];
  } catch (err) {
    console.error("updateCourseAdmin error:", err);
    throw err;
  }
}

export async function archiveCourseAdmin(courseId, isArchived) {
  try {
    const courses = await getCoursesList();
    const index = courses.findIndex(c => c.id === courseId);
    if (index === -1) throw new Error("Course not found.");

    courses[index].isArchived = isArchived;
    localStorage.setItem("mock_courses", JSON.stringify(courses));

    const logAction = isArchived ? "Course Archived" : "Course Unarchived";
    await logAdminActivity(logAction, `Syllabus course "${courses[index].title}" status toggled.`);
    return courses[index];
  } catch (err) {
    console.error("archiveCourseAdmin error:", err);
    throw err;
  }
}

export async function deleteCourseAdmin(courseId) {
  try {
    const courses = await getCoursesList();
    const course = courses.find(c => c.id === courseId);
    if (!course) throw new Error("Course not found.");

    const filtered = courses.filter(c => c.id !== courseId);
    localStorage.setItem("mock_courses", JSON.stringify(filtered));

    await logAdminActivity("Course Curricula Deleted", `Purged course listing: "${course.title}".`);
    return true;
  } catch (err) {
    console.error("deleteCourseAdmin error:", err);
    throw err;
  }
}

// --- STUDENT DISPATCH & ALERTS (NOTIFICATION CENTRE) ---
export async function getNotificationsHistoryList() {
  const notStr = localStorage.getItem("mock_notifications_history") || "[]";
  return JSON.parse(notStr);
}

export async function deleteNotificationAdmin(notifId) {
  try {
    const history = await getNotificationsHistoryList();
    const filtered = history.filter(n => n.id !== notifId);
    localStorage.setItem("mock_notifications_history", JSON.stringify(filtered));
    return true;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// General System alert notification & Simulated mail sender
export async function sendSystemAlertNotification(studentName, studentId, studentEmail, title, message, type = "General Notification") {
  try {
    const historyStr = localStorage.getItem("mock_notifications_history") || "[]";
    const history = JSON.parse(historyStr);

    const newAlert = {
      id: "notif-gen-" + Date.now() + Math.floor(Math.random() * 100),
      studentName,
      studentId: studentId || "all",
      email: studentEmail,
      title,
      message,
      type,
      channel: "In-App & Email Dispatched",
      createdAt: new Date().toISOString()
    };

    history.unshift(newAlert);
    localStorage.setItem("mock_notifications_history", JSON.stringify(history));

    // Also dispatch to standard student alerts table if available
    const alertsStr = localStorage.getItem("mock_notifications") || "[]";
    const alerts = JSON.parse(alertsStr);
    alerts.unshift({
      id: "alert-" + Date.now(),
      studentId: studentId || "all",
      title,
      message,
      status: "unread",
      type,
      createdAt: new Date().toISOString()
    });
    localStorage.setItem("mock_notifications", JSON.stringify(alerts));

    return newAlert;
  } catch (err) {
    console.error("Failed writing system alerts:", err);
  }
}

// --- ADMINISTRATOR MANAGEMENT (RBAC) ---
export async function getAdministratorsList() {
  const adminStr = localStorage.getItem("mock_administrators") || "[]";
  return JSON.parse(adminStr);
}

export async function createAdministrator(adminData) {
  try {
    const list = await getAdministratorsList();
    const newAdmin = {
      id: "admin-" + Date.now(),
      name: adminData.name,
      email: adminData.email,
      username: adminData.username,
      role: adminData.role || "Administrator",
      avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=70",
      active: true,
      createdAt: new Date().toISOString()
    };

    list.push(newAdmin);
    localStorage.setItem("mock_administrators", JSON.stringify(list));

    await logAdminActivity("New Admin Recruited", `Added administrative console login credentials for ${adminData.name} as ${adminData.role}`);
    return newAdmin;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function updateAdministrator(adminId, updatedFields) {
  try {
    const list = await getAdministratorsList();
    const index = list.findIndex(a => a.id === adminId);
    if (index === -1) throw new Error("Administrator profile not located.");

    list[index] = { ...list[index], ...updatedFields };
    localStorage.setItem("mock_administrators", JSON.stringify(list));

    await logAdminActivity("Admin Record Updated", `Adjusted records/role permissions for console operator: ${list[index].name}`);
    return list[index];
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function deleteAdministrator(adminId) {
  try {
    const list = await getAdministratorsList();
    const admin = list.find(a => a.id === adminId);
    if (!admin) throw new Error("Operator not found.");

    const filtered = list.filter(a => a.id !== adminId);
    localStorage.setItem("mock_administrators", JSON.stringify(filtered));

    await logAdminActivity("Admin Dismissed", `Removed console access authority for: ${admin.name}`);
    return true;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// --- COMPANY & SYSTEM PREFERENCES ---
export async function getAdminProfile() {
  try {
    const pStr = localStorage.getItem("mock_admin_profile");
    if (pStr) return JSON.parse(pStr);
  } catch (err) {
    console.error(err);
  }
  return {
    fullName: "Chief Director Admin",
    username: "ejaytechadmin",
    email: "ejaytechadmin@gmail.com",
    role: "Super Admin",
    darkModeEnabled: false,
    profilePictureUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=70",
    websiteSettings: {
      siteName: "EJaytech Concepts",
      contactPhone: "+2347033719342",
      contactEmail: "ejaytechconcepts@gmail.com",
      headOfficeAddress: "04 Akande Oke Street, Eleweran, Abeokuta",
      smtpServer: "smtp.gmail.com",
      smtpPort: "587",
      paymentAccountName: "EJaytech Concepts Limited",
      paymentAccountNumber: "1023948210",
      paymentBank: "Zenith Bank PLC"
    }
  };
}

export async function updateAdminProfile(uid, data) {
  try {
    const current = await getAdminProfile();
    const merged = { ...current, ...data };
    localStorage.setItem("mock_admin_profile", JSON.stringify(merged));
    await logAdminActivity("System Profile Modified", "Adjusted general preferences / website credentials.");
    return merged;
  } catch (err) {
    console.error("updateAdminProfile error:", err);
    throw err;
  }
}

// --- INITIAL SEEDING TRIGGER ---
seedAdminMockDatabase();

// Expose functions globally to window for UI script parsing
window.getRegisteredStudentsList = getRegisteredStudentsList;
window.logAdminActivity = logAdminActivity;
window.getActivityLogsList = getActivityLogsList;
window.purgeActivityLogs = purgeActivityLogs;
window.editStudentRecordAdmin = editStudentRecordAdmin;
window.deleteStudentRecordAdmin = deleteStudentRecordAdmin;
window.updateDocumentStatus = updateDocumentStatus;
window.updateWorkflowStage = updateWorkflowStage;
window.getPaymentsList = getPaymentsList;
window.verifyPayment = verifyPayment;
window.recordOfflinePayment = recordOfflinePayment;
window.getCoursesList = getCoursesList;
window.createCourseAdmin = createCourseAdmin;
window.updateCourseAdmin = updateCourseAdmin;
window.archiveCourseAdmin = archiveCourseAdmin;
window.deleteCourseAdmin = deleteCourseAdmin;
window.getNotificationsHistoryList = getNotificationsHistoryList;
window.deleteNotificationAdmin = deleteNotificationAdmin;
window.sendSystemAlertNotification = sendSystemAlertNotification;
window.getAdministratorsList = getAdministratorsList;
window.createAdministrator = createAdministrator;
window.updateAdministrator = updateAdministrator;
window.deleteAdministrator = deleteAdministrator;
window.getAdminProfile = getAdminProfile;
window.updateAdminProfile = updateAdminProfile;
window.seedAdminMockDatabase = seedAdminMockDatabase;
