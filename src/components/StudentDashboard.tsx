/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Student, Notification, LearningMaterial } from '../types';
import { 
  User, 
  BookOpen, 
  Bell, 
  Download, 
  Settings, 
  LogOut, 
  CheckCircle, 
  FileText, 
  Shield, 
  MapPin, 
  Key,
  Smartphone,
  Info
} from 'lucide-react';

interface StudentDashboardProps {
  user: Student;
  onLogout: () => void;
  onUpdateUser: (newUser: Student) => void;
}

export default function StudentDashboard({ user, onLogout, onUpdateUser }: StudentDashboardProps) {
  const [tab, setTab] = useState<'profile' | 'courses' | 'notifications' | 'settings'>('profile');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [materials, setMaterials] = useState<LearningMaterial[]>([]);
  const [settingsForm, setSettingsForm] = useState({
    fullname: user.fullname,
    phone: user.phone,
    address: user.address,
    gender: user.gender,
    dob: user.dob,
    state: user.state,
    bio: user.bio || '',
    curPassword: '',
    newPassword: ''
  });

  const [settingsSuccess, setSettingsSuccess] = useState('');
  const [settingsError, setSettingsError] = useState('');
  const [updating, setUpdating] = useState(false);

  // Fetch student materials and in-app notifications
  useEffect(() => {
    async function fetchStudentAssets() {
      try {
        // Fetch Notifications
        const notifRes = await fetch(`/api/notifications?studentId=${user.studentId}`);
        const notifData = await notifRes.json();
        if (notifData.notifications) setNotifications(notifData.notifications);

        // Fetch Materials
        const matRes = await fetch('/api/materials');
        const matData = await matRes.json();
        if (matData.materials) {
          // Filter materials that match student course
          const belongsToTrack = (m: LearningMaterial) => {
            if (user.course.toLowerCase().includes('frontend') && m.courseId === 'course-1') return true;
            if (user.course.toLowerCase().includes('graphic') && m.courseId === 'course-2') return true;
            if (user.course.toLowerCase().includes('ux') && m.courseId === 'course-3') return true;
            if (user.course.toLowerCase().includes('skills') && m.courseId === 'course-4') return true;
            return false;
          };
          setMaterials(matData.materials.filter(belongsToTrack));
        }
      } catch (err) {
        console.error('Error fetching student dashboard records', err);
      }
    }
    fetchStudentAssets();
  }, [user.studentId, user.course]);

  const handleMarkAsRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: 'POST' });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, status: 'read' } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSettingsUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsSuccess('');
    setSettingsError('');
    setUpdating(true);

    try {
      const res = await fetch(`/api/students/${user.id}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settingsForm)
      });
      const data = await res.json();
      if (res.ok) {
        setSettingsSuccess('Your profile configurations were compiled and updated successfully!');
        onUpdateUser(data.user);
        setSettingsForm(prev => ({ ...prev, curPassword: '', newPassword: '' }));
      } else {
        setSettingsError(data.error || 'Failed to apply update parameters.');
      }
    } catch {
      setSettingsError('Connectivity glitch when communicating with server.');
    } finally {
      setUpdating(false);
    }
  };

  // Certificate Download Mock Simulator
  const handleDownloadCertificate = () => {
    const win = window.open('', '_blank');
    if (!win) {
      alert('Pop-up blocked. Please permit pop-ups on EJaytech Concepts portal.');
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>EJaytech Concepts Certificate of Completion - ${user.fullname}</title>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
        <style>
          body {
            margin: 0;
            padding: 40px;
            background: #F5F7FA;
            font-family: 'Poppins', sans-serif;
            display: flex;
            justify-content: center;
          }
          .cert-container {
            width: 842px;
            height: 595px;
            background: #FFFFFF;
            border: 24px solid #0A192F;
            box-shadow: 0 10px 30px rgba(0,0,0,0.15);
            padding: 40px;
            box-sizing: border-box;
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }
          .inner-border {
            border: 2px solid #00A8FF;
            height: 100%;
            padding: 30px;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            text-align: center;
          }
          .logo-text {
            font-size: 20px;
            font-weight: 700;
            color: #0A192F;
            letter-spacing: 2px;
          }
          .subtitle {
            font-size: 11px;
            color: #00A8FF;
            text-transform: uppercase;
            letter-spacing: 3px;
            margin-top: 4px;
          }
          .main-heading {
            font-family: 'Playfair Display', serif;
            font-size: 40px;
            font-weight: 700;
            color: #0A192F;
            margin: 15px 0 0 0;
          }
          .presented-to {
            font-size: 13px;
            color: #64748B;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin: 0;
          }
          .student-fullname {
            font-family: 'Playfair Display', serif;
            font-style: italic;
            font-size: 32px;
            color: #0A192F;
            border-bottom: 2px solid #00A8FF;
            padding-bottom: 8px;
            min-width: 320px;
            margin: 10px 0;
          }
          .achievement-text {
            font-size: 13px;
            color: #475569;
            max-width: 500px;
            line-height: 1.6;
            margin: 0;
          }
          .course-title {
            color: #00A8FF;
            font-weight: 700;
          }
          .footer-signs {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-top: 15px;
          }
          .sign-block {
            width: 150px;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .sign-line {
            border-top: 1px solid #94A3B8;
            width: 100%;
            margin-top: 8px;
            padding-top: 6px;
            font-size: 10px;
            color: #64748B;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .sign-font {
            font-family: 'Playfair Display', serif;
            font-style: italic;
            font-size: 18px;
            color: #0A192F;
          }
          .cert-id {
            font-size: 9px;
            color: #94A3B8;
            font-family: monospace;
          }
        </style>
      </head>
      <body>
        <div class="cert-container">
          <div class="inner-border">
            <div>
              <div class="logo-text">EJaytech Concepts</div>
              <div class="subtitle">Innovating Ideas, Delivering Solutions</div>
            </div>
            
            <h1 class="main-heading">Certificate of Completion</h1>
            <p class="presented-to">This is proudly presented to</p>
            <div id="cert-fullname" class="student-fullname">${user.fullname}</div>
            
            <p class="achievement-text">
              for successfully executing all practical project milestones, compiling capstone deliverables, and completing the professional training curriculum in <span class="course-title">${user.course}</span>.
            </p>
            
            <div class="footer-signs">
              <div class="sign-block text-left">
                <span class="sign-font">Elijah Yahuza</span>
                <div class="sign-line">Director of Tech</div>
              </div>
              <div class="cert-id">VERIFICATION NO: CERT-${user.studentId}-${Date.now().toString().slice(-4)}</div>
              <div class="sign-block text-right">
                <span class="sign-font">EJaytech Labs</span>
                <div class="sign-line">Registrar Seal</div>
              </div>
            </div>
          </div>
        </div>
        <script>
          window.print();
        </script>
      </body>
      </html>
    `;
    win.document.write(htmlContent);
    win.document.close();
  };

  const unreadCount = notifications.filter(n => n.status === 'unread').length;

  return (
    <div className="max-w-7xl mx-auto py-6 pb-20 px-6 space-y-10">
      
      {/* Student Welcome Header Card */}
      <section className="bg-brand-primary text-white rounded-3xl p-8 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-100 shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,168,255,0.1),transparent_50%)]"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
          <div className="w-16 h-16 rounded-full bg-brand-secondary/20 text-brand-secondary flex items-center justify-center font-bold text-2xl font-display uppercase border-2 border-brand-secondary/30">
            {user.fullname.charAt(0)}
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <h1 className="text-2xl font-bold font-display">{user.fullname}</h1>
              <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full select-none">
                Approved Access
              </span>
            </div>
            <p className="text-xs text-gray-300 font-mono tracking-wide">
              EJaytech ID: <strong>{user.studentId}</strong> • Track: <strong className="text-brand-secondary">{user.course}</strong>
            </p>
          </div>
        </div>

        <button 
          onClick={onLogout}
          className="relative z-10 inline-flex items-center gap-1.5 text-xs font-bold text-gray-300 hover:text-rose-400 bg-white/5 hover:bg-white/10 px-4 py-2.5 rounded-xl transition cursor-pointer"
        >
          <LogOut className="w-4 h-4" /> Secure Portal Logout
        </button>
      </section>

      {/* Grid of contents */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sub-menu Tabs Selection */}
        <div className="space-y-3">
          {[
            { id: 'profile', label: 'My Academic Profile', icon: User, count: 0 },
            { id: 'courses', label: 'My Learning Tracks', icon: BookOpen, count: 0 },
            { id: 'notifications', label: 'In-App Alerts', icon: Bell, count: unreadCount },
            { id: 'settings', label: 'Account Settings', icon: Settings, count: 0 }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id as any)}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl font-bold text-sm transition cursor-pointer ${
                tab === item.id 
                  ? 'bg-brand-primary text-white shadow-md' 
                  : 'bg-brand-accent text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className={`w-4 h-4 ${tab === item.id ? 'text-brand-secondary' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </div>
              {item.count > 0 && (
                <span className="bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full">
                  {item.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab content area */}
        <div className="lg:col-span-3 bg-white border border-slate-200 rounded-3xl p-6 md:p-8 min-h-[400px]">
          
          {/* TAB 1: ACADEMIC PROFILE */}
          {tab === 'profile' && (
            <div className="space-y-8">
              <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-brand-primary">Student Profile Overview</h3>
                  <p className="text-xs text-gray-500">Your registered database records are securely indexed below.</p>
                </div>
                <button 
                  id="print-certificate-trigger"
                  onClick={handleDownloadCertificate}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-brand-secondary hover:bg-brand-secondary/90 text-brand-primary hover:text-white font-bold rounded-lg text-xs transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" /> Download Certificate
                </button>
              </div>

              {user.bio && (
                <div className="bg-brand-accent p-4 rounded-xl text-xs md:text-sm text-slate-700 italic border-l-4 border-brand-secondary">
                  "{user.bio}"
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { label: 'Full Registered Name', val: user.fullname, icon: User },
                  { label: 'Assigned Student ID', val: user.studentId, icon: Shield },
                  { label: 'Contact Phone Number', val: user.phone, icon: Smartphone },
                  { label: 'Registered Course Track', val: user.course, icon: BookOpen },
                  { label: 'Residential Address', val: user.address, icon: MapPin },
                  { label: 'State of Origin', val: user.state, icon: MapPin },
                  { label: 'Sex/Gender Identity', val: user.gender, icon: User },
                  { label: 'Date of Birth (DOB)', val: user.dob, icon: FileText }
                ].map((item, i) => (
                  <div key={i} className="flex gap-3 bg-brand-accent/50 p-4 rounded-xl border border-slate-100">
                    <item.icon className="w-5 h-5 text-brand-secondary flex-shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">{item.label}</p>
                      <p className="text-sm font-bold text-slate-800">{item.val}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: COURSES & MATERIALS */}
          {tab === 'courses' && (
            <div className="space-y-8">
              <div className="space-y-1 border-b border-slate-100 pb-4">
                <h3 className="text-lg font-bold text-brand-primary">Course Resources & Syllabus Documents</h3>
                <p className="text-xs text-gray-500">Access reading files uploaded by your expert course instructors.</p>
              </div>

              {materials.length === 0 ? (
                <div className="text-center p-12 border border-slate-100 rounded-2xl bg-brand-accent text-slate-500">
                  <p className="font-bold mb-1">No learning resources uploaded yet.</p>
                  <p className="text-xs">Your mentors will share reading files of <strong>{user.course}</strong> shortly.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {materials.map((mat) => (
                    <div 
                      key={mat.id} 
                      className="p-5 border border-slate-200 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white hover:border-brand-secondary transition"
                    >
                      <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center flex-shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-800">{mat.title}</h4>
                          <p className="text-[11px] text-gray-500 mt-0.5">Size Tag: <strong>{mat.fileSize || '1.8 MB'}</strong> • Uploaded on {new Date(mat.uploadedAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <a 
                        href={mat.filePath}
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-brand-primary bg-brand-secondary hover:bg-brand-primary hover:text-white rounded-lg transition"
                      >
                        <Download className="w-3.5 h-3.5" /> View / Download Document
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SYSTEM NOTIFICATIONS */}
          {tab === 'notifications' && (
            <div className="space-y-8">
              <div className="space-y-1 border-b border-slate-100 pb-4">
                <h3 className="text-lg font-bold text-brand-primary">In-App Notifications Feed</h3>
                <p className="text-xs text-gray-500">Stay up to date with administrative approvals & class schedules.</p>
              </div>

              {notifications.length === 0 ? (
                <div className="text-center p-12 border border-slate-100 rounded-2xl bg-brand-accent text-slate-500">
                  <p className="font-bold mb-1">No notification alerts.</p>
                  <p className="text-xs">Check back later for newly broadcast announcements.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {notifications.map((notif) => (
                    <div 
                       key={notif.id} 
                       className={`p-5 rounded-2xl border transition relative flex justify-between gap-4 ${
                        notif.status === 'unread' 
                          ? 'bg-blue-50/50 border-blue-200' 
                          : 'bg-white border-slate-150'
                      }`}
                    >
                      <div className="space-y-1.5 pr-8">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-800">{notif.title}</h4>
                          {notif.status === 'unread' && (
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                          )}
                        </div>
                        <p className="text-xs md:text-sm text-slate-600 leading-relaxed">{notif.message}</p>
                        <span className="block text-[10px] text-gray-400 font-mono pt-1">
                          {new Date(notif.createdAt).toLocaleString()}
                        </span>
                      </div>

                      {notif.status === 'unread' && (
                        <button 
                          onClick={() => handleMarkAsRead(notif.id)}
                          className="text-[10px] shrink-0 font-bold text-blue-600 hover:text-brand-primary cursor-pointer self-start"
                        >
                          Mark as Read
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: SETTINGS EDIT */}
          {tab === 'settings' && (
            <div className="space-y-8">
              <div className="space-y-1 border-b border-slate-100 pb-4">
                <h3 className="text-lg font-bold text-brand-primary">Update Profile Parameters</h3>
                <p className="text-xs text-gray-500">Maintain accurate phone lines & personal biographical notes.</p>
              </div>

              {settingsSuccess && (
                <p className="p-4 bg-emerald-50 text-emerald-700 text-xs md:text-sm font-bold rounded-xl border-l-4 border-emerald-500">
                  {settingsSuccess}
                </p>
              )}

              {settingsError && (
                <p className="p-4 bg-rose-50 text-rose-700 text-xs md:text-sm font-bold rounded-xl border-l-4 border-rose-500">
                  {settingsError}
                </p>
              )}

              <form onSubmit={handleSettingsUpdate} className="space-y-6">
                
                {/* Visual Bio Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-slate-500">Student Biographical Bio (Appeared on Profile)</label>
                  <textarea 
                    value={settingsForm.bio}
                    onChange={(e) => setSettingsForm({ ...settingsForm, bio: e.target.value })}
                    placeholder="Brief sentence about your technology hobbies..."
                    className="w-full bg-slate-50 border border-slate-200 focus:border-brand-secondary rounded-xl px-3 py-2 text-xs md:text-sm focus:outline-none h-16 resize-none"
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase text-slate-500">Phoneline Number</label>
                    <input 
                      type="tel" 
                      value={settingsForm.phone}
                      onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-brand-secondary rounded-xl px-3 py-2.5 text-xs md:text-sm focus:outline-none"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase text-slate-500">Residential Address</label>
                    <input 
                      type="text" 
                      value={settingsForm.address}
                      onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-brand-secondary rounded-xl px-3 py-2.5 text-xs md:text-sm focus:outline-none"
                      required
                    />
                  </div>
                </div>

                {/* Password reset trigger settings */}
                <div className="pt-4 border-t border-slate-100 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-400">
                    <Key className="w-3.5 h-3.5" /> Optional Reset Password
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase text-slate-500">Current Password</label>
                      <input 
                        type="password" 
                        value={settingsForm.curPassword}
                        onChange={(e) => setSettingsForm({ ...settingsForm, curPassword: e.target.value })}
                        placeholder="••••••••"
                        className="w-full bg-slate-50 border border-slate-200 focus:border-brand-secondary rounded-xl px-3 py-2.5 text-xs md:text-sm focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase text-slate-500">New Password (Min 8 chars)</label>
                      <input 
                        type="password" 
                        value={settingsForm.newPassword}
                        onChange={(e) => setSettingsForm({ ...settingsForm, newPassword: e.target.value })}
                        placeholder="••••••••"
                        className="w-full bg-slate-50 border border-slate-200 focus:border-brand-secondary rounded-xl px-3 py-2.5 text-xs md:text-sm focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={updating}
                  className="inline-flex items-center gap-2 px-5 py-3 bg-brand-primary text-white hover:bg-brand-secondary hover:text-brand-primary font-bold rounded-xl transition text-xs md:text-sm cursor-pointer"
                >
                  {updating ? 'Updating Portfolio...' : 'Commit Settings Update'}
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
