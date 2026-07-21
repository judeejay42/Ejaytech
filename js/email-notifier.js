/**
 * EJaytech Concepts - Email Notification Client Module
 * Communicates with backend /api/send-email service
 * Logs all sent/attempted emails into Firestore 'emailLogs' collection
 */

export async function sendEmailNotification(type, to, data = {}) {
  let result = { success: false, delivered: false, error: "Network error" };

  try {
    const response = await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, to, data })
    });

    if (response.ok) {
      result = await response.json();
    } else {
      const errText = await response.text();
      result = { success: false, delivered: false, error: errText || "HTTP " + response.status };
    }
  } catch (err) {
    console.error("sendEmailNotification fetch error:", err);
    result = { success: false, delivered: false, error: err.message || "Network request failed" };
  }

  // Always log in Firestore 'emailLogs' collection
  const logData = {
    type: type,
    to: to,
    subject: result.subject || type,
    status: result.delivered ? "delivered" : "failed",
    error: result.error || null,
    data: data || {},
    sentAt: new Date().toISOString()
  };

  try {
    if (window.db && typeof window.db.collection === "function") {
      await window.db.collection("emailLogs").add(logData);
    }
  } catch (dbErr) {
    console.warn("Could not log to Firestore emailLogs collection:", dbErr);
  }

  return result;
}

// Expose globally on window
window.sendEmailNotification = sendEmailNotification;
