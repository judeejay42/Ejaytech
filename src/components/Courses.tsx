/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Clock, 
  CreditCard, 
  ArrowRight, 
  Check, 
  ShieldCheck, 
  ChevronDown, 
  ChevronUp,
  Award,
  Star,
  Users,
  MessageSquare,
  Sparkles,
  Calendar,
  User,
  ArrowLeft
} from 'lucide-react';
import { Course, BlogPost } from '../types';

interface CoursesProps {
  onNavigate: (page: string) => void;
  onApplyCourse: (courseTitle: string) => void;
}

export default function Courses({ onNavigate, onApplyCourse }: CoursesProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);

  // Consolidated Blog features
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [activeArticle, setActiveArticle] = useState<BlogPost | null>(null);
  const [loadingBlogs, setLoadingBlogs] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/courses');
        const data = await res.json();
        if (data.courses) {
          setCourses(data.courses);
        }
      } catch (err) {
        console.error('Error fetching courses list', err);
      } finally {
        setLoading(false);
      }

      try {
        const resBlogs = await fetch('/api/blogs');
        const dataBlogs = await resBlogs.json();
        if (dataBlogs.blogs) {
          setBlogs(dataBlogs.blogs);
        }
      } catch (err) {
        console.error('Error fetching blogs in Courses', err);
      } finally {
        setLoadingBlogs(false);
      }
    }
    fetchData();
  }, []);

  const toggleExpand = (id: string) => {
    if (expandedCourse === id) {
      setExpandedCourse(null);
    } else {
      setExpandedCourse(id);
    }
  };

  // Course specs: Duration, Mode, Requirements, Things You Will Learn, etc.
  const localCourseSpecs: Record<string, { 
    learns: string[], 
    requirements: string, 
    mode: string, 
    banner: string 
  }> = {
    'course-1': {
      learns: ['HTML5 Standard & Semantics', 'CSS3 Layouts, Grid, Flexbox', 'Vanilla JavaScript (ES6+)', 'Bootstrap 5 Framework', 'Responsive Visual Design', 'Git & GitHub Workflows', 'Live Cloud Server Deployment'],
      requirements: 'Basic computer appreciation, personal laptop (at least 4GB RAM), and commitment to 6 hours vectors/class hours weekly.',
      mode: 'Hybrid (Physical Islamabad/Abuja Lab classes & Recorded Zoom sessions)',
      banner: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&auto=format&fit=crop&q=60'
    },
    'course-2': {
      learns: ['Canva Design System Integration', 'Photoshop Advanced Compositions', 'Visual Branding Manuals', 'Logo Typography & Concepting', 'Promotional Social Media Ad Flyers', 'Print Layouts & Vector Basics'],
      requirements: 'Personal laptop, reliable internet, pre-loaded Adobe Creative Cloud (or access to Canva Pro).',
      mode: 'Hybrid (Weekend physical practical arrays or 100% online stream)',
      banner: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&auto=format&fit=crop&q=60'
    },
    'course-3': {
      learns: ['User Research Techniques', 'Interactive wireframing (Lo-fi)', 'High Fidelity Prototyping', 'Figma Design System Libraries', 'Usability Evaluation Labs', 'Developer handoff specs'],
      requirements: 'Personal web-enabled laptop (at least 8GB RAM recommended), Figma account, passion for modern customer workflows.',
      mode: 'Hybrid (Weekly Abuja physical class + Online collaborative Figma spaces)',
      banner: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&auto=format&fit=crop&q=60'
    },
    'course-4': {
      learns: ['Freelance Profile setup (Upwork, Fiverr)', 'Creating high-response Proposals', 'Personal Branding & LinkedIn setups', 'Digital Marketing funnel systems', 'Personal Content Calendars'],
      requirements: 'Smart phone or basic computer, open mind to online marketing trends, and 4 hours research weekly.',
      mode: '100% Online (Live Interactive Zoom meetings + Dedicated WhatsApp mentoring group)',
      banner: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60'
    }
  };

  const courseTestimonials = [
    {
      quote: "The Frontend Web Development training completely shifted my trajectory. The lessons on CSS Grid, Bootstrap, and responsive coding were extremely detailed. Today, I build standard portals for private clients.",
      author: "Yusuf Sani",
      role: "Frontend Graduate"
    },
    {
      quote: "Amara Okonkwo's UI/UX tutoring was gold. I went from drawing crude wireframes to assembling beautiful Design Systems in Figma. The Abuja physical lab holds incredible creative vibes.",
      author: "Chioma Nze",
      role: "Figma UI/UX Alumna"
    }
  ];

  return (
    <div className="space-y-24 py-6 pb-20 max-w-7xl mx-auto px-6">
      {/* Page Header */}
      <section className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-widest text-[#00a8ff] bg-brand-accent px-3.5 py-1.5 rounded-full">
          Vocational Training Programs
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-brand-primary tracking-tight">
          Explore Our <span className="text-brand-secondary">Specialized Courses</span>
        </h1>
        <p className="text-gray-600 text-sm md:text-base leading-relaxed">
          EJaytech Concepts delivers real-world, highly practical digital training paths to fast-track your tech career.
        </p>
      </section>

      {/* Courses Catalog Block */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4 text-slate-500 font-mono text-sm leading-none uppercase">
          <div className="w-10 h-10 border-4 border-brand-secondary border-t-transparent rounded-full animate-spin"></div>
          <p>Compiling curriculum schedules...</p>
        </div>
      ) : (
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {courses.map((course) => {
            const spec = localCourseSpecs[course.id] || { 
              learns: [], 
              requirements: 'Basic laptop appreciation & motivation.', 
              mode: 'Hybrid Interaction Class', 
              banner: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60' 
            };
            const isExpanded = expandedCourse === course.id;

            return (
              <div 
                key={course.id} 
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 transition duration-300 hover:shadow-2xl flex flex-col justify-between"
              >
                <div>
                  {/* Photo Banner */}
                  <div className="relative h-56 w-full">
                    <img 
                      src={spec.banner} 
                      alt={course.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    <span className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-brand-secondary text-brand-primary">
                      <BookOpen className="w-3.5 h-3.5" /> Job-Ready Certification
                    </span>
                  </div>

                  {/* Core Descriptions */}
                  <div className="p-6 space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-2xl font-extrabold text-brand-primary font-display">{course.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{course.description}</p>
                    </div>

                    {/* Stats Strip */}
                    <div className="grid grid-cols-2 gap-4 bg-brand-accent p-4 rounded-xl text-xs sm:text-sm font-semibold text-brand-primary">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-brand-secondary" />
                        <span><strong>Duration:</strong> {course.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-brand-secondary" />
                        <span><strong>Fee:</strong> {course.fee}</span>
                      </div>
                    </div>

                    {/* Technical details (Mode & Requirements) */}
                    <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs sm:text-sm">
                      <p className="text-slate-700">
                        <strong>Training Mode:</strong> <span className="text-brand-primary font-medium">{spec.mode}</span>
                      </p>
                      <p className="text-slate-700">
                        <strong>Requirements:</strong> <span className="text-slate-600 italic">{spec.requirements}</span>
                      </p>
                    </div>

                    {/* Things you will learn (Bulleted) */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-extrabold text-brand-primary uppercase tracking-wider">Things You Will Learn:</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {spec.learns.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                            <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Syllabus expanding drawer */}
                    <div className="border-t border-slate-100 pt-4">
                      <button 
                        onClick={() => toggleExpand(course.id)}
                        className="flex items-center justify-between w-full text-left text-xs font-bold text-slate-500 hover:text-brand-secondary transition cursor-pointer"
                      >
                        <span>VIEW MODULE SYLLABUS LESSONS ({course.syllabus?.length || 0})</span>
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>

                      {isExpanded && course.syllabus && (
                        <div className="mt-3 space-y-2.5 pl-2 border-l-2 border-brand-secondary/30">
                          {course.syllabus.map((lesson, idx) => (
                            <div key={idx} className="text-xs text-slate-600 flex gap-2">
                              <span className="font-mono text-brand-secondary font-bold">Week {idx + 1}:</span>
                              <span>{lesson}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Apply Buttons & Action */}
                <div className="p-6 bg-brand-accent/30 border-t border-slate-100 flex gap-4">
                  <button 
                    onClick={() => onApplyCourse(course.title)}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-brand-primary hover:bg-brand-secondary text-white hover:text-brand-primary font-bold rounded-xl transition cursor-pointer text-xs md:text-sm"
                  >
                    Apply Now <ArrowRight className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => onNavigate('student-portal')}
                    className="px-4 py-3.5 text-center text-xs md:text-sm font-bold text-slate-600 hover:text-brand-primary transition cursor-pointer"
                  >
                    Student Space Login
                  </button>
                </div>
              </div>
            );
          })}
        </section>
      )}

      {/* Course Specific Testimonials */}
      <section id="course-page-testimonials" className="bg-brand-accent py-12 px-6 rounded-3xl border border-slate-100">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <Sparkles className="w-8 h-8 text-brand-secondary mx-auto" />
            <h3 className="text-2xl font-bold text-brand-primary">Student Reviews & Accreditations</h3>
            <p className="text-slate-600 text-xs md:text-sm">Read what past students of our creative cohorts report.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {courseTestimonials.map((t, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative flex flex-col justify-between">
                <MessageSquare className="absolute top-4 right-4 w-6 h-6 text-brand-secondary/20" />
                <p className="text-slate-700 text-xs md:text-sm italic leading-relaxed mb-4">
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-brand-primary text-brand-secondary font-bold flex items-center justify-center text-xs">
                    {t.author.charAt(0)}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-800">{t.author}</h5>
                    <p className="text-[10px] text-gray-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Consolidated Professional Blog (Integrated directly here as requested!) */}
      <section id="news-insights-blog-integration" className="border-t border-slate-100 pt-16 space-y-12">
        {activeArticle ? (
          <div className="space-y-8 bg-brand-accent p-6 md:p-10 rounded-3xl border border-slate-200">
            <button 
              onClick={() => setActiveArticle(null)}
              className="inline-flex items-center gap-2 text-xs md:text-sm font-bold text-slate-500 hover:text-brand-secondary transition cursor-pointer bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100"
            >
              <ArrowLeft className="w-4 h-4" /> Back to News & Insights
            </button>

            <article className="max-w-3xl mx-auto space-y-8">
              <div className="space-y-4 text-center md:text-left">
                <span className="inline-block px-3 py-1 bg-brand-primary text-brand-secondary text-xs uppercase font-bold rounded">
                  {activeArticle.category}
                </span>
                <h2 className="text-2xl md:text-4xl font-extrabold text-brand-primary tracking-tight leading-tight">
                  {activeArticle.title}
                </h2>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-slate-500 pt-2 border-b border-slate-100 pb-4">
                  <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> By {activeArticle.author}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {activeArticle.date}</span>
                  <span>Read Time: {activeArticle.readTime}</span>
                </div>
              </div>

              <div className="h-64 md:h-96 w-full rounded-2xl overflow-hidden shadow-sm bg-slate-100">
                <img 
                  src={activeArticle.imageUrl} 
                  alt={activeArticle.title} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="text-slate-700 leading-relaxed text-sm md:text-base space-y-6">
                <p className="font-semibold text-brand-primary text-sm md:text-base italic bg-white p-5 rounded-xl border-l-4 border-brand-secondary shadow-sm leading-relaxed">
                  "{activeArticle.excerpt}"
                </p>
                <div className="whitespace-pre-line text-xs sm:text-sm md:text-base">{activeArticle.content}</div>
              </div>
            </article>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[#00a8ff]">Corporate Blog</span>
              <h3 className="text-2xl md:text-3xl font-extrabold text-brand-primary">Our News & Insights</h3>
              <p className="text-gray-600 text-xs md:text-sm">
                Get up-to-date visual career tips, branding guidelines, and digital technology analysis.
              </p>
            </div>

            {loadingBlogs ? (
              <div className="text-center py-10 font-mono text-xs text-slate-400">Loading insights archives...</div>
            ) : blogs.length === 0 ? (
              <div className="text-center py-10 text-slate-500 font-mono text-xs">No posts available at this time.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogs.slice(0, 3).map((post) => (
                  <div 
                    key={post.id} 
                    className="bg-white rounded-3xl overflow-hidden border border-slate-200 hover:shadow-xl transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="h-44 w-full bg-slate-200 relative">
                        <img 
                          src={post.imageUrl} 
                          alt={post.title} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute top-4 left-4 bg-brand-primary text-white text-[10px] font-bold px-2.5 py-1 roundeduppercase">
                          {post.category}
                        </span>
                      </div>

                      <div className="p-6 space-y-3">
                        <div className="text-[10px] font-mono text-slate-500 font-semibold">{post.date} • {post.readTime}</div>
                        <h4 className="text-base font-bold text-brand-primary line-clamp-2 leading-snug">{post.title}</h4>
                        <p className="text-slate-500 text-xs leading-relaxed line-clamp-3">{post.excerpt}</p>
                      </div>
                    </div>

                    <div className="p-6 pt-0">
                      <button 
                        onClick={() => {
                          setActiveArticle(post);
                          // Scroll into view gently
                          document.getElementById('news-insights-blog-integration')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-secondary hover:text-brand-primary transition cursor-pointer"
                      >
                        Read Post Insights <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* Trust & Accreditations strip */}
      <section className="bg-brand-primary text-white rounded-3xl p-8 text-center space-y-6">
        <div className="max-w-2xl mx-auto space-y-2">
          <ShieldCheck className="w-12 h-12 text-brand-secondary mx-auto animate-pulse" />
          <h3 className="text-xl md:text-2xl font-bold">EJaytech Concepts Standard of Professionalism</h3>
          <p className="text-gray-300 text-xs md:text-sm leading-relaxed">
            Upon successful implementation of your core capstone student project and 80%+ cumulative evaluation scores, you are issued an official, verifiable digital training certificate signed by lead software architects.
          </p>
        </div>
      </section>
    </div>
  );
}
