/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Code, 
  Palette, 
  Laptop, 
  Settings, 
  ArrowRight, 
  Users, 
  Award, 
  CheckCircle, 
  MessageSquare, 
  Send,
  Zap
} from 'lucide-react';

interface HomeProps {
  onNavigate: (page: string) => void;
  onSelectCourse: (courseId: string) => void;
}

export default function Home({ onNavigate, onSelectCourse }: HomeProps) {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterMsg, setNewsletterMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const stats = [
    { label: 'Active Students', value: '450+', icon: Users },
    { label: 'Projects Completed', value: '120+', icon: CheckCircle },
    { label: 'Expert Mentors', value: '15+', icon: Award },
    { label: 'Success Solutions', value: '98%', icon: Zap },
  ];

  const featuredProjects = [
    {
      title: 'E-Commerce Unified Hub',
      desc: 'A robust web application featuring streamlined checkout workflows and intuitive dashboards.',
      category: 'Web Development',
      tech: 'React, Node, Tailwind',
      img: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&auto=format&fit=crop&q=60'
    },
    {
      title: 'Zenith Corporate Branding',
      desc: 'Formulated a comprehensive identity manual including logo designs and visual assets.',
      category: 'Branding',
      tech: 'InDesign, Figma, Illustrator',
      img: 'https://images.unsplash.com/photo-1561070791-26c113006238?w=600&auto=format&fit=crop&q=60'
    },
    {
      title: 'EduSphere Learning App',
      desc: 'A state-of-the-art interactive prototype oriented toward gamified children education programs.',
      category: 'UI/UX Design',
      tech: 'Figma, User Testing',
      img: 'https://images.unsplash.com/photo-1581291518655-9523c932ebcf?w=600&auto=format&fit=crop&q=60'
    }
  ];

  const testimonials = [
    {
      quote: "Studying Frontend Development at EJaytech completely transformed my career path. The mentors are highly supportive, and the custom student portal made tracking lessons straightforward.",
      author: "Chinedu Okafor",
      role: "Junior Web Developer",
      img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=60"
    },
    {
      quote: "EJaytech Concepts delivered a spectacular visual redesign of our school platform. They are absolute professionals who innovate with precision.",
      author: "Abiola Yusuf",
      role: "Operations Director, Lead Academics",
      img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=60"
    },
    {
      quote: "The Graphic Design curriculum is so practical. I secured two high-paying freelance clients on Upwork even before getting my official training certificate!",
      author: "Favour Benson",
      role: "Freelance Branding Artist",
      img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=60"
    }
  ];

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setIsSubmitting(true);
    setNewsletterMsg('');

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail })
      });
      const data = await res.json();
      if (res.ok) {
        setNewsletterMsg(data.message || 'Subscribed successfully!');
        setNewsletterEmail('');
      } else {
        setNewsletterMsg(data.error || 'Subscription failed.');
      }
    } catch {
      setNewsletterMsg('Connectivity issue. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-24 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-brand-primary text-white py-24 px-6 md:px-12 lg:px-24 rounded-3xl mx-4 mt-6 shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,168,255,0.15),transparent_50%)]"></div>
        <div className="relative max-w-5xl mx-auto flex flex-col md:flex-row items-center md:justify-between gap-12">
          <div className="flex-1 space-y-6 text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-brand-secondary/20 text-brand-secondary border border-brand-secondary/30">
              <Zap className="w-3.5 h-3.5 animate-pulse" /> Launching Technological Excellence
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Transforming Ideas Into <span className="text-brand-secondary">Digital Solutions</span>
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl leading-relaxed font-sans">
              Empowering businesses, organizations, ministries, schools, and individuals through innovative technology solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
              <button 
                id="hero-explore-courses-button"
                onClick={() => onNavigate('courses')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-brand-secondary hover:bg-brand-secondary/90 text-brand-primary hover:text-white font-bold rounded-xl transition duration-300 shadow-lg cursor-pointer transform hover:-translate-y-1"
              >
                Explore Courses <ArrowRight className="w-5 h-5" />
              </button>
              <button 
                id="hero-student-portal-button"
                onClick={() => onNavigate('student-portal')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-transparent border border-white/30 hover:border-white hover:bg-white/10 text-white font-semibold rounded-xl transition duration-300 cursor-pointer"
              >
                Student Portal
              </button>
            </div>
          </div>
          <div className="flex-1 relative max-w-md w-full md:block">
            <div className="absolute inset-0 bg-brand-secondary rounded-2xl blur-2xl opacity-10 animate-pulse"></div>
            <img 
              src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop&q=60" 
              alt="EJaytech Digital Innovation Workstation" 
              className="rounded-2xl shadow-2xl relative border border-white/10 object-cover w-full h-[380px]"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </section>

      {/* Brief Company Introduction Section */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-200 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-4 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#00a8ff]">Corporate Introduction</span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-brand-primary tracking-tight">Who We Are</h2>
          </div>
          <div className="lg:col-span-8 text-gray-600 text-sm md:text-base leading-relaxed space-y-4">
            <p>
              EJaytech Concepts is a progressive technology firm and standard digital training hub centered in Nigeria. We specialize in partnering with growing brands, educational institutions, private academies, religious organizations, and ministries to unlock clean, highly intuitive, and modern online architectures.
            </p>
            <p>
              By combining robust full-stack software production processes with highly accessible, practical, hands-on student mentoring pathways, we prepare businesses to expand and equip regional talents to excel in the global gig economy.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Services/Professional Services Overview */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="text-center space-y-4 mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-secondary bg-brand-accent px-3.5 py-1.5 rounded-full">Core Expertise</span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">Featured Services</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
            We deliver tailor-made technical and graphic answers that ensure your company or ministry stands out in the global landscape.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              title: "Web Development",
              desc: "Building highly interactive business, church, educational, and corporate school web assets.",
              icon: Code,
            },
            {
              title: "Graphic Design",
              desc: "From sleek promotional flyers and logo guidelines to banners that establish true corporate authority.",
              icon: Palette,
            },
            {
              title: "IT Support",
              desc: "Top-tier custom software installs, secure private network configurations, and rapid continuous maintenance support.",
              icon: Laptop,
            },
            {
              title: "Digital Solutions",
              desc: "Interactive technical consultations, digital marketing pathways, and career-oriented visual trainings.",
              icon: Settings,
            }
          ].map((srv, idx) => (
            <div 
              key={idx}
              className="bg-brand-accent rounded-2xl p-6 border border-slate-100 hover:border-brand-secondary/30 transition-all duration-300 hover:shadow-xl group"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-primary text-brand-secondary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <srv.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-brand-primary mb-3">{srv.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">{srv.desc}</p>
              <button 
                onClick={() => onNavigate('services')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-secondary hover:text-brand-primary transition-colors cursor-pointer"
              >
                Learn More <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose EJaytech Concepts */}
      <section className="bg-brand-accent py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-secondary">Values that empower</span>
            <h2 className="text-3xl md:text-4xl font-bold text-brand-primary tracking-tight">
              Why Choose EJaytech Concepts
            </h2>
            <p className="text-slate-600 leading-relaxed text-sm md:text-base">
              We don't just deliver technology—we cultivate ecosystems that inspire innovation. Here is why we are trusted to build custom systems for schools, agencies, and top creative professionals:
            </p>
            <div className="space-y-4 pt-2">
              {[
                { title: 'Excellence & Precision', desc: 'Every line of code and branding line is built using global best production standards.' },
                { title: 'Real-World Practical Learning', desc: 'Our students work on live server prototypes and get direct professional feedback.' },
                { title: 'Reliable IT & Support Channels', desc: 'Continuous client care means you are never left offline when systems evolve.' }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-secondary text-brand-primary flex items-center justify-center font-bold text-sm mt-0.5">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-brand-primary">{item.title}</h4>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&auto=format&fit=crop&q=60" alt="Mentoring" className="rounded-2xl object-cover h-64 w-full shadow-md" referrerPolicy="no-referrer" />
              <div className="bg-brand-primary text-brand-secondary p-6 rounded-2xl shadow-md text-center">
                <p className="text-3xl font-extrabold text-white">100%</p>
                <p className="text-xs font-semibold uppercase tracking-wider mt-1">Practical Labs</p>
              </div>
            </div>
            <div className="space-y-4 pt-10">
              <div className="bg-brand-secondary text-brand-primary p-6 rounded-2xl shadow-md text-center">
                <p className="text-3xl font-extrabold">24/7</p>
                <p className="text-xs font-bold uppercase tracking-wider mt-1">Client Care</p>
              </div>
              <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&auto=format&fit=crop&q=60" alt="Tech" className="rounded-2xl object-cover h-64 w-full shadow-md" referrerPolicy="no-referrer" />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects Portfolio Section */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-secondary">Case Handlings</span>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Featured Projects</h2>
            <p className="text-gray-600 max-w-xl text-sm md:text-base">
              Take a tour of visual models and client systems delivered by our software engineers and designers.
            </p>
          </div>
          <button 
            id="view-all-services-projects"
            onClick={() => onNavigate('services')}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-brand-secondary text-white hover:text-brand-primary font-bold rounded-xl transition duration-300 cursor-pointer text-xs md:text-sm"
          >
            Explore Services Stack <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredProjects.map((p, idx) => (
            <div key={idx} className="bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-xl transition duration-300 group">
              <div className="relative overflow-hidden h-48 bg-slate-100">
                <img 
                  src={p.img} 
                  alt={p.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-4 left-4 inline-block text-xs font-bold bg-brand-primary/90 text-brand-secondary px-2.5 py-1 rounded-md uppercase">
                  {p.category}
                </span>
              </div>
              <div className="p-6 space-y-4">
                <h3 className="text-lg font-bold text-slate-900">{p.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{p.desc}</p>
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xs font-mono text-gray-500 bg-brand-accent px-2.5 py-1 rounded">
                    {p.tech}
                  </span>
                  <button 
                    onClick={() => onNavigate('services')}
                    className="text-xs font-semibold text-brand-secondary hover:text-brand-primary flex items-center gap-1 cursor-pointer"
                  >
                    View Details →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Statistics Counter */}
      <section className="bg-brand-primary text-white py-16 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <div key={i} className="text-center space-y-2">
              <div className="mx-auto w-10 h-10 rounded-lg bg-white/5 text-brand-secondary flex items-center justify-center mb-2">
                <s.icon className="w-5 h-5" />
              </div>
              <p className="text-3xl md:text-4xl font-extrabold text-brand-secondary font-display">{s.value}</p>
              <p className="text-xs md:text-sm text-gray-400 font-semibold tracking-wider uppercase">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Student Success Highlights / Testimonials Section */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="text-center space-y-4 mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#00a8ff]">Real Student Metrics</span>
          <h2 className="text-3xl font-bold text-slate-900">Student Success Highlights</h2>
          <p className="text-gray-600 max-w-xl mx-auto text-sm md:text-base">
            From zero coding knowledge to securing international freelance contracts—listen to live testimonials of our graduates.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div key={idx} className="bg-brand-accent rounded-2xl p-8 relative flex flex-col justify-between border border-slate-100">
              <MessageSquare className="absolute top-6 right-6 w-8 h-8 text-brand-secondary/20" />
              <p className="text-slate-700 text-sm leading-relaxed italic mb-6">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-4">
                <img src={t.img} alt={t.author} className="w-12 h-12 rounded-full object-cover border-2 border-brand-secondary" referrerPolicy="no-referrer" />
                <div>
                  <h4 className="text-sm font-bold text-brand-primary">{t.author}</h4>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call To Action (CTA) Section */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="bg-slate-900 text-white rounded-3xl p-10 md:p-16 text-center space-y-8 relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,168,255,0.1),transparent_70%)]"></div>
          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Ready to Expand Your <span className="text-brand-secondary">Digital Frontiers?</span>
            </h2>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed">
              Unlock verified technology templates, high-speed agency support, or start professional certified programming cohorts today. Access our secure dashboard to monitor custom course materials.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <button 
                onClick={() => onNavigate('courses')}
                className="px-8 py-4 bg-brand-secondary text-brand-primary font-bold rounded-xl text-sm hover:bg-white hover:text-brand-primary transition duration-300 cursor-pointer shadow-lg"
              >
                Explore Training Courses
              </button>
              <button 
                onClick={() => onNavigate('student-portal')}
                className="px-8 py-4 bg-transparent border border-white/20 hover:border-white text-white font-bold rounded-xl text-sm hover:bg-white/10 transition duration-300 cursor-pointer"
              >
                Access Student Portal
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="max-w-5xl mx-auto px-6">
        <div className="bg-gradient-to-r from-brand-primary to-[#1e2d44] text-white rounded-3xl p-8 md:p-12 shadow-xl border border-white/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(0,168,255,0.1),transparent_40%)]"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-lg text-center md:text-left">
              <h3 className="text-2xl md:text-3xl font-bold text-white">Subscribe to Technology & Career Newsletters</h3>
              <p className="text-sm text-gray-300">
                Receive visual industry tips, software guides, and exclusive discount coupons for our intensive training cycles directly to your inbox.
              </p>
            </div>
            <form onSubmit={handleNewsletter} className="w-full max-w-md space-y-3">
              <div className="flex overflow-hidden rounded-xl bg-white/10 border border-white/20 focus-within:border-brand-secondary transition">
                <input 
                  type="email" 
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Your perfect email address" 
                  className="bg-transparent text-white placeholder-gray-400 px-4 py-3.5 flex-grow text-sm focus:outline-none"
                  required
                />
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-brand-secondary hover:bg-brand-secondary/90 text-brand-primary font-bold px-6 py-3.5 text-sm transition cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSubmitting ? '...' : 'Subscribe'} <Send className="w-4 h-4" />
                </button>
              </div>
              {newsletterMsg && (
                <p className="text-xs font-semibold text-brand-secondary text-center md:text-left">
                  {newsletterMsg}
                </p>
              )}
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
