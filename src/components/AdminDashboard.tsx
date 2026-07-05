/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Student, Course, Notification, LearningMaterial, EmailLog, NewsletterSubscriber, ContactInquiry } from '../types';
import { 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle, 
  BookOpen, 
  Trash2, 
  Edit3, 
  Send, 
  Mail, 
  FileText, 
  MessageSquare, 
  Search, 
  Filter, 
  Plus, 
  PlusCircle, 
  Settings,
  LogOut,
  Copy,
  Check,
  Download,
  FolderOpen
} from 'lucide-react';

interface AdminDashboardProps {
  onLogout: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [tab, setTab] = useState<'applications' | 'materials' | 'notifications' | 'courses' | 'logs' | 'cpanel'>('applications');
  
  // Dynamic collections from backend
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);

  // Search & Filters state
  const [query, setQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [filterCourse, setFilterCourse] = useState<string>('All');

  // New Course formulation state
  const [newCourse, setNewCourse] = useState({ title: '', description: '', duration: '', fee: '', syllabus: '' });
  // Dynamic material Formulation state
  const [newMat, setNewMat] = useState({ title: '', courseId: '', filePath: '', fileSize: '1.2 MB' });
  // Broadcast Announcement state
  const [newBroadcast, setNewBroadcast] = useState({ title: '', message: '', studentId: 'all' });

  // Edit Student Modal state
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Dynamic cPanel file explorer hooks
  const [selectedFile, setSelectedFile] = useState<string>('config/config.php');
  const [fileContents, setFileContents] = useState<string>('');
  const [isLoadingFile, setIsLoadingFile] = useState<boolean>(false);
  const [copySuccess, setCopySuccess] = useState<string>('');

  useEffect(() => {
    if (tab === 'cpanel' && selectedFile) {
      setIsLoadingFile(true);
      setCopySuccess('');
      fetch(`/api/admin/cpanel-files?file=${encodeURIComponent(selectedFile)}`)
        .then(res => {
          if (!res.ok) throw new Error('File not found at specified path');
          return res.json();
        })
        .then(data => {
          setFileContents(data.contents);
        })
        .catch(err => {
          setFileContents(`Error reading cPanel template file: ${err.message}`);
        })
        .finally(() => {
          setIsLoadingFile(false);
        });
    }
  }, [tab, selectedFile]);

  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  // Combined continuous reloading triggered by events
  const loadAdminMetrics = async () => {
    try {
      // 1. Fetch Students
      const studRes = await fetch('/api/admin/students');
      const studData = await studRes.json();
      if (studData.students) setStudents(studData.students);

      // 2. Fetch Courses
      const crsRes = await fetch('/api/courses');
      const crsData = await crsRes.json();
      if (crsData.courses) setCourses(crsData.courses);

      // 3. Email Logs
      const logRes = await fetch('/api/admin/email-logs');
      const logData = await logRes.json();
      if (logData.emailLogs) setEmailLogs(logData.emailLogs);

      // 4. Newsletter Subscribers
      const subRes = await fetch('/api/admin/newsletter-subscribers');
      const subData = await subRes.json();
      if (subData.subscribers) setSubscribers(subData.subscribers);

      // 5. Contact Inquiries
      const inqRes = await fetch('/api/admin/contact-inquiries');
      const inqData = await inqRes.json();
      if (inqData.inquiries) setInquiries(inqData.inquiries);

    } catch (err) {
      console.error('Error fetching administrative datasets', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminMetrics();
  }, [tab]);

  // Approve operation
  const handleApprove = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/students/${id}/approve`, { method: 'POST' });
      if (res.ok) {
        setActionSuccess('Student approved successfully! Live Sim-SMTP email dispatched.');
        loadAdminMetrics();
      } else {
        setActionError('Failed to execute approval.');
      }
    } catch {
      setActionError('Network error during operation.');
    }
  };

  // Reject operation
  const handleReject = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/students/${id}/reject`, { method: 'POST' });
      if (res.ok) {
        setActionSuccess('Student rejected. Update email logged to SMTP log diagnostics.');
        loadAdminMetrics();
      } else {
        setActionError('Failed to execute rejection.');
      }
    } catch {
      setActionError('Network issue.');
    }
  };

  // Edit Student formulation submit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;

    try {
      const res = await fetch(`/api/admin/students/${editingStudent.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingStudent)
      });
      if (res.ok) {
        setActionSuccess('Student information updated successfully!');
        setEditingStudent(null);
        loadAdminMetrics();
      } else {
        const d = await res.json();
        setActionError(d.error || 'Failed to update student state.');
      }
    } catch {
      setActionError('Connectivity error.');
    }
  };

  // Delete operation
  const handleDeleteStudent = async (id: string) => {
    if (!confirm('Are you absolutely sure you want to completely purge this student registration history?')) return;
    try {
      const res = await fetch(`/api/admin/students/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setActionSuccess('Student registration records purged successfully.');
        loadAdminMetrics();
      } else {
        setActionError('Failed to delete student records.');
      }
    } catch {
      setActionError('Network error on file deletion.');
    }
  };

  // Add Dynamic course
  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourse.title || !newCourse.description || !newCourse.fee || !newCourse.duration) return;

    try {
      const res = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCourse)
      });
      if (res.ok) {
        setActionSuccess('New curriculum added! Notification broadcasted globally.');
        setNewCourse({ title: '', description: '', duration: '', fee: '', syllabus: '' });
        loadAdminMetrics();
      }
    } catch {
       setActionError('Failed to transmit course creation.');
    }
  };

  // Upload Learning Materials
  const handleAddMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMat.title || !newMat.courseId || !newMat.filePath) {
      setActionError('All material fields mapping required.');
      return;
    }

    try {
      const res = await fetch('/api/admin/materials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMat)
      });
      if (res.ok) {
        setActionSuccess('Learning material published. Course push notification launched!');
        setNewMat({ title: '', courseId: '', filePath: '', fileSize: '1.2 MB' });
        loadAdminMetrics();
      }
    } catch {
      setActionError('Error transmitting material asset.');
    }
  };

  // Broadcast Notification
  const handlePostNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBroadcast.title || !newBroadcast.message) return;

    try {
      const res = await fetch('/api/admin/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBroadcast)
      });
      if (res.ok) {
        setActionSuccess('System announcement broadcast successfully!');
        setNewBroadcast({ title: '', message: '', studentId: 'all' });
      }
    } catch {
      setActionError('Error during announcement launch.');
    }
  };

  // Statistics summaries
  const totalApps = students.length;
  const pendingApps = students.filter(s => s.status === 'Pending').length;
  const approvedApps = students.filter(s => s.status === 'Approved').length;
  const rejectedApps = students.filter(s => s.status === 'Rejected').length;
  const coursesCount = courses.length;

  // Search filter implementation
  const filteredStudents = students.filter((s) => {
    const matchesSearch = s.fullname.toLowerCase().includes(query.toLowerCase()) || 
                          s.email.toLowerCase().includes(query.toLowerCase()) || 
                          s.studentId.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = filterStatus === 'All' || s.status === filterStatus;
    const matchesCourse = filterCourse === 'All' || s.course.toLowerCase().includes(filterCourse.toLowerCase());
    return matchesSearch && matchesStatus && matchesCourse;
  });

  return (
    <div className="space-y-10 pb-20">
      
      {/* Title block */}
      <section className="bg-brand-primary text-white rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-xl border border-slate-100">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,168,255,0.1),transparent_50%)]"></div>
        <div className="relative z-10 space-y-1.5 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-brand-secondary">Core Master Command</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold font-display">EJaytech Concepts Admin Terminal</h1>
          <p className="text-xs text-gray-300">Live operational panel to review registrations, seed courses, review inquiries, & visualize simulated outbox logs.</p>
        </div>

        <button 
          onClick={onLogout}
          className="relative z-10 inline-flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-rose-400 bg-white/5 hover:bg-white/10 px-4 py-2.5 rounded-xl transition cursor-pointer"
        >
          <LogOut className="w-4 h-4" /> Exit Workspace
        </button>
      </section>

      {/* Stats Counters Grid */}
      <section className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total Enrollees', value: totalApps, icon: Users, color: 'text-slate-800 bg-white' },
          { label: 'Pending Admiss.', value: pendingApps, icon: Clock, color: 'text-amber-600 bg-amber-50' },
          { label: 'Approved Students', value: approvedApps, icon: CheckCircle, color: 'text-emerald-600 bg-emerald-50' },
          { label: 'Rejected Applications', value: rejectedApps, icon: XCircle, color: 'text-rose-600 bg-rose-50' },
          { label: 'Active Curriculums', value: coursesCount, icon: BookOpen, color: 'text-blue-600 bg-blue-50' }
        ].map((item, i) => (
          <div key={i} className={`p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-4 ${item.color}`}>
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider leading-none">{item.label}</p>
              <p className="text-2xl font-extrabold font-display">{item.value}</p>
            </div>
            <item.icon className="w-8 h-8 opacity-20" />
          </div>
        ))}
      </section>

      {/* Operation Status messaging alerts */}
      {(actionSuccess || actionError) && (
        <div className="flex flex-col gap-2">
          {actionSuccess && (
            <p className="p-3 bg-emerald-50 text-emerald-800 text-xs md:text-sm font-semibold rounded-xl border border-emerald-200">
              ✓ {actionSuccess}
            </p>
          )}
          {actionError && (
            <p className="p-3 bg-rose-50 text-rose-800 text-xs md:text-sm font-semibold rounded-xl border border-rose-200">
              ✕ {actionError}
            </p>
          )}
        </div>
      )}

      {/* Main layout with Menu & working panes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sub-tabs menu left column (3 cols) */}
        <div className="lg:col-span-3 space-y-2">
          {[
            { id: 'applications', label: 'Student Admissions', icon: Users },
            { id: 'materials', label: 'Publish Study Files', icon: FileText },
            { id: 'notifications', label: 'Broadcast Announcements', icon: MessageSquare },
            { id: 'courses', label: 'Curriculum Builder', icon: BookOpen },
            { id: 'logs', label: 'SMTP Logs & Inquiries', icon: Mail },
            { id: 'cpanel', label: 'cPanel PHP Codebase', icon: Settings }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => { setTab(item.id as any); setActionError(''); setActionSuccess(''); }}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-xs md:text-sm transition cursor-pointer ${
                tab === item.id 
                  ? 'bg-brand-primary text-white shadow-md' 
                  : 'bg-brand-accent text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <item.icon className={`w-4 h-4 ${tab === item.id ? 'text-brand-secondary' : 'text-slate-500'}`} />
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Dynamic workspace pane right column (9 cols) */}
        <div className="lg:col-span-9 bg-white border border-slate-200 rounded-3xl p-6 md:p-8 min-h-[500px]">
          
          {/* TAB 1: APPLICATIONS & MANAGEMENT LIST */}
          {tab === 'applications' && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-brand-primary">Student Enrollees & Applications System</h3>
                <p className="text-xs text-gray-500">Search student ID indices, execute verification pipelines, or edit details inline.</p>
              </div>

              {/* Filtering strip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-brand-accent p-4 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-2 bg-white rounded-xl border border-slate-200 px-3 py-2.5">
                  <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <input 
                    type="text" 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by ID or email..."
                    className="bg-transparent text-xs text-slate-900 focus:outline-none w-full"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-400" />
                  <select 
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="bg-white rounded-xl border border-slate-200 px-3 py-2.5 text-xs text-slate-700 w-full focus:outline-none"
                  >
                    <option value="All">All Admissions Statuses</option>
                    <option value="Pending">Pending Approvals</option>
                    <option value="Approved">Approved Space</option>
                    <option value="Rejected">Rejected Application</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-slate-400" />
                  <select 
                    value={filterCourse}
                    onChange={(e) => setFilterCourse(e.target.value)}
                    className="bg-white rounded-xl border border-slate-200 px-3 py-2.5 text-xs text-slate-700 w-full focus:outline-none"
                  >
                    <option value="All">All Training Tracks</option>
                    <option value="Frontend">Frontend Web Dev</option>
                    <option value="Graphic">Graphic & Branding</option>
                    <option value="UI/UX">UI/UX Design</option>
                    <option value="Digital">Digital Skills</option>
                  </select>
                </div>
              </div>

              {/* Working Student Applications Table */}
              {loading ? (
                <p className="p-8 text-center text-slate-400 font-mono text-xs uppercase animate-pulse">Consulting database system...</p>
              ) : filteredStudents.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-3xl bg-brand-accent text-slate-500">
                  <p className="font-bold text-xs md:text-sm">No enrollees match those filter keys.</p>
                  <p className="text-[11px] text-gray-400 mt-1">Adjust search parameters or status query selections.</p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-slate-100">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-brand-accent/50 border-b border-slate-150 text-[10px] uppercase font-bold text-slate-500">
                        <th className="p-4">Assigned Student ID / Name</th>
                        <th className="p-4">Track Focus</th>
                        <th className="p-4">Origin / Age</th>
                        <th className="p-4">Verification Check</th>
                        <th className="p-4 text-center">Action Nodes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {filteredStudents.map((stud) => (
                        <tr key={stud.id} className="hover:bg-slate-50/50 transition">
                          <td className="p-4">
                            <p className="font-bold text-slate-800">{stud.fullname}</p>
                            <p className="text-[10px] text-brand-secondary font-mono mt-0.5">{stud.studentId}</p>
                            <p className="text-[10px] text-gray-400 font-medium">{stud.email} • {stud.phone}</p>
                          </td>
                          <td className="p-4 font-semibold text-slate-700">{stud.course}</td>
                          <td className="p-4 text-slate-500">
                            {stud.state}
                            <p className="text-[10px] text-gray-400 mt-0.5">Born on {stud.dob || '1998'}</p>
                          </td>
                          <td className="p-4">
                            <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold text-center ${
                              stud.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' :
                              stud.status === 'Rejected' ? 'bg-rose-50 text-rose-600' :
                              'bg-amber-100 text-amber-700 border border-amber-300'
                            }`}>
                              ● {stud.status}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center justify-center gap-2">
                              {stud.status === 'Pending' && (
                                <>
                                  <button 
                                    onClick={() => handleApprove(stud.id)}
                                    title="Verify & Approve"
                                    className="p-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition"
                                  >
                                    <CheckCircle className="w-3.5 h-3.5" />
                                  </button>
                                  <button 
                                    onClick={() => handleReject(stud.id)}
                                    title="Audit Reject"
                                    className="p-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-lg transition"
                                  >
                                    <XCircle className="w-3.5 h-3.5" />
                                  </button>
                                </>
                              )}
                              <button 
                                onClick={() => setEditingStudent({ ...stud })}
                                title="Edit Record"
                                className="p-1.5 bg-brand-accent hover:bg-slate-200 text-slate-600 rounded-lg transition"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button 
                                onClick={() => handleDeleteStudent(stud.id)}
                                title="Purge Record"
                                className="p-1.5 bg-slate-100 hover:bg-rose-100 hover:text-rose-600 text-slate-500 rounded-lg transition"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Editing Student Inline section panel */}
              {editingStudent && (
                <div className="p-6 bg-brand-accent rounded-3xl border border-slate-200 space-y-4">
                  <p className="text-sm font-bold text-brand-primary">Edit details of student: <strong className="text-brand-secondary">{editingStudent.studentId}</strong></p>
                  <form onSubmit={handleEditSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs md:text-sm">
                    <div className="space-y-1">
                      <label className="text-xs uppercase text-slate-500">Full Name</label>
                      <input 
                        type="text" 
                        value={editingStudent.fullname}
                        onChange={(e) => setEditingStudent({ ...editingStudent, fullname: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs uppercase text-slate-500">Email</label>
                      <input 
                        type="email" 
                        value={editingStudent.email}
                        onChange={(e) => setEditingStudent({ ...editingStudent, email: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs uppercase text-slate-500">Phone</label>
                      <input 
                        type="text" 
                        value={editingStudent.phone}
                        onChange={(e) => setEditingStudent({ ...editingStudent, phone: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs uppercase text-slate-500">Origin State</label>
                      <input 
                        type="text" 
                        value={editingStudent.state}
                        onChange={(e) => setEditingStudent({ ...editingStudent, state: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5"
                      />
                    </div>
                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-xs uppercase text-slate-500">Residential Address</label>
                      <input 
                        type="text" 
                        value={editingStudent.address}
                        onChange={(e) => setEditingStudent({ ...editingStudent, address: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5"
                      />
                    </div>
                    <div className="sm:col-span-2 pt-2 flex gap-2">
                      <button type="submit" className="px-4 py-2 bg-brand-primary text-white font-bold rounded-lg cursor-pointer">Commit Edit</button>
                      <button type="button" onClick={() => setEditingStudent(null)} className="px-4 py-2 bg-slate-300 text-slate-700 rounded-lg">Dismiss</button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: STUDY MATERIALS PUBLISHING */}
          {tab === 'materials' && (
            <div className="space-y-8">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-brand-primary">Publish Learning Resources & Syllabus Documents</h3>
                <p className="text-xs text-gray-500">Uploaded documents trigger a push alert notification directly to student portal feeds.</p>
              </div>

              <form onSubmit={handleAddMaterial} className="bg-brand-accent p-6 rounded-3xl border border-slate-100 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-slate-500">Document Title</label>
                    <input 
                      type="text" 
                      value={newMat.title}
                      onChange={(e) => setNewMat({ ...newMat, title: e.target.value })}
                      placeholder="e.g. Photoshop Sizing & Grid Guidelines"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs md:text-sm focus:outline-none"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-slate-500">Select Enrollee Course Mapping</label>
                    <select 
                      value={newMat.courseId}
                      onChange={(e) => setNewMat({ ...newMat, courseId: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs"
                      required
                    >
                      <option value="">-- Click to Map --</option>
                      {courses.map(c => (
                        <option key={c.id} value={c.id}>{c.title}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-slate-500">Simulated Document File URL or Drive link</label>
                    <input 
                      type="text" 
                      value={newMat.filePath}
                      onChange={(e) => setNewMat({ ...newMat, filePath: e.target.value })}
                      placeholder="https://docs.google.com/document/d/... (Paste link)"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs md:text-sm focus:outline-none"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-slate-500">Document File Size (Label)</label>
                    <input 
                      type="text" 
                      value={newMat.fileSize}
                      onChange={(e) => setNewMat({ ...newMat, fileSize: e.target.value })}
                      placeholder="e.g. 1.2 MB"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs md:text-sm focus:outline-none"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-brand-primary text-white font-bold rounded-xl text-xs md:text-sm cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4 text-brand-secondary" /> Publish Study Resource
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: ANNOUNCEMENT BROADCASTING */}
          {tab === 'notifications' && (
            <div className="space-y-8">
              <div className="space-y-1 border-b border-slate-100 pb-4">
                <h3 className="text-lg font-bold text-brand-primary">Broadcast Interactive Announcements System</h3>
                <p className="text-xs text-gray-500">Trigger standard visual banners globally or alert single students using ID parameters.</p>
              </div>

              <form onSubmit={handlePostNotification} className="bg-brand-accent p-6 rounded-3xl border border-slate-100 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-slate-500">Announcement Title</label>
                    <input 
                      type="text" 
                      value={newBroadcast.title}
                      onChange={(e) => setNewBroadcast({ ...newBroadcast, title: e.target.value })}
                      placeholder="e.g. Upcoming Physical Web Development Seminar"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs md:text-sm focus:outline-none"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-slate-500">Assign Recipient Target</label>
                    <select 
                      value={newBroadcast.studentId}
                      onChange={(e) => setNewBroadcast({ ...newBroadcast, studentId: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs"
                    >
                      <option value="all">Global Broadcast Mode (All Enrollees)</option>
                      {students.map(s => (
                        <option key={s.id} value={s.studentId}>{s.fullname} ({s.studentId})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-slate-500 font-display">Announcement Content Body</label>
                  <textarea 
                    value={newBroadcast.message}
                    onChange={(e) => setNewBroadcast({ ...newBroadcast, message: e.target.value })}
                    placeholder="Describe detailed specifications, physical locations, or class times...."
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs md:text-sm h-24 focus:outline-none resize-none"
                    required
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-brand-primary text-white font-bold rounded-xl text-xs md:text-sm cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 text-brand-secondary" /> Broadcast News Alert
                </button>
              </form>
            </div>
          )}

          {/* TAB 4: CURRICULUM SEED BUILDER */}
          {tab === 'courses' && (
            <div className="space-y-8">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-brand-primary">Curriculum Course Builder</h3>
                <p className="text-xs text-gray-500">Seed brand new technological streams or edit course requirements.</p>
              </div>

              <form onSubmit={handleAddCourse} className="bg-brand-accent p-6 rounded-3xl border border-slate-100 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-slate-500">Course Stream Title</label>
                    <input 
                      type="text" 
                      value={newCourse.title}
                      onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                      placeholder="e.g. NextJS Complete Architecture"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs md:text-sm focus:outline-none"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-slate-500">Cost/Tuition Fee</label>
                    <input 
                      type="text" 
                      value={newCourse.fee}
                      onChange={(e) => setNewCourse({ ...newCourse, fee: e.target.value })}
                      placeholder="₦140,000"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs md:text-sm focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-slate-500">Duration Range</label>
                    <input 
                      type="text" 
                      value={newCourse.duration}
                      onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })}
                      placeholder="e.g. 10 Weeks"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-slate-500">Short Summary description</label>
                    <input 
                      type="text" 
                      value={newCourse.description}
                      onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                      placeholder="Quick elevator pitch description..."
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-slate-500">Syllabus Lessons (Separate weeks using commas)</label>
                  <textarea 
                    value={newCourse.syllabus}
                    onChange={(e) => setNewCourse({ ...newCourse, syllabus: e.target.value })}
                    placeholder="React States setup, Node servers binding, API proxy architectures..."
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs h-16 resize-none focus:outline-none"
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-brand-primary text-white font-bold rounded-xl text-xs md:text-sm cursor-pointer hover:bg-brand-secondary hover:text-brand-primary"
                >
                  <PlusCircle className="w-4 h-4" /> Seed Course Curriculum
                </button>
              </form>

              {/* View current courses list */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Current active courses in database</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {courses.map(c => (
                    <div key={c.id} className="p-4 border border-slate-200 rounded-xl bg-white space-y-1.5 text-xs">
                      <p className="font-bold text-slate-800">{c.title}</p>
                      <p className="text-[11px] text-gray-500 line-clamp-2">{c.description}</p>
                      <p className="text-[10px] text-brand-secondary font-semibold">{c.duration} • Tuition: {c.fee}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: GMAIL SMTP LOGS & NEWSLETTER SUBSCRIBERS */}
          {tab === 'logs' && (
            <div className="space-y-8">
              
              {/* Contact inquiries list */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900">Website Secure Contact Inquiries ({inquiries.length})</h3>
                  <p className="text-[11px] text-gray-400">Incoming messages transmitted directly from home layout forms.</p>
                </div>

                {inquiries.length === 0 ? (
                  <p className="p-6 bg-brand-accent rounded-xl text-center text-xs text-slate-400">No message submissions recorded.</p>
                ) : (
                  <div className="space-y-3">
                    {inquiries.map(inq => (
                      <div key={inq.id} className="p-4 border border-slate-150 rounded-xl bg-white space-y-2 text-xs">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-bold text-brand-primary">{inq.fullname}</p>
                            <p className="text-[10px] text-slate-500 font-medium">{inq.email} • Intercepted on {new Date(inq.submittedAt).toLocaleString()}</p>
                          </div>
                          <span className="text-[10px] font-bold bg-brand-accent text-slate-600 px-2 py-0.5 rounded uppercase">
                            {inq.subject}
                          </span>
                        </div>
                        <p className="text-slate-700 bg-slate-50 p-2.5 rounded border border-slate-100 italic leading-relaxed">
                          "{inq.message}"
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Newsletter Subscriptions */}
              <div className="space-y-3 pt-6 border-t border-slate-100">
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900">Newsletter subscribers ({subscribers.length})</h3>
                  <p className="text-[11px] text-gray-400">Emails registered on visual newsletters grids.</p>
                </div>
                {subscribers.length === 0 ? (
                  <p className="text-xs text-slate-400">No active newsletters registered.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {subscribers.map(sub => (
                      <span key={sub.id} className="text-xs font-semibold px-2.5 py-1 bg-brand-accent text-slate-600 rounded-lg border border-slate-200">
                        {sub.email}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Secure simulated Gmail SMTP logs - PHPMailer */}
              <div className="space-y-4 pt-6 border-t border-slate-100">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-brand-primary uppercase tracking-widest font-display">Live Gmail SMTP Mailer Outbox Logs ({emailLogs.length})</h3>
                  <p className="text-xs text-slate-600">Secure real-time verification logs showing outbound notifications emitted by the system.</p>
                </div>

                {emailLogs.length === 0 ? (
                  <p className="p-6 bg-brand-accent rounded-xl text-center text-xs text-slate-400 font-mono">Outbound email pipeline empty.</p>
                ) : (
                  <div className="space-y-3.5 max-h-[300px] overflow-y-auto no-scrollbar border border-slate-200 rounded-2xl p-4 bg-slate-900 text-slate-300">
                    {emailLogs.map((log) => (
                      <div key={log.id} className="space-y-1.5 border-b border-white/5 pb-3 last:border-0 last:pb-0 text-[11px] font-mono whitespace-pre-line">
                        <div className="flex justify-between text-yellow-400 font-bold">
                          <span>[GMAIL_SMTP_OUTBOX] State: 200 OK (Sent)</span>
                          <span className="text-gray-400">{new Date(log.sentAt).toLocaleTimeString()}</span>
                        </div>
                        <p className="text-blue-400 font-semibold">Recipient: &lt;{log.recipientEmail}&gt;</p>
                        <p className="text-white font-semibold">Subject: "{log.subject}"</p>
                        <div className="text-gray-400 pl-4 border-l border-white/10 text-[10px] leading-relaxed">
                          {log.message}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {tab === 'cpanel' && (
            <div className="space-y-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <FolderOpen className="w-5 h-5 text-brand-secondary" />
                  <h3 className="text-lg font-bold text-brand-primary">cPanel & Hostinger PHP Deployable Codebase</h3>
                </div>
                <p className="text-xs text-gray-500">
                  This explorer parses the physical <code>/public_html</code> files directory created in your container workspace.
                  Copy or download these files to place directly in your web hosting server's <code>public_html/</code> directory.
                </p>
              </div>

              {/* Layout: Sidebar with file lists & code viewer */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2">
                
                {/* List of Files (col-span-4) */}
                <div className="md:col-span-4 space-y-1 bg-brand-accent p-3.5 rounded-2xl border border-slate-150 h-[480px] overflow-y-auto">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 px-1">Project Directory (public_html/)</div>
                  {[
                    { path: 'config/config.php', label: 'config/config.php', type: 'php' },
                    { path: 'database/schema.sql', label: 'database/schema.sql', type: 'sql' },
                    { path: 'includes/db_connect.php', label: 'includes/db_connect.php', type: 'php' },
                    { path: 'includes/mail_sender.php', label: 'includes/mail_sender.php', type: 'php' },
                    { path: 'includes/header.php', label: 'includes/header.php', type: 'php' },
                    { path: 'includes/footer.php', label: 'includes/footer.php', type: 'php' },
                    { path: 'student/register.php', label: 'student/register.php', type: 'php' },
                    { path: 'student/login.php', label: 'student/login.php', type: 'php' },
                    { path: 'student/dashboard.php', label: 'student/dashboard.php', type: 'php' },
                    { path: 'admin/login.php', label: 'admin/login.php', type: 'php' },
                    { path: 'admin/dashboard.php', label: 'admin/dashboard.php', type: 'php' },
                    { path: 'index.php', label: 'index.php', type: 'php' },
                    { path: 'about.php', label: 'about.php', type: 'php' },
                    { path: 'services.php', label: 'services.php', type: 'php' },
                    { path: 'projects.php', label: 'projects.php', type: 'php' },
                    { path: 'courses.php', label: 'courses.php', type: 'php' },
                    { path: 'blog.php', label: 'blog.php', type: 'php' },
                    { path: 'contact.php', label: 'contact.php', type: 'php' },
                    { path: 'assets/css/style.css', label: 'assets/css/style.css', type: 'css' },
                    { path: 'assets/js/main.js', label: 'assets/js/main.js', type: 'js' }
                  ].map((f) => (
                    <button
                      key={f.path}
                      onClick={() => setSelectedFile(f.path)}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-mono transition flex items-center justify-between ${
                        selectedFile === f.path
                          ? 'bg-brand-primary text-white font-bold'
                          : 'hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      <span className="truncate">{f.label}</span>
                      <span className="text-[9px] uppercase px-1 bg-black/10 rounded">{f.type}</span>
                    </button>
                  ))}
                </div>

                {/* File Code contents viewer (col-span-8) */}
                <div className="md:col-span-8 flex flex-col h-[480px]">
                  <div className="flex items-center justify-between bg-slate-800 text-slate-300 px-4 py-2 rounded-t-xl text-xs font-mono border-b border-slate-700">
                    <span className="truncate">{selectedFile}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(fileContents);
                          setCopySuccess('Copied!');
                          setTimeout(() => setCopySuccess(''), 2000);
                        }}
                        className="p-1 px-2.5 bg-slate-700 hover:bg-slate-600 rounded flex items-center gap-1.5 transition text-[11px] font-sans font-semibold text-white cursor-pointer"
                      >
                        {copySuccess ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        {copySuccess || 'Copy Code'}
                      </button>
                    </div>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-b-xl overflow-auto flex-1 font-mono text-[11px] leading-relaxed text-slate-300 border border-slate-800 border-t-0 whitespace-pre select-all">
                    {isLoadingFile ? (
                      <div className="h-full flex items-center justify-center text-slate-500 font-sans">
                        Reading physical file contents from container workspace...
                      </div>
                    ) : (
                      fileContents
                    )}
                  </div>
                </div>

              </div>

              {/* cPanel configuration guides */}
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 md:p-5 mt-4 text-xs space-y-3 text-slate-700">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  EJaytech Concepts PHP cPanel Deployment Procedure
                </h4>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>
                    <strong>Create Database:</strong> Go to cPanel → MySQL Databases. Create a database named <code>ejaytech_db</code>, define a database user, link them together with full privileges.
                  </li>
                  <li>
                    <strong>Execute Schema:</strong> Click PHPMyAdmin in cPanel, select <code>ejaytech_db</code>, navigate to the <i>Import</i> tab and upload the <code>database/schema.sql</code> file.
                  </li>
                  <li>
                    <strong>Update Configuration:</strong> Open <code>config/config.php</code> on cPanel File Manager and edit MySQL credentials (DB_HOST, DB_NAME, DB_USER, DB_PASS) and enter your SMTP keys to enable actual PHPMailer dispatches.
                  </li>
                  <li>
                    <strong>Upload Files:</strong> Zip the <code>public_html/</code> directory, upload it to your server's root folder, extract it, and make sure the contents of <code>public_html/</code> reside in the root of your web directories (e.g. <code>public_html/</code> or <code>httpdocs/</code>).
                  </li>
                </ol>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
