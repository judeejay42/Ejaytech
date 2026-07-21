import nodemailer from 'nodemailer';

export interface EmailPayload {
  type: 'registration_confirmation' | 'admin_notification' | 'approval' | 'rejection' | 'payment_submission' | 'payment_verified' | 'instructor_assignment' | string;
  to: string;
  data: Record<string, any>;
}

export interface EmailLogRecord {
  id: string;
  type: string;
  to: string;
  subject: string;
  status: 'delivered' | 'failed';
  attempts: number;
  error?: string | null;
  data: Record<string, any>;
  sentAt: string;
}

// Backend in-memory email log cache
const emailLogs: EmailLogRecord[] = [];

function getTransporter() {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.GMAIL_USER || process.env.SMTP_USER;
  const pass = process.env.GMAIL_PASS || process.env.SMTP_PASS;

  if (user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
      tls: { rejectUnauthorized: false }
    });
  }

  // Fallback jsonTransport when no SMTP secrets configured
  return nodemailer.createTransport({
    jsonTransport: true
  });
}

export function generateEmailContent(type: string, data: Record<string, any>) {
  const studentName = data.studentName || data.fullName || 'Student';
  const studentId = data.studentId || data.registrationNumber || 'N/A';
  const centre = data.centre || data.selectedCentre || 'EJaytech Centre';
  const course = data.course || data.programme || 'Enrolled Program';
  const email = data.email || data.studentEmail || '';
  const date = data.registrationDate || data.dateRegistered || new Date().toLocaleDateString();
  const appUrl = process.env.APP_URL || 'https://ejaytechconcepts.com';

  switch (type) {
    case 'registration_confirmation': {
      const subject = 'Welcome to EJaytech Concepts – Registration Successful';
      const text = `Dear ${studentName},

Congratulations! Your registration at EJaytech Concepts has been received successfully.

Your details are now awaiting review by the Centre Administration.

Registration Details:
• Full Name: ${studentName}
• Registration Number: ${studentId}
• Centre: ${centre}
• Programme: ${course}
• Email: ${email}
• Date Registered: ${date}

Current Status:
🟡 Pending Review

You will receive another email when:
• Your registration has been approved or rejected.
• Your payment has been verified.
• Your student portal has been activated.
• Your assigned instructor and course schedule are available.

Thank you for choosing EJaytech Concepts.

Best regards,
EJaytech Concepts
Innovate • Create • Elevate`;

      const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <div style="background-color: #0f172a; padding: 20px; text-align: center; border-radius: 6px 6px 0 0;">
          <h2 style="color: #38bdf8; margin: 0; font-size: 20px;">EJaytech Concepts</h2>
          <p style="color: #94a3b8; margin: 5px 0 0 0; font-size: 13px;">Innovate • Create • Elevate</p>
        </div>
        <div style="padding: 24px 16px;">
          <p>Dear <strong>${studentName}</strong>,</p>
          <p>Congratulations! Your registration at <strong>EJaytech Concepts</strong> has been received successfully.</p>
          <p>Your details are now awaiting review by the Centre Administration.</p>
          
          <div style="background-color: #f8fafc; padding: 16px; border-left: 4px solid #38bdf8; margin: 20px 0; border-radius: 4px;">
            <h4 style="margin-top: 0; color: #0f172a;">Registration Details:</h4>
            <ul style="list-style: none; padding-left: 0; margin: 0;">
              <li style="margin-bottom: 6px;">• <strong>Full Name:</strong> ${studentName}</li>
              <li style="margin-bottom: 6px;">• <strong>Registration Number:</strong> ${studentId}</li>
              <li style="margin-bottom: 6px;">• <strong>Centre:</strong> ${centre}</li>
              <li style="margin-bottom: 6px;">• <strong>Programme:</strong> ${course}</li>
              <li style="margin-bottom: 6px;">• <strong>Email:</strong> ${email}</li>
              <li style="margin-bottom: 6px;">• <strong>Date Registered:</strong> ${date}</li>
            </ul>
          </div>

          <p><strong>Current Status:</strong> <span style="background-color: #fef08a; color: #854d0e; padding: 4px 8px; border-radius: 4px; font-weight: bold;">🟡 Pending Review</span></p>

          <p>You will receive another email when:</p>
          <ul>
            <li>Your registration has been approved or rejected.</li>
            <li>Your payment has been verified.</li>
            <li>Your student portal has been activated.</li>
            <li>Your assigned instructor and course schedule are available.</li>
          </ul>

          <p>Thank you for choosing EJaytech Concepts.</p>
          <br>
          <p>Best regards,<br><strong>EJaytech Concepts</strong><br><em>Innovate • Create • Elevate</em></p>
        </div>
      </div>`;
      return { subject, text, html };
    }

    case 'admin_notification': {
      const subject = 'New Student Registration';
      const reviewLink = data.reviewLink || `${appUrl}/admin-dashboard.html`;
      const text = `New Student Registration Alert

Student Name: ${studentName}
Centre: ${centre}
Programme: ${course}
Registration Number: ${studentId}
Registration Date: ${date}

Link to review application: ${reviewLink}`;

      const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <div style="background-color: #0f172a; padding: 16px; text-align: center; border-radius: 6px 6px 0 0;">
          <h3 style="color: #38bdf8; margin: 0;">New Student Registration Alert</h3>
        </div>
        <div style="padding: 20px;">
          <p>A new student registration has been submitted and is pending administrative review.</p>
          <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
            <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;"><strong>Student Name:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${studentName}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;"><strong>Centre:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${centre}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;"><strong>Programme:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${course}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;"><strong>Registration Number:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${studentId}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;"><strong>Registration Date:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${date}</td></tr>
          </table>
          <div style="text-align: center; margin-top: 24px;">
            <a href="${reviewLink}" style="background-color: #0284c7; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Review Application</a>
          </div>
        </div>
      </div>`;
      return { subject, text, html };
    }

    case 'approval': {
      const subject = 'Registration Approved';
      const portalLink = `${appUrl}/student.html`;
      const text = `Congratulations ${studentName},

Your registration has been approved.

Your Student Portal is now active.

You can now:
• Sign in
• View your courses
• View your instructor
• Upload assignments
• Make payments (if applicable)
• Access learning materials

Thank you for choosing EJaytech Concepts.

Best regards,
EJaytech Concepts
Innovate • Create • Elevate`;

      const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <div style="background-color: #059669; padding: 20px; text-align: center; border-radius: 6px 6px 0 0;">
          <h2 style="color: white; margin: 0;">Registration Approved!</h2>
        </div>
        <div style="padding: 24px 16px;">
          <p>Congratulations <strong>${studentName}</strong>,</p>
          <p>Your registration for <strong>${course}</strong> at <strong>${centre}</strong> has been approved.</p>
          <p style="font-size: 16px; color: #059669; font-weight: bold;">Your Student Portal is now active.</p>
          <p>You can now:</p>
          <ul>
            <li>Sign in</li>
            <li>View your courses</li>
            <li>View your instructor</li>
            <li>Upload assignments</li>
            <li>Make payments (if applicable)</li>
            <li>Access learning materials</li>
          </ul>
          <div style="text-align: center; margin: 24px 0;">
            <a href="${portalLink}" style="background-color: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Access Student Portal</a>
          </div>
          <p>Thank you for choosing EJaytech Concepts.</p>
          <br>
          <p>Best regards,<br><strong>EJaytech Concepts</strong><br><em>Innovate • Create • Elevate</em></p>
        </div>
      </div>`;
      return { subject, text, html };
    }

    case 'rejection': {
      const subject = 'Registration Update';
      const reason = data.reason || 'Document or application details require correction.';
      const instructions = data.instructions || 'Please sign in to your portal or contact your centre administrator to review and update your information.';
      const resubmitLink = data.resubmitLink || `${appUrl}/student.html`;

      const text = `Dear ${studentName},

Your registration application status has been updated.

Reason for rejection: ${reason}

Instructions for correcting the application: ${instructions}

Resubmit link: ${resubmitLink}

Best regards,
EJaytech Concepts`;

      const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <div style="background-color: #dc2626; padding: 16px; text-align: center; border-radius: 6px 6px 0 0;">
          <h3 style="color: white; margin: 0;">Registration Status Update</h3>
        </div>
        <div style="padding: 20px;">
          <p>Dear <strong>${studentName}</strong>,</p>
          <p>Your registration status for <strong>${course}</strong> at <strong>${centre}</strong> has been updated.</p>
          <div style="background-color: #fef2f2; padding: 16px; border-left: 4px solid #dc2626; margin: 16px 0; border-radius: 4px;">
            <p style="margin: 0 0 8px 0;"><strong>Reason for rejection:</strong> ${reason}</p>
            <p style="margin: 0;"><strong>Instructions for correcting application:</strong> ${instructions}</p>
          </div>
          <p>Resubmit link: <a href="${resubmitLink}" style="color: #2563eb;">${resubmitLink}</a></p>
          <br>
          <p>Best regards,<br><strong>EJaytech Concepts</strong></p>
        </div>
      </div>`;
      return { subject, text, html };
    }

    case 'payment_submission': {
      const subject = 'Payment Submission Received';
      const amount = data.amount || '0';
      const ref = data.referenceNumber || data.ref || 'N/A';
      const text = `Dear ${studentName},

Your payment submission of ₦${amount} (Reference: ${ref}) for ${course} has been received successfully.

Your payment is currently awaiting verification by our Academic Finance Desk. You will receive a notification once verification is complete.

Best regards,
EJaytech Concepts`;

      const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <div style="background-color: #0f172a; padding: 16px; text-align: center; border-radius: 6px 6px 0 0;">
          <h3 style="color: #38bdf8; margin: 0;">Payment Submission Received</h3>
        </div>
        <div style="padding: 20px;">
          <p>Dear <strong>${studentName}</strong>,</p>
          <p>Your payment submission of <strong>₦${amount}</strong> (Reference: <code>${ref}</code>) for <strong>${course}</strong> has been received successfully.</p>
          <p>Your payment is currently awaiting verification by our Academic Finance Desk. You will receive an email once verification is complete.</p>
          <br>
          <p>Best regards,<br><strong>EJaytech Concepts</strong></p>
        </div>
      </div>`;
      return { subject, text, html };
    }

    case 'payment_verified': {
      const subject = 'Payment Verified Successfully';
      const amount = data.amount || '0';
      const ref = data.referenceNumber || data.ref || 'N/A';
      const text = `Dear ${studentName},

Great news! Your payment of ₦${amount} (Reference: ${ref}) for ${course} has been verified successfully.

Your financial record in your Student Portal has been updated.

Best regards,
EJaytech Concepts`;

      const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <div style="background-color: #059669; padding: 16px; text-align: center; border-radius: 6px 6px 0 0;">
          <h3 style="color: white; margin: 0;">Payment Verified Successfully</h3>
        </div>
        <div style="padding: 20px;">
          <p>Dear <strong>${studentName}</strong>,</p>
          <p>Great news! Your payment of <strong>₦${amount}</strong> (Reference: <code>${ref}</code>) for <strong>${course}</strong> has been verified successfully.</p>
          <p>Your financial status inside your Student Portal is now fully updated and verified.</p>
          <br>
          <p>Best regards,<br><strong>EJaytech Concepts</strong></p>
        </div>
      </div>`;
      return { subject, text, html };
    }

    case 'instructor_assignment': {
      const subject = 'Instructor Assigned';
      const instructorName = data.instructorName || 'Engr. Kayode';
      const instructorEmail = data.instructorEmail || data.contactEmail || 'instructor@ejaytech.com';
      const startDate = data.startDate || 'Upcoming Session';
      const portalLink = data.portalLink || `${appUrl}/student-dashboard.html`;

      const text = `Dear ${studentName},

An instructor has been assigned to your course.

Assignment Details:
• Instructor Name: ${instructorName}
• Programme: ${course}
• Centre: ${centre}
• Contact Email: ${instructorEmail}
• Start Date: ${startDate}

Student Portal link: ${portalLink}

Best regards,
EJaytech Concepts`;

      const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <div style="background-color: #0f172a; padding: 16px; text-align: center; border-radius: 6px 6px 0 0;">
          <h3 style="color: #38bdf8; margin: 0;">Instructor Assigned</h3>
        </div>
        <div style="padding: 20px;">
          <p>Dear <strong>${studentName}</strong>,</p>
          <p>An instructor has been assigned to guide your learning program.</p>
          <div style="background-color: #f8fafc; padding: 16px; border-left: 4px solid #38bdf8; margin: 16px 0; border-radius: 4px;">
            <ul style="list-style: none; padding-left: 0; margin: 0;">
              <li style="margin-bottom: 6px;">• <strong>Instructor Name:</strong> ${instructorName}</li>
              <li style="margin-bottom: 6px;">• <strong>Programme:</strong> ${course}</li>
              <li style="margin-bottom: 6px;">• <strong>Centre:</strong> ${centre}</li>
              <li style="margin-bottom: 6px;">• <strong>Contact Email:</strong> ${instructorEmail}</li>
              <li style="margin-bottom: 6px;">• <strong>Start Date:</strong> ${startDate}</li>
            </ul>
          </div>
          <div style="text-align: center; margin: 20px 0;">
            <a href="${portalLink}" style="background-color: #0284c7; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Student Portal Link</a>
          </div>
          <p>Best regards,<br><strong>EJaytech Concepts</strong></p>
        </div>
      </div>`;
      return { subject, text, html };
    }

    default: {
      const subject = data.subject || 'EJaytech Concepts Notification';
      const text = data.message || 'You have a new update from EJaytech Concepts.';
      const html = `<div style="font-family: sans-serif; padding: 20px;"><p>${text}</p></div>`;
      return { subject, text, html };
    }
  }
}

export async function sendEmail({ type, to, data }: EmailPayload) {
  const { subject, text, html } = generateEmailContent(type, data);
  const transporter = getTransporter();

  const senderEmail = process.env.GMAIL_USER || process.env.SMTP_USER || 'ejaytechconcepts@gmail.com';
  const mailOptions = {
    from: `"EJaytech Concepts" <${senderEmail}>`,
    to,
    subject,
    text,
    html
  };

  let delivered = false;
  let attempts = 0;
  let lastError: string | null = null;
  const maxRetries = 2;

  for (let i = 1; i <= maxRetries + 1; i++) {
    attempts = i;
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log(`[Email System] Sent "${type}" to ${to} on attempt ${i}:`, info.messageId || 'Success');
      delivered = true;
      lastError = null;
      break;
    } catch (err: any) {
      lastError = err.message || 'Delivery error';
      console.error(`[Email System] Attempt ${i} failed for ${to}:`, lastError);
      if (i <= maxRetries) {
        await new Promise(res => setTimeout(res, 1000));
      }
    }
  }

  const logRecord: EmailLogRecord = {
    id: 'email-log-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
    type,
    to,
    subject,
    status: delivered ? 'delivered' : 'failed',
    attempts,
    error: lastError,
    data,
    sentAt: new Date().toISOString()
  };

  emailLogs.unshift(logRecord);
  if (emailLogs.length > 500) emailLogs.pop();

  return {
    success: true,
    delivered,
    subject,
    logRecord,
    error: lastError
  };
}

export function getEmailLogs() {
  return emailLogs;
}
