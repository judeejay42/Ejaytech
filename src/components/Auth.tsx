/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  User, 
  Phone, 
  MapPin, 
  Calendar, 
  CreditCard, 
  ArrowRight, 
  CheckCircle,
  AlertTriangle,
  UserCheck,
  ShieldCheck,
  Eye,
  EyeOff
} from 'lucide-react';
import { Student, Admin } from '../types';

interface AuthProps {
  onLoginSuccess: (user: Student) => void;
  onAdminLoginSuccess: (admin: Admin) => void;
  initialMode?: 'login' | 'register' | 'admin-login';
  courses: Array<{ id: string, title: string }>;
}

export default function Auth({ onLoginSuccess, onAdminLoginSuccess, initialMode = 'login', courses }: AuthProps) {
  const [mode, setMode] = useState<'login' | 'register' | 'admin-login'>(initialMode);
  
  // Registration Form State
  const [regForm, setRegForm] = useState({
    fullname: '',
    email: '',
    phone: '',
    gender: 'Male',
    dob: '',
    state: '',
    address: '',
    course: courses[0]?.title || 'Frontend Web Development',
    password: '',
    confirmPassword: ''
  });

  // Login Form State
  const [loginForm, setLoginForm] = useState({
    identifier: '', // Student ID or Email
    password: ''
  });

  // Admin login Form State
  const [adminForm, setAdminForm] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [registeredStudentId, setRegisteredStudentId] = useState('');

  // States list for Nigerian states (often helpful for Nigerian business training hubs like EJaytech Concepts)
  const nigerianStates = [
    'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno', 'Cross River',
    'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT - Abuja', 'Gombe', 'Imo', 'Jigawa', 'Kaduna',
    'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo',
    'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
  ];

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    // Strong password validation check
    if (regForm.password.length < 8) {
      setError('Password must contain at least 8 characters.');
      return;
    }

    if (regForm.password !== regForm.confirmPassword) {
      setError('Your selected passwords do not match.');
      return;
    }

    // Phone parsing check
    if (regForm.phone.length < 10) {
      setError('Please provide a valid active phone line.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(regForm)
      });
      const data = await res.json();
      if (res.ok) {
        setSuccessMsg(data.message || 'Registration submitted successfully!');
        setRegisteredStudentId(data.studentId);
        // Clear formulation
        setRegForm({
          fullname: '',
          email: '',
          phone: '',
          gender: 'Male',
          dob: '',
          state: '',
          address: '',
          course: courses[0]?.title || 'Frontend Web Development',
          password: '',
          confirmPassword: ''
        });
      } else {
        setError(data.error || 'Failed to submit application.');
      }
    } catch {
      setError('Connectivity glitch. Please check connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!loginForm.identifier || !loginForm.password) {
      setError('Identifier and password are required.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm)
      });
      const data = await res.json();
      if (res.ok) {
        onLoginSuccess(data.user);
      } else {
        // Special display for pending or rejections
        if (res.status === 403) {
          setError(data.error || 'Your application is awaiting administrative review.');
        } else {
          setError(data.error || 'Invalid credentials. Passwords run encrypted.');
        }
      }
    } catch {
      setError('Connectivity glitch. Retry.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!adminForm.email || !adminForm.password) {
      setError('Admin email and master passwords required.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adminForm)
      });
      const data = await res.json();
      if (res.ok) {
        onAdminLoginSuccess(data.admin);
      } else {
        setError(data.error || 'Incorrect administrative credentials.');
      }
    } catch {
      setError('Network transmission difficulty.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 pb-20 px-6">
      {/* Visual toggle header */}
      <div className="flex justify-center gap-1.5 p-1.5 bg-brand-accent rounded-2xl max-w-sm mx-auto mb-10 border border-slate-200">
        <button
          onClick={() => { setMode('login'); setError(''); setSuccessMsg(''); }}
          className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition ${
            mode === 'login' ? 'bg-brand-primary text-white shadow-sm' : 'text-slate-600 hover:bg-white/50'
          }`}
        >
          Student Login
        </button>
        <button
          onClick={() => { setMode('register'); setError(''); setSuccessMsg(''); }}
          className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition ${
            mode === 'register' ? 'bg-brand-primary text-white shadow-sm' : 'text-slate-600 hover:bg-white/50'
          }`}
        >
          Registration Portal
        </button>
        <button
          onClick={() => { setMode('admin-login'); setError(''); setSuccessMsg(''); }}
          className={`px-3 py-2.5 text-xs font-bold rounded-xl transition ${
            mode === 'admin-login' ? 'bg-brand-primary text-white shadow-sm' : 'text-slate-500 hover:bg-white/50'
          }`}
        >
          Admin Panel
        </button>
      </div>

      {/* Auth Panel card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[500px]">
        
        {/* Left Side Info Panel (4 columns) */}
        <div className="md:col-span-4 bg-brand-primary text-white p-8 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,168,255,0.1),transparent_50%)]"></div>
          
          <div className="space-y-6 relative z-10">
            <span className="text-xs font-mono text-brand-secondary font-bold tracking-widest uppercase">EJaytech Portal</span>
            
            {mode === 'login' && (
              <div className="space-y-4">
                <h3 className="text-2xl font-extrabold text-white">Welcome Back Student</h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Enter your assigned Student ID or registered email address to access announcements and download materials.
                </p>
              </div>
            )}

            {mode === 'register' && (
              <div className="space-y-4">
                <h3 className="text-2xl font-extrabold text-white">Apply For Training</h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Launch your development or design career. All registration documents are securely reviewed.
                </p>
              </div>
            )}

            {mode === 'admin-login' && (
              <div className="space-y-4">
                <h3 className="text-2xl font-extrabold text-brand-secondary">Management Node</h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Master interface to review registrations, broadcast announcements, and monitor email logs.
                </p>
              </div>
            )}
          </div>

          <div className="border-t border-white/10 pt-6 mt-12 relative z-10">
            <div className="flex items-center gap-2 text-xs text-brand-secondary font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Standard SSL Secure Auth</span>
            </div>
          </div>
        </div>

        {/* Right Side Working Forms (8 columns) */}
        <div className="md:col-span-8 p-6 md:p-10 flex flex-col justify-center">
          
          {/* Success screen for application verified */}
          {successMsg && registeredStudentId ? (
            <div className="space-y-6 text-center py-6 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h4 className="text-xl font-bold text-slate-900">Application Received Successfully!</h4>
                <p className="text-sm text-gray-600 max-w-md mx-auto">
                  Thank you for applying to EJaytech Concepts. Your application has been logged on our live server and is awaiting administrative approval.
                </p>
              </div>

              {/* ID display card */}
              <div className="bg-brand-accent border border-slate-200 p-6 rounded-2xl max-w-sm mx-auto space-y-2">
                <p className="text-xs font-mono font-bold tracking-widest text-slate-500 uppercase">Assigned Student ID</p>
                <p className="text-2xl font-mono font-extrabold text-brand-primary">{registeredStudentId}</p>
                <p className="text-xs text-brand-secondary font-semibold">Awaiting review to unlock panel access</p>
              </div>

              <div className="pt-4 flex justify-center gap-4">
                <button 
                  onClick={() => { setMode('login'); setSuccessMsg(''); }}
                  className="px-5 py-2.5 bg-brand-primary hover:bg-brand-secondary text-white hover:text-brand-primary font-bold rounded-xl text-xs md:text-sm cursor-pointer transition"
                >
                  Go to Student Login
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* Normal form render */}
              {error && (
                <div className="p-4 bg-rose-50 border-l-4 border-rose-500 rounded-xl text-xs md:text-sm text-rose-700 font-semibold flex items-start gap-2 animate-pulse">
                  <AlertTriangle className="w-4.5 h-4.5 text-rose-500 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* 1. STUDENT LOGIN FORM */}
              {mode === 'login' && (
                <form onSubmit={handleLogin} className="space-y-5">
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-slate-500">Student ID or Email</label>
                    <div className="flex bg-slate-50 border border-slate-200 focus-within:border-brand-secondary rounded-xl px-3 py-2.5 items-center gap-2 transition">
                      <User className="w-4 h-4 text-slate-400" />
                      <input 
                        type="text" 
                        value={loginForm.identifier}
                        onChange={(e) => setLoginForm({ ...loginForm, identifier: e.target.value })}
                        placeholder="e.g. EJ-2026-1102 or student@gmail.com"
                        className="bg-transparent text-sm w-full focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-slate-500">Encrypted Password</label>
                    <div className="flex bg-slate-50 border border-slate-200 focus-within:border-brand-secondary rounded-xl px-3 py-2.5 items-center gap-2 transition">
                      <Lock className="w-4 h-4 text-slate-400" />
                      <input 
                        type={showPassword ? 'text' : 'password'} 
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                        placeholder="••••••••"
                        className="bg-transparent text-sm w-full focus:outline-none"
                        required
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-slate-400 hover:text-brand-primary"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-brand-primary hover:bg-brand-secondary text-white hover:text-brand-primary font-bold rounded-xl transition cursor-pointer text-sm"
                    >
                      {loading ? 'Authenticating secure login...' : 'Login to Dashboard'} <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              )}

              {/* 2. REGISTRATION ADMISSION FORM */}
              {mode === 'register' && (
                <form onSubmit={handleRegister} className="space-y-4 max-h-[500px] overflow-y-auto pr-2 no-scrollbar">
                  
                  {/* General Details Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase text-slate-500">Full Name</label>
                      <input 
                        type="text" 
                        value={regForm.fullname}
                        onChange={(e) => setRegForm({ ...regForm, fullname: e.target.value })}
                        placeholder="e.g. Samuel Adeku"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs md:text-sm focus:outline-none focus:border-brand-secondary"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase text-slate-500">Email Address</label>
                      <input 
                        type="email" 
                        value={regForm.email}
                        onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                        placeholder="sam@gmail.com"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs md:text-sm focus:outline-none focus:border-brand-secondary"
                        required
                      />
                    </div>
                  </div>

                  {/* Phone & Gender */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase text-slate-500">Active Phone Line</label>
                      <input 
                        type="tel" 
                        value={regForm.phone}
                        onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                        placeholder="e.g. 08123456789"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs md:text-sm focus:outline-none focus:border-brand-secondary"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase text-slate-500">Gender Identity</label>
                      <select 
                        value={regForm.gender}
                        onChange={(e) => setRegForm({ ...regForm, gender: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs md:text-sm focus:outline-none focus:border-brand-secondary"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  {/* DOB & Origin State */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase text-slate-500">Date of Birth</label>
                      <input 
                        type="date" 
                        value={regForm.dob}
                        onChange={(e) => setRegForm({ ...regForm, dob: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs md:text-sm focus:outline-none focus:border-brand-secondary text-slate-600"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase text-slate-500">State of Origin</label>
                      <select 
                        value={regForm.state}
                        onChange={(e) => setRegForm({ ...regForm, state: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs md:text-sm focus:outline-none focus:border-brand-secondary"
                        required
                      >
                        <option value="">-- Choose Origin State --</option>
                        {nigerianStates.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Course mapping */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-slate-500">Select Training Track Applying For</label>
                    <select 
                      value={regForm.course}
                      onChange={(e) => setRegForm({ ...regForm, course: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs md:text-sm focus:outline-none focus:border-brand-secondary font-semibold"
                    >
                      {courses.map((c) => (
                        <option key={c.id} value={courseTitleToShort(c.title)}>{c.title}</option>
                      ))}
                    </select>
                  </div>

                  {/* Residential Address */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-slate-500">Residential Address</label>
                    <input 
                      type="text" 
                      value={regForm.address}
                      onChange={(e) => setRegForm({ ...regForm, address: e.target.value })}
                      placeholder="e.g. Block C4, Garki Village, Abuja"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs md:text-sm focus:outline-none focus:border-brand-secondary"
                      required
                    />
                  </div>

                  {/* Passwords lock */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase text-slate-500">Account Password (Min 8 Chars)</label>
                      <input 
                        type="password" 
                        value={regForm.password}
                        onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                        placeholder="••••••••"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs md:text-sm focus:outline-none focus:border-brand-secondary"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase text-slate-500">Confirm Password Match</label>
                      <input 
                        type="password" 
                        value={regForm.confirmPassword}
                        onChange={(e) => setRegForm({ ...regForm, confirmPassword: e.target.value })}
                        placeholder="••••••••"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs md:text-sm focus:outline-none focus:border-brand-secondary"
                        required
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-brand-primary hover:bg-brand-secondary text-white hover:text-brand-primary font-bold rounded-xl transition cursor-pointer text-xs md:text-sm"
                    >
                      {loading ? 'Submitting Application...' : 'Register and Obtain ID'} <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              )}

              {/* 3. ADMIN PORTAL LOGIN */}
              {mode === 'admin-login' && (
                <form onSubmit={handleAdminLogin} className="space-y-5">
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-slate-500">Admin Email</label>
                    <div className="flex bg-slate-50 border border-slate-200 focus-within:border-brand-secondary rounded-xl px-3 py-2.5 items-center gap-2 transition">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <input 
                        type="email" 
                        value={adminForm.email}
                        onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                        placeholder="admin-username"
                        className="bg-transparent text-sm w-full focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-slate-500">Master Password</label>
                    <div className="flex bg-slate-50 border border-slate-200 focus-within:border-brand-secondary rounded-xl px-3 py-2.5 items-center gap-2 transition">
                      <Lock className="w-4 h-4 text-slate-400" />
                      <input 
                        type="password" 
                        value={adminForm.password}
                        onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                        placeholder="••••••••"
                        className="bg-transparent text-sm w-full focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-brand-primary hover:bg-brand-secondary text-white hover:text-brand-primary font-bold rounded-xl transition cursor-pointer text-sm"
                    >
                      {loading ? 'Decrypting Secure Admin Node...' : 'Access Admin Workspace'} <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              )}

            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Utility: parse title to short version
function courseTitleToShort(title: string): string {
  if (title.toLowerCase().includes('frontend')) return 'Frontend Web Development';
  if (title.toLowerCase().includes('graphic')) return 'Graphic Design & Branding';
  if (title.toLowerCase().includes('ux')) return 'UI/UX Product Design';
  if (title.toLowerCase().includes('skills')) return 'Digital Skills & Freelancing';
  return title;
}
