/**
 * EJaytech Concepts - Student Operations Module (DISCONNECTED / OFFLINE PORTAL)
 * Manages profile loading, class materials listing, and assignments/materials upload triggers
 * using a local persistence mock layer (localStorage).
 */

import { db, storage } from "./js/firebase-config.js";

// Placeholder comments for future Firebase project re-connection
/*
// TO RE-CONNECT FIREBASE PORTAL IN THE FUTURE:
// Simply import db and storage from the live firebase-config.js file:
// import { db, storage } from "./js/firebase-config.js";
*/

// Help seed mock data if not existing
function seedMockStudentPortalData() {
  if (!localStorage.getItem("mock_notifications")) {
    const defaultNotifications = [
      {
        id: "notif-1",
        studentId: "all",
        title: "Welcome to EJaytech Concepts!",
        message: "We are glad to have you on board. Explore your courses, study materials, and assignments in this portal.",
        status: "unread",
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString() // 1 day ago
      },
      {
        id: "notif-2",
        studentId: "EJ-2026-9999",
        title: "Application Approved",
        message: "Congratulations! Your application to EJaytech Concepts has been reviewed and approved. Welcome to your learning workspace.",
        status: "unread",
        createdAt: new Date().toISOString()
      },
      {
        id: "notif-3",
        studentId: "EJ-2026-9999",
        title: "Registration Approved",
        message: "Your course registration has been officially approved. Check the 'My Courses' tab to view your active curriculum.",
        status: "unread",
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
      },
      {
        id: "notif-4",
        studentId: "EJ-2026-9999",
        title: "Payment Confirmed",
        message: "Your payment reference has been verified by the finance department. Download your receipts under 'Payments'.",
        status: "unread",
        createdAt: new Date(Date.now() - 3600000 * 3).toISOString()
      },
      {
        id: "notif-5",
        studentId: "EJ-2026-9999",
        title: "Assignment Posted",
        message: "A new design layout assignment has been posted by Mr. Femi Adeleye under Learning Resources.",
        status: "unread",
        createdAt: new Date(Date.now() - 3600000 * 10).toISOString()
      }
    ];
    localStorage.setItem("mock_notifications", JSON.stringify(defaultNotifications));
  }

  if (!localStorage.getItem("mock_materials")) {
    const defaultMaterials = [
      {
        id: "mat-1",
        title: "Introduction to HTML5 & CSS3 Basics",
        description: "Learn the foundational structural markup and styling concepts for modern web layouts.",
        courseId: "Software Engineering",
        filePath: "assets/images/placeholder_document.pdf",
        fileType: "pdf",
        fileName: "html5_css3_guide.pdf",
        fileSize: "2.4 MB",
        createdAt: new Date(Date.now() - 3600000 * 48).toISOString()
      },
      {
        id: "mat-2",
        title: "Responsive Visual Grid Exercise Sheet",
        description: "Graphic Design grids, Photoshop guides, and UI wireframe project layouts.",
        courseId: "Graphic Design",
        filePath: "assets/images/placeholder_document.pdf",
        fileType: "zip",
        fileName: "grid_system_templates.zip",
        fileSize: "12.8 MB",
        createdAt: new Date(Date.now() - 3600000 * 12).toISOString()
      },
      {
        id: "mat-3",
        title: "Network Protection & Firewall Operations Guide",
        description: "Standard security frameworks and firewall configurations for active network defense.",
        courseId: "Cybersecurity Basics",
        filePath: "assets/images/placeholder_document.pdf",
        fileType: "pdf",
        fileName: "firewall_networks_guide.pdf",
        fileSize: "5.1 MB",
        createdAt: new Date(Date.now() - 3600000 * 36).toISOString()
      }
    ];
    localStorage.setItem("mock_materials", JSON.stringify(defaultMaterials));
  }

  if (!localStorage.getItem("mock_instructors")) {
    const defaultInstructors = [
      {
        id: "inst-1",
        name: "Engr. Kayode",
        department: "Software Engineering & Cyber Operations",
        assignedCourses: "Software Engineering, Cybersecurity Basics",
        centre: "Abuja Hub & ABK",
        officeHours: "Mon - Thu, 10:00 AM - 02:00 PM",
        email: "instructor.abk@ejaytech.com",
        phone: "+234 814 321 0987",
        profilePhoto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
      },
      {
        id: "inst-2",
        name: "Mr. Femi Adeleye",
        department: "Visual Communication & UI/UX Design",
        assignedCourses: "Graphic Design",
        centre: "Ibadan Centre",
        officeHours: "Tue - Fri, 01:00 PM - 05:00 PM",
        email: "femi.adeleye@ejaytech.com",
        phone: "+234 708 877 6655",
        profilePhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80"
      }
    ];
    localStorage.setItem("mock_instructors", JSON.stringify(defaultInstructors));
  }

  if (!localStorage.getItem("mock_timetable")) {
    const defaultTimetable = [
      {
        id: "time-1",
        day: "Monday",
        time: "09:00 AM - 12:00 PM",
        course: "Software Engineering",
        venue: "Main Lab - Abuja Garki",
        instructor: "Engr. Kayode"
      },
      {
        id: "time-2",
        day: "Wednesday",
        time: "10:00 AM - 01:00 PM",
        course: "Software Engineering",
        venue: "Virtual Room A & Live Stream",
        instructor: "Engr. Kayode"
      },
      {
        id: "time-3",
        day: "Tuesday",
        time: "11:00 AM - 02:00 PM",
        course: "Graphic Design",
        venue: "Creative Studio - Ibadan",
        instructor: "Mr. Femi Adeleye"
      },
      {
        id: "time-4",
        day: "Thursday",
        time: "02:00 PM - 05:00 PM",
        course: "Graphic Design",
        venue: "Virtual Design Board",
        instructor: "Mr. Femi Adeleye"
      },
      {
        id: "time-5",
        day: "Friday",
        time: "09:00 AM - 12:00 PM",
        course: "Cybersecurity Basics",
        venue: "Cyber Range Lab - Abuja",
        instructor: "Engr. Kayode"
      }
    ];
    localStorage.setItem("mock_timetable", JSON.stringify(defaultTimetable));
  }

  if (!localStorage.getItem("mock_grades")) {
    const defaultGrades = [
      {
        id: "grade-s1",
        studentId: "EJ-2026-9999",
        studentName: "EJaytech Student",
        course: "Software Engineering",
        courseCode: "SEN-201",
        creditUnits: 4,
        semester: "1st Semester",
        testScore: 28,
        examScore: 61,
        totalScore: 89,
        grade: "A",
        remarks: "Excellent practical implementation skills.",
        instructor: "Engr. Kayode"
      },
      {
        id: "grade-s2",
        studentId: "EJ-2026-9999",
        studentName: "EJaytech Student",
        course: "Software Engineering",
        courseCode: "SEN-202",
        creditUnits: 3,
        semester: "1st Semester",
        testScore: 24,
        examScore: 54,
        totalScore: 78,
        grade: "B",
        remarks: "Strong structural logic.",
        instructor: "Engr. Kayode"
      }
    ];
    localStorage.setItem("mock_grades", JSON.stringify(defaultGrades));
  }

  if (!localStorage.getItem("mock_attendance_individual")) {
    const defaultAtt = [
      { id: "att-i1", date: "2026-07-01", course: "Software Engineering", status: "Present", duration: "3 Hours", instructor: "Engr. Kayode" },
      { id: "att-i2", date: "2026-07-03", course: "Software Engineering", status: "Present", duration: "3 Hours", instructor: "Engr. Kayode" },
      { id: "att-i3", date: "2026-07-06", course: "Software Engineering", status: "Present", duration: "3 Hours", instructor: "Engr. Kayode" },
      { id: "att-i4", date: "2026-07-08", course: "Software Engineering", status: "Absent", duration: "3 Hours", instructor: "Engr. Kayode" },
      { id: "att-i5", date: "2026-07-10", course: "Software Engineering", status: "Present", duration: "3 Hours", instructor: "Engr. Kayode" },
      { id: "att-i6", date: "2026-07-13", course: "Software Engineering", status: "Present", duration: "3 Hours", instructor: "Engr. Kayode" },
      { id: "att-i7", date: "2026-07-15", course: "Software Engineering", status: "Present", duration: "3 Hours", instructor: "Engr. Kayode" }
    ];
    localStorage.setItem("mock_attendance_individual", JSON.stringify(defaultAtt));
  }

  if (!localStorage.getItem("mock_messages")) {
    const defaultMessages = [
      {
        id: "msg-1",
        sender: "Super Admin",
        senderBadge: "Executive Board",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=70",
        message: "Dear Student, Welcome to EJaytech Concepts Workspace. Our mission is to accelerate your career. Let us know if you require structural or resource modifications.",
        createdAt: new Date(Date.now() - 3600000 * 48).toISOString()
      },
      {
        id: "msg-2",
        sender: "Engr. Kayode",
        senderBadge: "Assigned Instructor",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
        message: "Hello class! Please ensure you review Chapter 2: Responsive Grids before our lab session on Monday morning. Submit your zip exercises on the workspace portal.",
        createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
      }
    ];
    localStorage.setItem("mock_messages", JSON.stringify(defaultMessages));
  }
}

// Seed the data instantly
seedMockStudentPortalData();

/**
 * Fetch and load student profile data
 */
export async function getStudentProfile(uid) {
  console.log(`[Mock DB] Loading student profile for UID: ${uid}`);
  const cached = localStorage.getItem("mock_student_profile");
  if (cached) {
    return JSON.parse(cached);
  }

  // Return a beautiful default profile if none exists
  const defaultProfile = {
    uid: uid || "mock_student_uid",
    studentId: "EJ-2026-9999",
    fullName: "EJaytech Student",
    fullname: "EJaytech Student",
    email: "student@example.com",
    phone: "07033719342",
    gender: "Male",
    dob: "2000-01-01",
    state: "Lagos",
    address: "04 Akande Oke Street, Abeokuta",
    course: "Software Engineering",
    role: "student",
    status: "approved",
    approvalStatus: "approved",
    createdAt: new Date().toISOString(),
    bio: "Enthusiastic EJaytech Concepts student.",
    lastDocumentSubmitted: ""
  };
  localStorage.setItem("mock_student_profile", JSON.stringify(defaultProfile));
  return defaultProfile;
}

/**
 * Update basic personal bio fields inside local storage
 */
export async function updateStudentProfile(uid, fields) {
  console.log(`[Mock DB] Updating student profile for UID: ${uid}`);
  const current = await getStudentProfile(uid);
  const updatedProfile = {
    ...current,
    fullname: fields.fullname || current.fullname,
    fullName: fields.fullname || current.fullname,
    phone: fields.phone || current.phone,
    gender: fields.gender || current.gender,
    dob: fields.dob || current.dob,
    state: fields.state || current.state,
    address: fields.address || current.address,
    bio: fields.bio || ""
  };

  localStorage.setItem("mock_student_profile", JSON.stringify(updatedProfile));
  
  // Also sync in the registered students list if it exists
  try {
    const listStr = localStorage.getItem("mock_students_list");
    if (listStr) {
      const list = JSON.parse(listStr);
      const idx = list.findIndex(s => s.uid === uid);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...updatedProfile };
        localStorage.setItem("mock_students_list", JSON.stringify(list));
      }
    }
  } catch (e) {
    console.warn("Could not sync profile update in students list:", e);
  }

  return updatedProfile;
}

/**
 * Retrieve notifications applicable to this student
 */
export async function getStudentNotifications(studentId) {
  console.log(`[Mock DB] Querying student notifications for ID: ${studentId}`);
  let list = [];
  try {
    const notificationsStr = localStorage.getItem("mock_notifications");
    if (notificationsStr) {
      const allNotifs = JSON.parse(notificationsStr);
      list = allNotifs.filter(n => n.studentId === "all" || n.studentId === studentId);
    }
  } catch (e) {
    console.error("Failed to load mock notifications:", e);
  }
  return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

/**
 * Mark a notification as read
 */
export async function markNotificationAsRead(notifId) {
  console.log(`[Mock DB] Marking notification as read: ${notifId}`);
  try {
    const notificationsStr = localStorage.getItem("mock_notifications");
    if (notificationsStr) {
      const allNotifs = JSON.parse(notificationsStr);
      const updated = allNotifs.map(n => {
        if (n.id === notifId) {
          return { ...n, status: "read", read: true, isRead: true };
        }
        return n;
      });
      localStorage.setItem("mock_notifications", JSON.stringify(updated));
    }
  } catch (e) {
    console.error(e);
  }
}

/**
 * Retrieve materials for a specific course
 */
export async function getCourseMaterials(courseName) {
  console.log(`[Mock DB] Loading course materials for course: ${courseName}`);
  let list = [];
  try {
    const materialsStr = localStorage.getItem("mock_materials");
    if (materialsStr) {
      const allMaterials = JSON.parse(materialsStr);
      list = allMaterials.filter(m => !courseName || m.courseId === courseName || m.courseId === "all");
    }
  } catch (e) {
    console.error(e);
  }
  return list;
}

/**
 * Upload an Assignment File locally
 */
export async function uploadAssignmentFile(uid, studentId, fileObj) {
  if (!fileObj) throw new Error("Please select a file to submit.");
  
  console.log(`[Mock DB] Uploading assignment file: ${fileObj.name}`);
  const downloadUrl = `assets/images/placeholder_document.pdf`; // fallback local link
  
  // Link document submit inside local student record
  const current = await getStudentProfile(uid);
  current.lastDocumentSubmitted = downloadUrl;
  localStorage.setItem("mock_student_profile", JSON.stringify(current));

  // Update in the main student list if possible
  try {
    const listStr = localStorage.getItem("mock_students_list");
    if (listStr) {
      const list = JSON.parse(listStr);
      const idx = list.findIndex(s => s.uid === uid);
      if (idx !== -1) {
        list[idx].lastDocumentSubmitted = downloadUrl;
        localStorage.setItem("mock_students_list", JSON.stringify(list));
      }
    }
  } catch (e) {
    console.warn(e);
  }

  // Add system administrative log notice in notifications
  const notifId = "notif-" + Date.now();
  const adminNotification = {
    id: notifId,
    studentId: "admin",
    title: `Assignment uploaded: ${studentId}`,
    message: `Student ID ${studentId} uploaded assignment material "${fileObj.name}". Link: ${downloadUrl}`,
    status: "unread",
    createdAt: new Date().toISOString()
  };

  let notifications = [];
  try {
    const existing = localStorage.getItem("mock_notifications");
    if (existing) notifications = JSON.parse(existing);
  } catch (e) { console.warn(e); }
  notifications.push(adminNotification);
  localStorage.setItem("mock_notifications", JSON.stringify(notifications));

  return downloadUrl;
}

// Expose functions globally to window
window.getStudentProfile = getStudentProfile;
window.updateStudentProfile = updateStudentProfile;
window.getStudentNotifications = getStudentNotifications;
window.markNotificationAsRead = markNotificationAsRead;
window.getCourseMaterials = getCourseMaterials;
window.uploadAssignmentFile = uploadAssignmentFile;
