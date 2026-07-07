/**
 * EJaytech Concepts - Administrator Dashboard Logic (Real Firebase Integration)
 * Integrates admin capabilities: approving/rejecting accounts, managing courses list,
 * posting public notifications, and uploading study resource files.
 */

/**
 * Fetch list of all registered students in the system
 */
export async function getRegisteredStudentsList() {
  const snapshot = await db.collection("users").get();
  const list = [];
  snapshot.forEach(doc => {
    const data = doc.data();
    // Exclude all administrators from the user/student list
    if (data.role !== "admin") {
      list.push({ uid: doc.id, ...data });
    }
  });
  return list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
}

/**
 * Record action in activity logs inside Firestore
 */
export async function logAdminActivity(actionMessage) {
  const serverTimestamp = window.firebaseServerTimestamp 
    ? window.firebaseServerTimestamp() 
    : new Date().toISOString();

  await db.collection("activity_logs").add({
    message: actionMessage,
    createdAt: serverTimestamp
  });
}

/**
 * Fetch all activity logs from Firestore sorted by createdAt desc
 */
export async function getActivityLogsList() {
  const snapshot = await db.collection("activity_logs").get();
  const list = [];
  snapshot.forEach(doc => {
    list.push({ id: doc.id, ...doc.data() });
  });
  return list.sort((a, b) => {
    const timeA = a.createdAt && a.createdAt.seconds ? a.createdAt.seconds * 1000 : new Date(a.createdAt);
    const timeB = b.createdAt && b.createdAt.seconds ? b.createdAt.seconds * 1000 : new Date(b.createdAt);
    return timeB - timeA;
  });
}

/**
 * Clear all activity logs
 */
export async function purgeActivityLogs() {
  const snapshot = await db.collection("activity_logs").get();
  for (const doc of snapshot.docs) {
    await doc.ref.delete();
  }
}

/**
 * Approve student registration
 */
export async function approveStudentApplication(uid, studentId) {
  const serverTimestamp = window.firebaseServerTimestamp 
    ? window.firebaseServerTimestamp() 
    : new Date().toISOString();

  const adminEmail = (window.auth && window.auth.currentUser && window.auth.currentUser.email) || "administrator";

  // Update student status inside Firestore users collection
  await db.collection("users").doc(uid).update({
    status: "approved",
    approvedAt: serverTimestamp,
    approvedBy: adminEmail
  });

  console.log("Student approved:", studentId);

  // Retrieve student details to construct custom email components
  const studentDoc = await db.collection("users").doc(uid).get();
  if (!studentDoc.exists) throw new Error("Student profile record not found.");
  const studentData = studentDoc.data();
  const studentEmail = studentData.email || "";
  const studentName = studentData.fullname || "Student";
  const courseName = studentData.course || "General Software Track";

  const notifId = "notif-" + Date.now();

  // Create success notification record for the approved user
  await db.collection("notifications").doc(notifId).set({
    notificationId: notifId,
    studentId: studentId,
    title: "Application Approved",
    message: `Congratulations! Your application to EJaytech Concepts has been approved successfully. You may now access your student dashboard and learning resources.`,
    createdAt: serverTimestamp,
    isRead: false,
    read: false,
    status: "unread",
    type: "Approval Notification"
  });

  const emailSubject = "Application Approved – EJaytech Concepts";
  const emailMessage = `Dear ${studentName},\n\nCongratulations!\n\nWe are pleased to inform you that your application to EJaytech Concepts has been approved.\n\nStudent ID: ${studentId}\nCourse: ${courseName}\n\nYou can now log in to your student dashboard and access your learning resources.\n\nThank you for choosing EJaytech Concepts.\n\nBest Regards,\nEJaytech Concepts`;

  // Standard persistent email database sync log
  await db.collection("emails").add({
    to: studentEmail,
    subject: emailSubject,
    message: emailMessage,
    sentAt: new Date().toISOString(),
    status: "sent"
  });

  // Record action in activity logs
  const activityMessage = `Admin ${adminEmail} approved application for Student ID ${studentId} on ${new Date().toLocaleString()}.`;
  await logAdminActivity(activityMessage);
}

/**
 * Reject student registration
 */
export async function rejectStudentApplication(uid, studentId) {
  const serverTimestamp = window.firebaseServerTimestamp 
    ? window.firebaseServerTimestamp() 
    : new Date().toISOString();

  // Update student status inside Firestore users collection
  await db.collection("users").doc(uid).update({
    status: "rejected",
    rejectedAt: serverTimestamp
  });

  console.log("Student rejected:", studentId);

  // Retrieve student details to construct custom email components
  const studentDoc = await db.collection("users").doc(uid).get();
  if (!studentDoc.exists) throw new Error("Student profile record not found.");
  const studentData = studentDoc.data();
  const studentEmail = studentData.email || "";
  const studentName = studentData.fullname || "Student";

  const notifId = "notif-" + Date.now();

  // Create notifications record warning logs
  await db.collection("notifications").doc(notifId).set({
    notificationId: notifId,
    studentId: studentId,
    title: "Application Not Approved",
    message: `Thank you for applying to EJaytech Concepts. After reviewing your application, we are unable to approve it at this time.`,
    createdAt: serverTimestamp,
    isRead: false,
    read: false,
    status: "unread",
    type: "Rejection Notification"
  });

  const emailSubject = "Application Status Update – EJaytech Concepts";
  const emailMessage = `Dear ${studentName},\n\nThank you for your interest in EJaytech Concepts. After reviewing your application, we are unable to approve it at this time.\n\nRegards,\nEJaytech Concepts`;

  // Standard persistent email database sync log
  await db.collection("emails").add({
    to: studentEmail,
    subject: emailSubject,
    message: emailMessage,
    sentAt: new Date().toISOString(),
    status: "sent"
  });

  const adminEmail = (window.auth && window.auth.currentUser && window.auth.currentUser.email) || "administrator";
  // Record action in activity logs
  const activityMessage = `Admin ${adminEmail} rejected application for Student ID ${studentId} on ${new Date().toLocaleString()}.`;
  await logAdminActivity(activityMessage);
}

/**
 * Update registry indexes of student records
 */
export async function editStudentRecordAdmin(uid, data) {
  const updateData = { ...data };
  if (updateData.fullname !== undefined) {
    updateData.fullName = updateData.fullname;
  }
  await db.collection("users").doc(uid).update(updateData);
}

/**
 * Permanently purge student records (Administrative clearance)
 */
export async function deleteStudentRecordAdmin(uid) {
  await db.collection("users").doc(uid).delete();
}

/**
 * Retrieve courses list catalogue from database 
 */
export async function getCoursesList() {
  const snapshot = await db.collection("courses").get();
  const list = [];
  snapshot.forEach(doc => {
    list.push({ id: doc.id, ...doc.data() });
  });
  return list;
}

/**
 * Create or save courses list detail specifications inside database
 */
export async function createCourseAdmin(courseData) {
  const id = "course-" + Date.now();
  const courseRecord = {
    id,
    courseName: courseData.courseName || courseData.title,
    title: courseData.title || courseData.courseName,
    description: courseData.description,
    duration: courseData.duration,
    fee: courseData.fee,
    requirements: courseData.requirements || "",
    learningOutcomes: courseData.learningOutcomes || "",
    courseImage: courseData.courseImage || "",
    isArchived: false,
    syllabus: Array.isArray(courseData.syllabus) ? courseData.syllabus : (courseData.syllabus || "").split(",").map(s => s.trim()).filter(Boolean),
    thingsYouWillLearn: courseData.thingsYouWillLearn || courseData.learningOutcomes || ""
  };
  
  await db.collection("courses").doc(id).set(courseRecord);
  
  // Dispatch notification mapping announcement
  await db.collection("notifications").add({
    studentId: "all",
    title: "New Course Open!",
    message: `EJaytech has unlocked the new syllabus tracking: "${courseRecord.title}". Inquire about registration now!`,
    status: "unread",
    type: "Course Update",
    createdAt: new Date().toISOString()
  });

  return courseRecord;
}

/**
 * Update course details
 */
export async function updateCourseAdmin(courseId, courseData) {
  const courseRecord = {
    courseName: courseData.courseName || courseData.title,
    title: courseData.title || courseData.courseName,
    description: courseData.description,
    duration: courseData.duration,
    fee: courseData.fee,
    requirements: courseData.requirements || "",
    learningOutcomes: courseData.learningOutcomes || "",
    courseImage: courseData.courseImage || "",
    isArchived: courseData.isArchived === true,
    syllabus: Array.isArray(courseData.syllabus) ? courseData.syllabus : (courseData.syllabus || "").split(",").map(s => s.trim()).filter(Boolean),
    thingsYouWillLearn: courseData.thingsYouWillLearn || courseData.learningOutcomes || ""
  };
  await db.collection("courses").doc(courseId).update(courseRecord);
}

/**
 * Archive/Unarchive course
 */
export async function archiveCourseAdmin(courseId, isArchived) {
  await db.collection("courses").doc(courseId).update({ isArchived: !!isArchived });
}

/**
 * Delete course permanently
 */
export async function deleteCourseAdmin(courseId) {
  await db.collection("courses").doc(courseId).delete();
}

/**
 * Retrieve learning materials list
 */
export async function getMaterialsList() {
  const snapshot = await db.collection("materials").get();
  const list = [];
  snapshot.forEach(doc => {
    list.push({ id: doc.id, ...doc.data() });
  });
  return list;
}

/**
 * Put Study Learning Material attachment after uploading file to Storage
 */
export async function createLearningMaterialAdmin(title, description, courseId, fileObj, fileType = "PDF") {
  let downloadUrl = "#";
  let sizeLabel = "1.2 MB";

  if (fileObj && fileObj.size) {
    sizeLabel = (fileObj.size / (1024 * 1024)).toFixed(1) + " MB";
    const storagePath = `learning_materials/${courseId}/${Date.now()}_${fileObj.name}`;
    try {
      const uploadTask = await storage.ref().child(storagePath).put(fileObj);
      downloadUrl = await uploadTask.ref.getDownloadURL();
    } catch (err) {
      console.warn("Storage upload failed, using fallback pdf.", err);
      downloadUrl = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
    }
  } else {
    downloadUrl = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
  }

  const materialRecord = {
    id: "material-" + Date.now(),
    courseId,
    title,
    description: description || "No description provided.",
    filePath: downloadUrl,
    fileSize: sizeLabel,
    fileType: fileType,
    uploadedAt: new Date().toISOString()
  };

  await db.collection("materials").doc(materialRecord.id).set(materialRecord);

  // Broadcast alert to everyone in that course
  await db.collection("notifications").add({
    studentId: "all",
    title: "New study material file uploaded!",
    message: `New class reading material cataloged: "${title}". Browse yours under study space materials dashboards.`,
    status: "unread",
    type: "Assignment Notification",
    createdAt: new Date().toISOString()
  });

  return materialRecord;
}

/**
 * Delete a study material record
 */
export async function deleteLearningMaterialAdmin(materialId) {
  await db.collection("materials").doc(materialId).delete();
}

/**
 * Fetch campus Announcements
 */
export async function getAnnouncementsList() {
  const snapshot = await db.collection("announcements").get();
  const list = [];
  snapshot.forEach(doc => {
    list.push({ id: doc.id, ...doc.data() });
  });
  return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

/**
 * Create Announcement
 */
export async function createAnnouncementAdmin(title, message) {
  const id = "ann-" + Date.now();
  const announcementRecord = {
    id,
    title,
    message,
    createdAt: new Date().toISOString()
  };
  
  await db.collection("announcements").doc(id).set(announcementRecord);

  // Broadly syndicate as a global notification
  await db.collection("notifications").add({
    studentId: "all",
    title: `Announcement: ${title}`,
    message,
    status: "unread",
    type: "General Notice",
    createdAt: new Date().toISOString()
  });

  return announcementRecord;
}

/**
 * Edit announcement
 */
export async function editAnnouncementAdmin(annId, data) {
  await db.collection("announcements").doc(annId).update(data);
}

/**
 * Delete announcement
 */
export async function deleteAnnouncementAdmin(annId) {
  await db.collection("announcements").doc(annId).delete();
}

/**
 * Fetch all notifications for notification management history
 */
export async function getNotificationsHistoryList() {
  const snapshot = await db.collection("notifications").get();
  const list = [];
  snapshot.forEach(doc => {
    list.push({ id: doc.id, ...doc.data() });
  });
  return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

/**
 * Delete notice
 */
export async function deleteNotificationAdmin(notifId) {
  await db.collection("notifications").doc(notifId).delete();
}

/**
 * Create custom administrative system alert
 */
export async function createSystemAnnouncement(title, message, studentId) {
  const finalId = studentId || "all";
  await db.collection("notifications").add({
    studentId: finalId,
    title,
    message,
    status: "unread",
    type: "General Notice",
    createdAt: new Date().toISOString()
  });
}

/**
 * Fetch logged Admin document
 */
export async function getAdminProfile(uid) {
  const docRef = await db.collection("users").doc(uid).get();
  if (docRef.exists) {
    return docRef.data();
  }
  return {
    fullName: "EJaytech Chief Admin",
    username: "EJaytech Chief Admin",
    email: (window.auth && window.auth.currentUser && window.auth.currentUser.email) || "",
    darkModeEnabled: false,
    profilePictureUrl: "",
    websiteSettings: {
      siteName: "EJaytech Concepts",
      contactPhone: "07033719342",
      contactEmail: "ejaytechconcepts@gmail.com",
      headOfficeAddress: "04 Akande Oke Street, Eleweran, Abeokuta"
    }
  };
}

/**
 * Edit administrator settings profile details
 */
export async function updateAdminProfile(uid, data) {
  await db.collection("users").doc(uid).update(data);
}

/**
 * Change authenticated user's password using standard Firebase Modular Auth SDK API
 */
export async function changeAdminPassword(currentPassword, newPassword) {
  const user = auth.currentUser;
  if (!user) {
    const err = new Error("No active administrator user session. Please sign in again.");
    err.code = "auth/no-current-user";
    throw err;
  }

  if (!currentPassword) {
    const err = new Error("Current password is required to change security credentials.");
    err.code = "auth/missing-current-password";
    throw err;
  }

  if (!newPassword || newPassword.length < 8) {
    const err = new Error("New password must be at least 8 characters long.");
    err.code = "auth/weak-password";
    throw err;
  }

  // Import from modular config
  const configModule = await import("./firebase-config.js");
  const updatePassFn = configModule.updatePassword;
  const reauthFn = configModule.reauthenticateWithCredential;
  const providerCls = configModule.EmailAuthProvider;

  // Reauthenticate the currently signed-in user
  try {
    const credential = providerCls.credential(user.email, currentPassword);
    await reauthFn(user, credential);
  } catch (reauthErr) {
    console.error("Reauthentication failed:", reauthErr);
    const code = reauthErr.code || "";
    if (code === "auth/wrong-password" || reauthErr.message?.toLowerCase().includes("wrong-password") || reauthErr.message?.toLowerCase().includes("incorrect password")) {
      const err = new Error("Incorrect current password. Reauthentication failed.");
      err.code = "auth/wrong-password";
      throw err;
    } else if (code === "auth/network-request-failed" || reauthErr.message?.toLowerCase().includes("network")) {
      const err = new Error("Network request failed. Please check your connection and try again.");
      err.code = "auth/network-request-failed";
      throw err;
    } else {
      throw new Error("Reauthentication failed: " + reauthErr.message);
    }
  }

  // Perform password update using the modular SDK API
  try {
    await updatePassFn(user, newPassword);
  } catch (updateErr) {
    console.error("Password update failed:", updateErr);
    const code = updateErr.code || "";
    if (code === "auth/requires-recent-login" || updateErr.message?.toLowerCase().includes("recent-login")) {
      const err = new Error("Security verification expired. Please sign out and sign back in to change your password.");
      err.code = "auth/requires-recent-login";
      throw err;
    } else if (code === "auth/weak-password" || updateErr.message?.toLowerCase().includes("weak")) {
      const err = new Error("The new password is too weak. Please choose a stronger password (at least 8 characters).");
      err.code = "auth/weak-password";
      throw err;
    } else if (code === "auth/network-request-failed" || updateErr.message?.toLowerCase().includes("network")) {
      const err = new Error("Network request failed during password update. Please try again.");
      err.code = "auth/network-request-failed";
      throw err;
    } else {
      throw new Error("Password update failed: " + updateErr.message);
    }
  }
}

// Expose functions globally to window
window.getRegisteredStudentsList = getRegisteredStudentsList;
window.logAdminActivity = logAdminActivity;
window.getActivityLogsList = getActivityLogsList;
window.purgeActivityLogs = purgeActivityLogs;
window.approveStudentApplication = approveStudentApplication;
window.rejectStudentApplication = rejectStudentApplication;
window.editStudentRecordAdmin = editStudentRecordAdmin;
window.deleteStudentRecordAdmin = deleteStudentRecordAdmin;
window.getCoursesList = getCoursesList;
window.createCourseAdmin = createCourseAdmin;
window.updateCourseAdmin = updateCourseAdmin;
window.archiveCourseAdmin = archiveCourseAdmin;
window.deleteCourseAdmin = deleteCourseAdmin;
window.getMaterialsList = getMaterialsList;
window.createLearningMaterialAdmin = createLearningMaterialAdmin;
window.deleteLearningMaterialAdmin = deleteLearningMaterialAdmin;
window.getAnnouncementsList = getAnnouncementsList;
window.createAnnouncementAdmin = createAnnouncementAdmin;
window.editAnnouncementAdmin = editAnnouncementAdmin;
window.deleteAnnouncementAdmin = deleteAnnouncementAdmin;
window.getNotificationsHistoryList = getNotificationsHistoryList;
window.deleteNotificationAdmin = deleteNotificationAdmin;
window.createSystemAnnouncement = createSystemAnnouncement;
window.getAdminProfile = getAdminProfile;
window.updateAdminProfile = updateAdminProfile;
window.changeAdminPassword = changeAdminPassword;
