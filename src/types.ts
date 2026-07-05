/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ApplicationStatus = 'Pending' | 'Approved' | 'Rejected';

export interface Student {
  id: string; // db id
  studentId: string; // EJ-YYYY-XXXX (Format)
  fullname: string;
  email: string;
  phone: string;
  gender: 'Male' | 'Female' | 'Other';
  dob: string;
  state: string;
  address: string;
  course: string; // Course name or ID
  status: ApplicationStatus;
  createdAt: string;
  bio?: string;
  avatarUrl?: string;
}

export interface Admin {
  id: string;
  username: string;
  email: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  fee: string;
  syllabus: string[];
}

export interface Notification {
  id: string;
  studentId: string; // 'all' or specific student ID
  title: string;
  message: string;
  status: 'read' | 'unread';
  createdAt: string;
}

export interface LearningMaterial {
  id: string;
  courseId: string;
  title: string;
  filePath: string;
  fileSize?: string;
  uploadedAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
  imageUrl: string;
}

export interface EmailLog {
  id: string;
  recipientEmail: string;
  subject: string;
  message: string;
  sentAt: string;
  status: 'Sent' | 'Failed';
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribedAt: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ContactInquiry {
  id: string;
  fullname: string;
  email: string;
  subject: string;
  message: string;
  submittedAt: string;
}
