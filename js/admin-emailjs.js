/**
 * EJaytech Concepts - EmailJS Configuration & Dispatch Engine
 * Module strictly restricted to Super Admin Operations.
 * Manages EmailJS keys, notification templates, automatic dispatches,
 * delivery activity logs, and JSON backup/restore.
 */

import { db } from "./firebase-config.js";

// --- DEFAULT CONFIGURATION & TEMPLATES ---
export const DEFAULT_EMAILJS_CONFIG = {
  publicKey: "",
  serviceId: "",
  templateId: "",
  senderName: "EJaytech Concepts Directorate",
  replyTo: "ejaytechconcepts@gmail.com",
  notificationEmail: "ejaytechadmin@gmail.com"
};

export const DEFAULT_EMAILJS_TEMPLATES = {
  student_registration: {
    name: "Student Registration Confirmation",
    subject: "Registration Received - {{student_name}} ({{registration_number}})",
    body: `Dear {{student_name}},

Thank you for registering at EJaytech Concepts ({{centre}} Centre).
Your registration for {{programme}} (Course: {{course}}) has been successfully received.

Registration Details:
• Registration Number: {{registration_number}}
• Applied Course: {{course}}
• Training Centre: {{centre}}
• Access Portal: {{portal_link}}

Your dossier is currently under review by our admissions department. You will receive an email update once your admission is verified.

Best regards,
EJaytech Concepts Admissions Team`
  },
  admission_approved: {
    name: "Admission Approved",
    subject: "Congratulations! Admission Approved - {{student_name}}",
    body: `Dear {{student_name}},

We are pleased to inform you that your admission for {{course}} at EJaytech Concepts ({{centre}} Centre) has been APPROVED!

Admission Summary:
• Student ID / Reg No: {{registration_number}}
• Course: {{course}}
• Centre: {{centre}}
• Approval Status: {{approval_status}}
• Portal Link: {{portal_link}}

Please log into your student portal to complete tuition payment and finalize your course enrollment.

Warm congratulations,
EJaytech Concepts Academic Directorate`
  },
  admission_rejected: {
    name: "Admission Rejected",
    subject: "Update regarding your Admission Application - {{registration_number}}",
    body: `Dear {{student_name}},

Thank you for your interest in EJaytech Concepts.
After careful review of your application for {{course}} at our {{centre}} Centre, we regret to inform you that your application could not be approved at this time.

Details:
• Application ID: {{registration_number}}
• Applied Course: {{course}}
• Approval Status: {{approval_status}}

If you have questions or wish to submit updated documentation, please contact our support team at ejaytechconcepts@gmail.com.

Sincerely,
EJaytech Concepts Admissions Office`
  },
  payment_confirmation: {
    name: "Payment Confirmation",
    subject: "Payment Receipt Confirmed - ₦{{amount}} ({{registration_number}})",
    body: `Dear {{student_name}},

Your payment for {{course}} has been verified and confirmed!

Receipt Breakdown:
• Student ID: {{registration_number}}
• Course: {{course}}
• Amount Confirmed: ₦{{amount}}
• Payment Status: {{payment_status}}
• Student Portal: {{portal_link}}

Thank you for your prompt payment. Your course schedule and learning materials are now fully accessible in your student portal.

Best regards,
EJaytech Concepts Finance Desk`
  },
  password_reset: {
    name: "Password Reset",
    subject: "Password Reset Notification - EJaytech Concepts",
    body: `Dear {{student_name}},

A password reset was processed for your account ({{email}}).

Account Details:
• Student ID / Username: {{registration_number}}
• Associated Email: {{email}}
• Access Portal: {{portal_link}}

If you did not request this password reset, please contact Super Admin immediately at ejaytechadmin@gmail.com.

Regards,
EJaytech Concepts IT Security Team`
  },
  instructor_assignment: {
    name: "Instructor Assignment",
    subject: "Instructor Assigned for {{course}} - EJaytech Concepts",
    body: `Dear {{student_name}},

An instructor has been assigned to your enrolled course {{course}} at {{centre}} Centre.

Assignment Details:
• Course: {{course}}
• Centre: {{centre}}
• Student ID: {{registration_number}}
• Portal Link: {{portal_link}}

Log in to your portal to view instructor details, class schedules, and announcements.

Best regards,
EJaytech Concepts Academic Board`
  },
  course_registration: {
    name: "Course Registration Confirmation",
    subject: "Course Registration Confirmed - {{course}}",
    body: `Dear {{student_name}},

Your course registration for {{course}} ({{programme}}) has been finalized!

Registration Details:
• Student ID: {{registration_number}}
• Enrolled Course: {{course}}
• Campus / Centre: {{centre}}
• Portal Link: {{portal_link}}

We wish you a rewarding learning experience with EJaytech Concepts!

Sincerely,
EJaytech Concepts Registry`
  },
  general_announcement: {
    name: "General Announcement",
    subject: "Important Announcement - EJaytech Concepts",
    body: `Dear {{student_name}},

Please be informed of an important update from EJaytech Concepts ({{centre}} Centre).

Announcement Details:
• Recipient: {{student_name}} ({{email}})
• Portal Link: {{portal_link}}

Thank you for your attention.

Best regards,
EJaytech Concepts Administration`
  }
};

// --- GETTERS & SETTERS FOR CONFIG ---
export function getEmailJSConfig() {
  try {
    const saved = localStorage.getItem("emailjs_settings_config");
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...DEFAULT_EMAILJS_CONFIG, ...parsed };
    }
  } catch (err) {
    console.error("Error reading EmailJS config:", err);
  }
  return { ...DEFAULT_EMAILJS_CONFIG };
}

export async function saveEmailJSConfig(config) {
  try {
    const merged = { ...getEmailJSConfig(), ...config };
    localStorage.setItem("emailjs_settings_config", JSON.stringify(merged));

    // Sync to Firestore if db is active
    if (window.db && typeof window.db.collection === "function") {
      try {
        await window.db.collection("settings").doc("emailjs_config").set(merged, { merge: true });
      } catch (fErr) {
        console.warn("Firestore config sync warning:", fErr);
      }
    }
    return merged;
  } catch (err) {
    console.error("Error saving EmailJS config:", err);
    throw err;
  }
}

// --- GETTERS & SETTERS FOR TEMPLATES ---
export function getEmailJSTemplates() {
  try {
    const saved = localStorage.getItem("emailjs_settings_templates");
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...DEFAULT_EMAILJS_TEMPLATES, ...parsed };
    }
  } catch (err) {
    console.error("Error reading EmailJS templates:", err);
  }
  return { ...DEFAULT_EMAILJS_TEMPLATES };
}

export async function saveEmailJSTemplate(templateKey, templateData) {
  try {
    const current = getEmailJSTemplates();
    current[templateKey] = { ...current[templateKey], ...templateData };
    localStorage.setItem("emailjs_settings_templates", JSON.stringify(current));

    if (window.db && typeof window.db.collection === "function") {
      try {
        await window.db.collection("settings").doc("emailjs_templates").set(current, { merge: true });
      } catch (fErr) {
        console.warn("Firestore template sync warning:", fErr);
      }
    }
    return current;
  } catch (err) {
    console.error("Error saving EmailJS template:", err);
    throw err;
  }
}

// --- CHECK IS CONNECTED / FULLY CONFIGURED ---
export function isEmailJSConnected() {
  const config = getEmailJSConfig();
  return Boolean(
    config.publicKey && config.publicKey.trim() !== "" &&
    config.serviceId && config.serviceId.trim() !== "" &&
    config.templateId && config.templateId.trim() !== "" &&
    config.senderName && config.senderName.trim() !== "" &&
    config.replyTo && config.replyTo.trim() !== "" &&
    config.notificationEmail && config.notificationEmail.trim() !== ""
  );
}

// --- PLACEHOLDER REPLACER HELPER ---
export function replacePlaceholders(templateStr, data = {}) {
  if (!templateStr) return "";
  const portalLink = data.portal_link || window.location.origin;

  return templateStr
    .replace(/\{\{student_name\}\}/g, data.student_name || data.fullname || data.fullName || "Valued Student")
    .replace(/\{\{email\}\}/g, data.email || data.to_email || "N/A")
    .replace(/\{\{centre\}\}/g, data.centre || data.centreId || "Central Campus")
    .replace(/\{\{programme\}\}/g, data.programme || data.course || "Professional Diploma")
    .replace(/\{\{course\}\}/g, data.course || "Specialized Program")
    .replace(/\{\{registration_number\}\}/g, data.registration_number || data.studentId || "EJ-2026-PENDING")
    .replace(/\{\{amount\}\}/g, data.amount ? Number(data.amount).toLocaleString() : "0")
    .replace(/\{\{payment_status\}\}/g, data.payment_status || "Verified")
    .replace(/\{\{approval_status\}\}/g, data.approval_status || "Approved")
    .replace(/\{\{portal_link\}\}/g, portalLink);
}

// --- EMAIL ACTIVITY LOG RECORDER ---
export async function recordEmailActivityLog(logEntry) {
  try {
    const logsStr = localStorage.getItem("mock_emailjs_activity_logs") || "[]";
    const logs = JSON.parse(logsStr);

    const now = new Date();
    const fullEntry = {
      id: "email-log-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
      date: now.toISOString().split("T")[0],
      time: now.toTimeString().split(" ")[0],
      recipient: logEntry.recipient || "Unknown",
      emailType: logEntry.emailType || "General Notification",
      status: logEntry.status || "Successful", // "Successful" or "Failed"
      errorMessage: logEntry.errorMessage || "-",
      createdAt: now.toISOString()
    };

    logs.unshift(fullEntry);
    // Keep max 300 logs
    if (logs.length > 300) logs.pop();

    localStorage.setItem("mock_emailjs_activity_logs", JSON.stringify(logs));

    // Also write to Firestore 'emailLogs' collection
    if (window.db && typeof window.db.collection === "function") {
      try {
        await window.db.collection("emailLogs").add({
          type: fullEntry.emailType,
          to: fullEntry.recipient,
          status: fullEntry.status === "Successful" ? "delivered" : "failed",
          error: fullEntry.errorMessage === "-" ? null : fullEntry.errorMessage,
          sentAt: fullEntry.createdAt,
          date: fullEntry.date,
          time: fullEntry.time
        });
      } catch (fErr) {
        console.warn("Firestore email log write warning:", fErr);
      }
    }
    return fullEntry;
  } catch (err) {
    console.error("Error recording email activity log:", err);
  }
}

export function getEmailActivityLogs(filterOption = "all") {
  let logs = [];
  try {
    const logsStr = localStorage.getItem("mock_emailjs_activity_logs") || "[]";
    logs = JSON.parse(logsStr);
  } catch (e) {
    console.warn("Error parsing activity logs:", e);
  }

  const today = new Date().toISOString().split("T")[0];
  const now = Date.now();
  const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;
  const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

  return logs.filter(item => {
    const itemTime = new Date(item.createdAt || item.date).getTime();
    if (filterOption === "today") {
      return item.date === today;
    } else if (filterOption === "last_7") {
      return (now - itemTime) <= SEVEN_DAYS;
    } else if (filterOption === "last_30") {
      return (now - itemTime) <= THIRTY_DAYS;
    } else if (filterOption === "failed") {
      return item.status === "Failed";
    } else if (filterOption === "successful") {
      return item.status === "Successful";
    }
    return true; // "all"
  });
}

// --- CORE DISPATCH FUNCTION USING EMAILJS REST API ---
export async function sendEmailViaEmailJS(typeKeyOrName, toEmail, data = {}) {
  const config = getEmailJSConfig();
  const templates = getEmailJSTemplates();

  // Find template by key or matching name
  let templateObj = templates[typeKeyOrName];
  if (!templateObj) {
    const foundKey = Object.keys(templates).find(
      k => k === typeKeyOrName || templates[k].name.toLowerCase() === typeKeyOrName.toLowerCase()
    );
    if (foundKey) templateObj = templates[foundKey];
  }

  const emailTypeName = templateObj ? templateObj.name : typeKeyOrName;

  // Validate configuration presence
  if (!isEmailJSConnected()) {
    const errorMsg = "EmailJS credentials not fully configured in Super Admin Portal.";
    await recordEmailActivityLog({
      recipient: toEmail || config.notificationEmail,
      emailType: emailTypeName,
      status: "Failed",
      errorMessage: errorMsg
    });
    return {
      success: false,
      delivered: false,
      error: errorMsg
    };
  }

  // Build subject and body content
  const rawSubject = templateObj ? templateObj.subject : `Notification: ${emailTypeName}`;
  const rawBody = templateObj ? templateObj.body : `Details: ${JSON.stringify(data)}`;

  const finalSubject = replacePlaceholders(rawSubject, data);
  const finalBody = replacePlaceholders(rawBody, data);

  const payload = {
    service_id: config.serviceId,
    template_id: config.templateId,
    user_id: config.publicKey,
    template_params: {
      to_email: toEmail || config.notificationEmail,
      recipient_email: toEmail || config.notificationEmail,
      reply_to: config.replyTo,
      sender_name: config.senderName,
      subject: finalSubject,
      message: finalBody,
      student_name: data.student_name || data.fullname || data.fullName || "Student",
      email: toEmail || data.email || "",
      centre: data.centre || data.centreId || "Central Campus",
      programme: data.programme || data.course || "",
      course: data.course || "",
      registration_number: data.registration_number || data.studentId || "",
      amount: data.amount ? String(data.amount) : "0",
      payment_status: data.payment_status || "Verified",
      approval_status: data.approval_status || "Approved",
      portal_link: data.portal_link || window.location.origin
    }
  };

  try {
    const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      const respText = await response.text();
      await recordEmailActivityLog({
        recipient: toEmail || config.notificationEmail,
        emailType: emailTypeName,
        status: "Successful",
        errorMessage: "-"
      });
      return {
        success: true,
        delivered: true,
        statusText: respText || "OK"
      };
    } else {
      const errText = await response.text();
      const cleanError = errText || `EmailJS HTTP Error ${response.status}`;
      await recordEmailActivityLog({
        recipient: toEmail || config.notificationEmail,
        emailType: emailTypeName,
        status: "Failed",
        errorMessage: cleanError
      });
      return {
        success: false,
        delivered: false,
        error: cleanError
      };
    }
  } catch (err) {
    const networkErr = err.message || "Network error communicating with EmailJS API";
    await recordEmailActivityLog({
      recipient: toEmail || config.notificationEmail,
      emailType: emailTypeName,
      status: "Failed",
      errorMessage: networkErr
    });
    return {
      success: false,
      delivered: false,
      error: networkErr
    };
  }
}

// --- TEST EMAIL TRIGGER ---
export async function sendTestEmailJS() {
  const config = getEmailJSConfig();
  if (!isEmailJSConnected()) {
    throw new Error("Cannot send test email: Required EmailJS keys are missing or blank. Please complete all fields first.");
  }

  const testData = {
    student_name: "Super Admin Test User",
    email: config.notificationEmail,
    centre: "EJaytech Concepts HQ",
    programme: "Full-Stack Software Engineering",
    course: "Software Engineering",
    registration_number: "EJ-2026-TEST",
    amount: "150000",
    payment_status: "Verified",
    approval_status: "Approved",
    portal_link: window.location.origin
  };

  return await sendEmailViaEmailJS("General Announcement", config.notificationEmail, testData);
}

// --- BACKUP & RESTORE (IMPORT / EXPORT) ---
export function exportEmailSettingsJSON() {
  const config = getEmailJSConfig();
  const templates = getEmailJSTemplates();
  const backup = {
    exportedAt: new Date().toISOString(),
    system: "EJaytech Concepts Super Admin Portal",
    module: "EmailJS Configuration Backup",
    config: config,
    templates: templates
  };

  const jsonStr = JSON.stringify(backup, null, 2);
  const blob = new Blob([jsonStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `emailjs-settings-backup-${new Date().toISOString().split("T")[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function importEmailSettingsJSON(jsonContent) {
  try {
    const data = typeof jsonContent === "string" ? JSON.parse(jsonContent) : jsonContent;
    if (!data.config && !data.templates) {
      throw new Error("Invalid backup format. File must contain 'config' or 'templates' properties.");
    }

    if (data.config) {
      await saveEmailJSConfig(data.config);
    }
    if (data.templates) {
      localStorage.setItem("emailjs_settings_templates", JSON.stringify(data.templates));
      if (window.db && typeof window.db.collection === "function") {
        await window.db.collection("settings").doc("emailjs_templates").set(data.templates, { merge: true });
      }
    }
    return true;
  } catch (err) {
    console.error("Error importing EmailJS settings:", err);
    throw err;
  }
}

// Expose on window object
window.getEmailJSConfig = getEmailJSConfig;
window.saveEmailJSConfig = saveEmailJSConfig;
window.getEmailJSTemplates = getEmailJSTemplates;
window.saveEmailJSTemplate = saveEmailJSTemplate;
window.isEmailJSConnected = isEmailJSConnected;
window.sendEmailViaEmailJS = sendEmailViaEmailJS;
window.sendTestEmailJS = sendTestEmailJS;
window.getEmailActivityLogs = getEmailActivityLogs;
window.exportEmailSettingsJSON = exportEmailSettingsJSON;
window.importEmailSettingsJSON = importEmailSettingsJSON;
