/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Target, 
  Eye, 
  Shield, 
  Users, 
  Award, 
  Star, 
  Phone, 
  Mail, 
  MapPin, 
  Send, 
  MessageSquare, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  CheckCircle,
  HelpCircle,
  BookOpen
} from 'lucide-react';

export default function About() {
  const [form, setForm] = useState({ fullname: '', email: '', subject: '', message: '' });
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const values = [
    { title: 'Excellence', desc: 'We maintain rigid quality bars on every visual and software solution we architect.', icon: Award },
    { title: 'Innovation', desc: 'Continuously refining our syllabus & approaches to keep pace with global patterns.', icon: Star },
    { title: 'Integrity', desc: 'Transparent transactions, absolute security of user data, and zero hidden overheads.', icon: Shield },
    { title: 'Professionalism', desc: 'Expert developers & branding counselors supporting you from start to graduation.', icon: Users }
  ];

  const team = [
    {
      name: "Elijah Yahuza",
      role: "Lead Software Architect & Branding Consultant",
      bio: "10+ years architecting web portals, visual systems, and digital ecosystems for companies, school boards, and ministries.",
      img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=60"
    },
    {
      name: "Amara Okonkwo",
      role: "Lead Graphic Artist & UI Coordinator",
      bio: "Figma & Adobe suite expert focused on translating intricate business models into responsive and intuitive prototypes.",
      img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=60"
    }
  ];

  const faqList = [
    { q: 'How does the application process work at EJaytech Concepts?', a: 'Applying is simple! Choose a course under the Courses page, fill in the Registration form, and receive your unique Student ID automatically. Once our administrator reviews and approves your submission, you will receive an approval email.' },
    { q: 'Can I pay for my professional courses in instalments?', a: 'Yes! We support flexible fee options. You can pay 60% upon registration approval and the remaining balance midway through your learning cycle.' },
    { q: 'Is there a physical training option or is it strictly online?', a: 'We offer an interactive hybrid model. Physical sessions take place at our Abuja office, while regional and global students attend live online coding classes with recorded access.' },
    { q: 'What certification will I receive after graduation?', a: 'You will receive an official, verifiable Certificate of Completion detailing your capstone projects, stack focus, and core training hours at EJaytech Concepts.' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullname || !form.email || !form.subject || !form.message) {
      setError('Please fill in all information parameters.');
      return;
    }

    setLoading(true);
    setMsg('');
    setError('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.ok) {
        setMsg(data.message || 'Thank you! Your message was transmitted.');
        setForm({ fullname: '', email: '', subject: '', message: '' });
      } else {
        setError(data.error || 'Transmission failed.');
      }
    } catch {
      setError('Connectivity issue. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const triggerWhatsApp = () => {
    const text = encodeURIComponent('Hello EJaytech Concepts! I am interested in inquiring about your custom courses & training solutions.');
    window.open(`https://wa.me/2348135402154?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-24 py-6 pb-20 max-w-7xl mx-auto px-6">
      {/* Page Title & Who We Are */}
      <section className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-widest text-brand-secondary bg-brand-accent px-3.5 py-1.5 rounded-full">
          Get to Know Us
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-brand-primary tracking-tight">
          Who We Are at <span className="text-brand-secondary">EJaytech Concepts</span>
        </h1>
        <p className="text-gray-600 text-lg leading-relaxed text-sm md:text-base">
          EJaytech Concepts is a premium tech & digital solutions firm committed to helping software startups, businesses, organizations, ministries, and students establish dominant digital footprints.
        </p>
      </section>

      {/* Main Narrative card */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-brand-accent p-8 md:p-12 rounded-3xl border border-slate-100">
        <div className="relative">
          <div className="absolute -top-3 -left-3 w-12 h-12 bg-brand-secondary rounded-xl -z-10 opacity-30"></div>
          <img 
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=60" 
            alt="Collaborative session at EJaytech Concepts" 
            className="rounded-2xl shadow-lg w-full object-cover h-[350px]"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-brand-primary tracking-tight">Our Passion & Legacy</h2>
          <p className="text-slate-700 leading-relaxed text-sm md:text-base">
            We operate at the busy intersection of industrial design, visual design systems, software engineering, and community-driven tech skill integration. Our core purpose is two-fold:
          </p>
          <ul className="space-y-3 pt-2 text-sm text-slate-600">
            <li className="flex items-start gap-2">
              <span className="text-brand-secondary font-bold text-lg leading-none select-none">•</span>
              <span><strong>Building Robust Solutions:</strong> Custom databases, branding portfolios, flyers, business sheets, and responsive deployment pathways for worldwide businesses.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-secondary font-bold text-lg leading-none select-none">•</span>
              <span><strong>Empowering Students:</strong> Translating complicated technologies into digestible, step-by-step practical modules that pave the way toward rewarding tech careers.</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Mission & Vision Bento */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-brand-primary text-white p-8 md:p-12 rounded-3xl shadow-xl flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-secondary rounded-full -z-5 blur-3xl opacity-10 group-hover:scale-125 transition-transform duration-500"></div>
          <div className="space-y-6">
            <div className="w-12 h-12 rounded-xl bg-white/5 text-brand-secondary flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-extrabold text-white">Our Mission Statement</h3>
            <p className="text-gray-300 leading-relaxed text-sm md:text-base">
              To provide robust, cutting-edge, and highly affordable technology solutions and skill development paths that supercharge businesses, agencies, and career-centric individuals.
            </p>
          </div>
          <span className="text-slate-500 text-xs mt-10 tracking-widest uppercase">EJaytech Concepts • Pursuit of Excellence</span>
        </div>

        <div className="bg-slate-900 text-white p-8 md:p-12 rounded-3xl shadow-xl flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-secondary rounded-full -z-5 blur-3xl opacity-10 group-hover:scale-125 transition-transform duration-500"></div>
          <div className="space-y-6">
            <div className="w-12 h-12 rounded-xl bg-white/5 text-brand-secondary flex items-center justify-center">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-extrabold text-brand-secondary">Our Vision Statement</h3>
            <p className="text-gray-300 leading-relaxed text-sm md:text-base">
              To become the most reliable globally aligned digital agency and career accelerator in Africa, trusted by millions for professional software code and visually supreme brand designs.
            </p>
          </div>
          <span className="text-slate-500 text-xs mt-10 tracking-widest uppercase">EJaytech Concepts • Future Blueprint</span>
        </div>
      </section>

      {/* Core Values */}
      <section className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-slate-900">Our Strategic Core Values</h2>
          <p className="text-gray-600 max-w-xl mx-auto text-sm md:text-base">
            These structural principles dictate how we assemble software, compile learning schedules, and maintain partner communications.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((v, i) => (
            <div key={i} className="p-6 rounded-2xl border border-slate-100 bg-white hover:shadow-lg transition">
              <div className="w-10 h-10 rounded-lg bg-brand-accent text-brand-primary flex items-center justify-center mb-6">
                <v.icon className="w-5 h-5 text-brand-secondary" />
              </div>
              <h4 className="text-lg font-bold text-brand-primary mb-2">{v.title}</h4>
              <p className="text-gray-500 text-xs md:text-sm leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Our Story Section */}
      <section className="max-w-4xl mx-auto space-y-8 bg-white p-8 md:p-12 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 text-brand-secondary">
          <BookOpen className="w-6 h-6" />
          <h2 className="text-2xl md:text-3xl font-bold text-brand-primary">Our Story</h2>
        </div>
        <div className="text-gray-600 text-sm md:text-base leading-relaxed space-y-4">
          <p>
            Founded with a clear dream of bridging the digital divide in our community, EJaytech Concepts was established to provide practical skills and innovative client systems. Our journey began with a passionate group of technology engineers offering localized IT support and creative brand artwork development.
          </p>
          <p>
            As demands for high-integrity web platforms and mobile-friendly school databases accelerated, we unified our offerings into a full-scale corporate agency. Today, EJaytech Concepts is recognized both as a dynamic software engineering hub and a certified vocational training center, where students work on real-world projects and build genuine professional careers.
          </p>
        </div>
      </section>

      {/* Our Team Section */}
      <section className="space-y-12 bg-brand-accent p-8 md:p-12 rounded-3xl border border-slate-100">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-brand-primary">Our Team</h2>
          <p className="text-slate-600 text-sm md:text-base">
            Learn directly from active visual creators, branding specialists, and senior backend engineers committed to your success.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {team.map((t, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col md:flex-row gap-6 items-center">
              <img 
                src={t.img} 
                alt={t.name} 
                className="w-24 h-24 rounded-full object-cover border-4 border-brand-accent flex-shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="space-y-2 text-center md:text-left">
                <h4 className="text-lg font-bold text-brand-primary">{t.name}</h4>
                <p className="text-xs font-semibold text-brand-secondary uppercase">{t.role}</p>
                <p className="text-slate-500 text-xs leading-relaxed">{t.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact-integration-section" className="space-y-12">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-[#00a8ff]">Get In Touch</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-brand-primary">Contact Information</h2>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed">
            Have an elaborate enterprise project to build, or would you like to enroll in an upcoming practical tech cohort? Send us a message today!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Contact details */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <a 
                href="tel:+2348135402154"
                className="flex items-start gap-4 p-5 rounded-2xl border border-slate-100 bg-brand-accent hover:border-brand-secondary/30 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-primary text-brand-secondary flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0 animate-pulse">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Phone Number</h4>
                  <p className="text-xs md:text-sm text-gray-500 font-semibold mt-0.5">+234 813 540 2154</p>
                </div>
              </a>

              <button 
                onClick={triggerWhatsApp}
                className="w-full text-left flex items-start gap-4 p-5 rounded-2xl border border-slate-100 bg-brand-accent hover:border-brand-secondary/30 transition-all group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">WhatsApp Number</h4>
                  <p className="text-xs md:text-sm text-gray-500 font-semibold mt-0.5">+234 813 540 2154 (Live Chat)</p>
                </div>
              </button>

              <a 
                href="mailto:info@ejaytech.com"
                className="flex items-start gap-4 p-5 rounded-2xl border border-slate-100 bg-brand-accent hover:border-brand-secondary/30 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-primary text-brand-secondary flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0 animate-pulse">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Email Address</h4>
                  <p className="text-xs md:text-sm text-gray-500 font-semibold mt-0.5">info@ejaytech.com</p>
                </div>
              </a>

              <div className="flex items-start gap-4 p-5 rounded-2xl border border-slate-100 bg-brand-accent group">
                <div className="w-10 h-10 rounded-xl bg-brand-primary text-brand-secondary flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Physical Address</h4>
                  <p className="text-xs md:text-sm text-gray-500 font-semibold mt-0.5">No. 12 Capital Plaza, Suite 4B, Garki, Abuja, Nigeria</p>
                </div>
              </div>
            </div>

            {/* Social accounts */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Join our Social Networks</h4>
              <div className="flex gap-3">
                {[
                  { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
                  { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
                  { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
                  { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' }
                ].map((soc, i) => (
                  <a 
                    key={i} 
                    href={soc.href}
                    title={soc.label}
                    target="_blank"
                    rel="noreferrer"
                    className="w-10 h-10 rounded-full border border-slate-200 text-slate-500 hover:text-brand-secondary hover:border-brand-secondary flex items-center justify-center transition cursor-pointer"
                  >
                    <soc.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div className="lg:col-span-7 bg-white p-6 md:p-10 rounded-3xl border border-slate-200">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Online Contact Form</h3>
            <p className="text-xs md:text-sm text-gray-500 mb-6">
              Drop detailed questions, and we will get back to you inside 24 working hours.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-slate-600">Full Name</label>
                  <input 
                    type="text" 
                    value={form.fullname}
                    onChange={(e) => setForm({ ...form, fullname: e.target.value })}
                    placeholder="e.g. John Doe"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-brand-secondary rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none transition-all"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-slate-600">Email Address</label>
                  <input 
                    type="email" 
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="e.g. johndoe@gmail.com"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-brand-secondary rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-slate-600">Subject</label>
                <input 
                  type="text" 
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  placeholder="e.g. Inquiring about Frontend Web Development Cohort"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-brand-secondary rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none transition-all"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-slate-600">Message</label>
                <textarea 
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Describe your goals or project specifications..."
                  className="w-full bg-slate-50 border border-slate-200 focus:border-brand-secondary rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none transition-all h-[130px] resize-none"
                  required
                ></textarea>
              </div>

              {msg && (
                <p className="text-xs md:text-sm font-semibold text-emerald-600 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4" /> {msg}
                </p>
              )}

              {error && (
                <p className="text-xs md:text-sm font-semibold text-rose-500">
                  {error}
                </p>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-brand-primary text-white hover:bg-brand-secondary hover:text-brand-primary font-bold rounded-xl transition cursor-pointer text-sm"
              >
                {loading ? 'Submitting Form...' : 'Submit Message'} <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Interactive FAQs Section */}
      <section className="bg-brand-accent p-8 md:p-12 rounded-3xl border border-slate-100">
        <div className="text-center space-y-4 max-w-2xl mx-auto mb-10">
          <HelpCircle className="w-8 h-8 text-brand-secondary mx-auto" />
          <h2 className="text-2xl md:text-3xl font-bold text-brand-primary">Frequently Answered Questions</h2>
          <p className="text-slate-600 text-xs md:text-sm">
            Everything you need to learn regarding registration checklists, certificates, and school parameters.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          {faqList.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div 
                key={idx} 
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden transition duration-200 shadow-sm"
              >
                <button 
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full px-6 py-4 text-left font-bold text-brand-primary text-sm md:text-base flex justify-between items-center hover:bg-slate-50 transition cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <span className="text-lg font-mono text-brand-secondary">{isOpen ? '−' : '+'}</span>
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-xs md:text-sm text-slate-600 leading-relaxed border-t border-slate-100 whitespace-pre-line">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Embedded Google Map Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-brand-primary font-bold">
          <MapPin className="w-5 h-5 text-brand-secondary animate-bounce" />
          <span>Embedded Google Map</span>
        </div>
        <div className="h-80 bg-slate-100 rounded-3xl overflow-hidden border border-slate-200 relative shadow-sm">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126093.81882006732!2d7.38722880721245!3d9.053151815197825!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x104e745f4cd62e19%3A0xda129ef19cf9f538!2sGarki%2C%20Abuja%2C%20Nigeria!5e0!3m2!1sen!2s!4v1718700000000" 
            className="w-full h-full border-0"
            allowFullScreen={false} 
            loading="lazy" 
            referrerPolicy="no-referrer"
          ></iframe>
        </div>
      </section>
    </div>
  );
}
