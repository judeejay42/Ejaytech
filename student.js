/**
 * EJaytech Concepts - Student Operations Module
 * Manages profile loading, class materials listing, and assignments/materials upload triggers.
 */

/**
 * Fetch and load student profile data
 */
async function getStudentProfile(uid) {
  const docRef = await db.collection("students").doc(uid).get();
  if (docRef.exists) {
    return docRef.data();
  }
  throw new Error("Target student registration record does not exist.");
}

/**
 * Update basic personal bio fields inside Firestore
 */
async function updateStudentProfile(uid, fields) {
  // Prevent altering locked fields (id, email, status, course) via database rules
  const sanitisedFields = {
    fullname: fields.fullname,
    phone: fields.phone,
    gender: fields.gender,
    dob: fields.dob,
    state: fields.state,
    address: fields.address,
    bio: fields.bio || ""
  };
  
  await db.collection("students").doc(uid).update(sanitisedFields);
  return getStudentProfile(uid);
}

/**
 * Retrieve notifications applicable to this student (their studentId or 'all')
 */
async function getStudentNotifications(studentId) {
  const snapshot = await db.collection("notifications").get();
  const list = [];
  snapshot.forEach(doc => {
    const data = doc.data();
    const id = doc.id;
    if (data.studentId === "all" || data.studentId === studentId) {
      list.push({ id, ...data });
    }
  });
  // Sort descending by date
  return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

/**
 * Mark a notification as read
 */
async function markNotificationAsRead(notifId) {
  await db.collection("notifications").doc(notifId).update({ status: "read", read: true });
}

/**
 * Retrieve materials uploaded by the admin for a specific course
 */
async function getCourseMaterials(courseName) {
  const snapshot = await db.collection("materials").get();
  const list = [];
  
  // Search for the course title id mapping
  const coursesSnapshot = await db.collection("courses").get();
  let matchedCourseId = "";
  
  coursesSnapshot.forEach(doc => {
    const c = doc.data();
    if (c.title === courseName || c.id === courseName) {
      matchedCourseId = doc.id;
    }
  });

  snapshot.forEach(doc => {
    const data = doc.data();
    if (data.courseId === matchedCourseId || data.courseId === courseName) {
      list.push({ id: doc.id, ...data });
    }
  });

  return list;
}

/**
 * Upload an Assignment PDF/Image File to Firebase Storage as student files
 */
async function uploadAssignmentFile(uid, studentId, fileObj) {
  if (!fileObj) throw new Error("Please select a file to submit.");
  
  // Create a storage key path
  const storagePath = `student_files/${uid}/${Date.now()}_${fileObj.name}`;
  
  // Put file in Storage
  const uploadTask = await storage.ref().child(storagePath).put(fileObj);
  const downloadUrl = await uploadTask.ref.getDownloadURL();
  
  // Update student collection registry linking the file
  await db.collection("students").doc(uid).update({
    lastDocumentSubmitted: downloadUrl
  });

  // Notify admin
  await db.collection("notifications").add({
    studentId: "admin",
    title: `Assignment uploaded: ${studentId}`,
    message: `Student ID ${studentId} uploaded assignment material "${fileObj.name}". Link: ${downloadUrl}`,
    status: "unread",
    createdAt: new Date().toISOString()
  });

  return downloadUrl;
}
