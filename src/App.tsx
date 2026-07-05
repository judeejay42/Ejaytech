/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Home from './components/Home';
import About from './components/About';
import Services from './components/Services';
import Courses from './components/Courses';
import Auth from './components/Auth';
import StudentDashboard from './components/StudentDashboard';
import AdminDashboard from './components/AdminDashboard';
import { Student, Admin } from './types';
import { 
  Menu, 
  X, 
  Moon, 
  Sun, 
  Phone, 
  Mail, 
  ArrowUp, 
  MessageCircle, 
  ChevronRight,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

export default function App() {
  const [page, setPage] = useState<string>('home');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [hamburger, setHamburger] = useState<boolean>(false);
  const [backToTop, setBackToTop] = useState<boolean>(false);

  // Unified student portal login/register mode
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'admin-login'>('login');

  // Auth User Sessions
  const [currentUser, setCurrentUser] = useState<Student | null>(null);
  const [currentAdmin, setCurrentAdmin] = useState<Admin | null>(null);

  // Global Courses list for auth registrations
  const [globalCourses, setGlobalCourses] = useState<Array<{ id: string, title: string }>>([]);

  useEffect(() => {
    // Load courses to supply dropdown forms
    async function loadGlobalCourses() {
      try {
        const res = await fetch('/api/courses');
        const data = await res.json();
        if (data.courses) {
          setGlobalCourses(data.courses);
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadGlobalCourses();

    // Scroll display triggers
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setBackToTop(true);
      } else {
        setBackToTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update dark mode class on document element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Handle auto applications selection trigger from Homepage and course cards
  const handleApplyCourseFlow = (courseTitle: string) => {
    setAuthMode('register');
    setPage('student-portal');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentAdmin(null);
    setPage('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const triggerWhatsApp = () => {
    const text = encodeURIComponent('Hello EJaytech Concepts! I am interested in inquiring about your custom courses & training solutions.');
    window.open(`https://wa.me/2348135402154?text=${text}`, '_blank');
  };

  const isPortalActive = page === 'student-portal';

  return (
    <div className={`min-h-screen flex flex-col bg-slate-50 transition-colors duration-300 ${darkMode ? 'bg-slate-900 text-white' : 'text-slate-800'}`}>
      
      {/* Upper info topbar */}
      <div className="bg-brand-primary text-gray-300 text-xs py-2 px-6 flex justify-between items-center border-b border-white/5 relative z-50">
        <div className="flex gap-4 items-center">
          <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-brand-secondary" /> +234 813 540 2154</span>
          <span className="hidden md:flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-brand-secondary" /> info@ejaytech.com</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-bold text-brand-secondary font-mono bg-brand-secondary/15 px-2 py-0.5 rounded uppercase select-none">
            Innovating Ideas, Delivering Solutions
          </span>
          <button 
            id="theme-toggle-upper-action"
            onClick={() => setDarkMode(!darkMode)}
            className="p-1 hover:text-white transition"
            title="Toggle Contrast Mode"
          >
            {darkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Structural Sticky Header */}
      <header className="sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 z-40 transition-colors">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          
          {/* Logo brand */}
          <div 
            onClick={() => { if (!currentUser && !currentAdmin) { setPage('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); } }}
            className="flex items-center gap-2.5 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-brand-primary text-brand-secondary flex items-center justify-center font-bold text-lg font-display tracking-tight shadow-md">
              EJ
            </div>
            <div>
              <span className="block font-bold text-brand-primary dark:text-white text-base leading-none">EJaytech Concepts</span>
              <span className="block text-[10px] text-brand-secondary uppercase font-semibold tracking-wider mt-1">Digital Training Hub</span>
            </div>
          </div>

          {/* Core Navigational Menu (Exactly 5 public pages) */}
          {!currentUser && !currentAdmin ? (
            <>
              {/* Desktop Menu */}
              <nav className="hidden lg:flex items-center gap-6 font-semibold text-sm">
                {[
                  { id: 'home', label: 'Home' },
                  { id: 'about', label: 'About Us' },
                  { id: 'services', label: 'Our Services' },
                  { id: 'courses', label: 'Courses' },
                  { id: 'student-portal', label: 'Student Portal' }
                ].map((m) => (
                  <button 
                    key={m.id}
                    onClick={() => { 
                      if (m.id === 'student-portal') {
                        setAuthMode('login');
                      }
                      setPage(m.id); 
                      window.scrollTo({ top: 0 }); 
                    }}
                    className={`transition hover:text-brand-secondary cursor-pointer ${
                      page === m.id || (m.id === 'student-portal' && isPortalActive)
                        ? 'text-brand-secondary font-bold border-b-2 border-brand-secondary pb-1' 
                        : 'text-slate-600 dark:text-gray-300'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </nav>

              {/* Desktop Headers action triggers */}
              <div className="hidden lg:flex items-center gap-3">
                <button 
                  id="header-student-login-trigger"
                  onClick={() => { setAuthMode('login'); setPage('student-portal'); window.scrollTo({ top: 0 }); }}
                  className="px-4 py-2.5 bg-brand-accent dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-white text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  Student Login
                </button>
                <button 
                  id="header-portal-register-trigger"
                  onClick={() => { setAuthMode('register'); setPage('student-portal'); window.scrollTo({ top: 0 }); }}
                  className="px-4.5 py-2.5 bg-brand-primary hover:bg-brand-secondary text-white hover:text-brand-primary text-xs font-bold rounded-xl transition cursor-pointer border border-brand-primary shadow-sm"
                >
                  Apply Online
                </button>
              </div>

              {/* Hambuger menu trigger */}
              <button 
                onClick={() => setHamburger(!hamburger)}
                className="lg:hidden p-2 text-slate-600 dark:text-white hover:text-brand-secondary transition cursor-pointer"
              >
                {hamburger ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </>
          ) : (
            <div className="flex items-center gap-4 text-xs font-semibold">
              {currentUser && (
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-brand-secondary" />
                  <span className="text-slate-600 dark:text-slate-300">Logged in: <strong>{currentUser.fullname}</strong></span>
                </div>
              )}
              {currentAdmin && (
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-brand-secondary text-amber-500 animate-pulse" />
                  <span className="text-slate-600 dark:text-slate-300">Admin terminal active</span>
                </div>
              )}
              <button 
                onClick={handleLogout}
                className="px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-lg transition cursor-pointer"
              >
                Log Out
              </button>
            </div>
          )}

        </div>

        {/* Mobile menu rail drawer */}
        {hamburger && !currentUser && !currentAdmin && (
          <div className="lg:hidden bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 p-6 absolute top-full left-0 right-0 z-50 shadow-xl space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="flex flex-col gap-3">
              {[
                { id: 'home', label: 'Home' },
                { id: 'about', label: 'About Us' },
                { id: 'services', label: 'Our Services' },
                { id: 'courses', label: 'Courses' },
                { id: 'student-portal', label: 'Student Portal' }
              ].map((m) => (
                <button 
                  key={m.id}
                  onClick={() => { 
                    if (m.id === 'student-portal') {
                      setAuthMode('login');
                    }
                    setPage(m.id); 
                    setHamburger(false); 
                    window.scrollTo({ top: 0 }); 
                  }}
                  className={`text-left text-sm py-2 font-semibold transition ${
                    page === m.id || (m.id === 'student-portal' && isPortalActive)
                      ? 'text-brand-secondary' 
                      : 'text-slate-600 dark:text-gray-300'
                  }`}
                >
                  · {m.label}
                </button>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-150 dark:border-slate-850 flex flex-col gap-3">
              <button 
                onClick={() => { setAuthMode('login'); setPage('student-portal'); setHamburger(false); window.scrollTo({ top: 0 }); }}
                className="w-full text-center py-2.5 bg-brand-accent dark:bg-slate-800 text-slate-700 dark:text-white font-bold rounded-xl text-xs cursor-pointer"
              >
                Student Login
              </button>
              <button 
                onClick={() => { setAuthMode('register'); setPage('student-portal'); setHamburger(false); window.scrollTo({ top: 0 }); }}
                className="w-full text-center py-2.5 bg-brand-primary text-white font-bold rounded-xl text-xs cursor-pointer"
              >
                Apply Online
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main container payload */}
      <main className="flex-grow">
        
        {/* Private workspaces routing */}
        {currentUser && (
          <StudentDashboard 
            user={currentUser} 
            onLogout={handleLogout} 
            onUpdateUser={(newUser) => setCurrentUser(newUser)}
          />
        )}

        {currentAdmin && (
          <AdminDashboard 
            onLogout={handleLogout}
          />
        )}

        {/* Public workspaces routing */}
        {!currentUser && !currentAdmin && (
          <>
            {page === 'home' && (
              <Home 
                onNavigate={(destination) => setPage(destination)} 
                onSelectCourse={(courseId) => handleApplyCourseFlow(courseId)} 
              />
            )}
            {page === 'about' && <About />}
            {page === 'services' && <Services />}
            {page === 'courses' && (
              <Courses 
                onNavigate={(destination) => setPage(destination)}
                onApplyCourse={(title) => {
                  setAuthMode('register');
                  setPage('student-portal');
                  window.scrollTo({ top: 0 });
                }}
              />
            )}
            
            {/* Unified Student Portal holding login, register, and admin-login */}
            {isPortalActive && (
              <Auth 
                onLoginSuccess={(stu) => { setCurrentUser(stu); setPage('dashboard'); }}
                onAdminLoginSuccess={(adm) => { setCurrentAdmin(adm); setPage('admin'); }}
                initialMode={authMode}
                courses={globalCourses}
              />
            )}
          </>
        )}

      </main>

      {/* Floating interactive utilities */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-30">
        
        {/* WhatsApp chat bubble launcher */}
        <button 
          onClick={triggerWhatsApp}
          className="w-12 h-12 bg-emerald-500 hover:bg-emerald-400 text-white rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 animate-float cursor-pointer"
          title="Instant chat on WhatsApp"
        >
          <MessageCircle className="w-5 h-5" />
        </button>

        {/* Back to top selector trigger */}
        {backToTop && (
          <button 
            onClick={handleScrollTop}
            className="w-12 h-12 bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:bg-brand-secondary hover:text-white rounded-full flex items-center justify-center shadow-lg transition duration-200 cursor-pointer"
            title="Scroll back to top"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Footer System standard constraints */}
      <footer className="bg-brand-primary text-gray-400 text-sm border-t border-white/5 py-16 px-6 mt-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white/5 text-brand-secondary flex items-center justify-center font-bold text-sm">EJ</div>
              <span className="font-bold text-white text-sm">EJaytech Concepts</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed font-medium">
              Innovating Ideas, Delivering Solutions. Custom web portals and technical training tracks built carefully to empower growing digital frontiers.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider">Quick Links</h4>
            <div className="flex flex-col gap-2.5 text-xs">
              {[
                { id: 'home', label: 'Home' },
                { id: 'about', label: 'About Us' },
                { id: 'services', label: 'Our Services' },
                { id: 'courses', label: 'Training Courses' },
                { id: 'student-portal', label: 'Student Portal Access' }
              ].map(lnk => (
                <button 
                  key={lnk.id}
                  onClick={() => { 
                    if (!currentUser && !currentAdmin) { 
                      if (lnk.id === 'student-portal') {
                        setAuthMode('login');
                      }
                      setPage(lnk.id); 
                      window.scrollTo({ top: 0, behavior: 'smooth'}); 
                    } 
                  }}
                  className="text-left hover:text-white transition cursor-pointer"
                >
                  · {lnk.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider">Services Stack</h4>
            <div className="flex flex-col gap-2 text-xs">
              <span className="flex items-center gap-1"><ChevronRight className="w-3 h-3 text-brand-secondary" /> Web Portals Development</span>
              <span className="flex items-center gap-1"><ChevronRight className="w-3 h-3 text-brand-secondary" /> Style Logo Brandings</span>
              <span className="flex items-center gap-1"><ChevronRight className="w-3 h-3 text-brand-secondary" /> Interactive UI/UX Wireframing</span>
              <span className="flex items-center gap-1"><ChevronRight className="w-3 h-3 text-brand-secondary" /> Advanced Certified Trainings</span>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider">Corporate Secretariat</h4>
            <p className="text-xs text-gray-400 leading-relaxed font-medium">
              No. 12 Capital Plaza, Suite 4B, Garki, Abuja, Nigeria. 
            </p>
            <p className="text-xs font-semibold text-brand-secondary mt-1">
              Main Line: +234 813 540 2154
            </p>
            <div className="pt-2 text-xs">
              {/* Backdoor for administrators logins */}
              <button 
                onClick={() => { setAuthMode('admin-login'); setPage('student-portal'); window.scrollTo({ top: 0, behavior: 'smooth'}); }}
                className="text-[10px] text-gray-500 hover:text-brand-secondary font-mono uppercase bg-white/5 px-2 py-1 rounded transition border border-white/5 cursor-pointer"
              >
                Admin Terminal Secure Login
              </button>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto border-t border-white/5 mt-12 pt-6 text-center text-xs text-gray-500 font-mono">
          <p>Copyright © 2026 EJaytech Concepts. All Rights Reserved. Fully Encrypted.</p>
        </div>
      </footer>

    </div>
  );
}
