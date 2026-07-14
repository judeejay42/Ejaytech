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
        fileUrl: "#",
        fileType: "pdf",
        fileName: "html5_css3_guide.pdf",
        createdAt: new Date(Date.now() - 3600000 * 48).toISOString()
      },
      {
        id: "mat-2",
        title: "Responsive Visual Grid Exercise Sheet",
        description: "Graphic Design grids, Photoshop guides, and UI wireframe project layouts.",
        courseId: "Graphic Design",
        fileUrl: "#",
        fileType: "zip",
        fileName: "grid_system_templates.zip",
        createdAt: new Date(Date.now() - 3600000 * 12).toISOString()
      }
    ];
    localStorage.setItem("mock_materials", JSON.stringify(defaultMaterials));
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
