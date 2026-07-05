/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Code, 
  Palette, 
  Laptop, 
  Settings, 
  CheckCircle2, 
  ChevronRight, 
  Layers, 
  Activity, 
  ShieldAlert, 
  GraduationCap, 
  Search, 
  ArrowUpRight 
} from 'lucide-react';

export default function Services() {
  const [filter, setFilter] = useState('All');

  // Exact 8 services requested
  const servicesList = [
    {
      title: "Web Development",
      icon: Code,
      desc: "Architecting modern, high-speed, and secure responsive websites, company hubs, and customized relational database systems.",
      benefits: [
        "React, Vite, Node, and PHP architectures",
        "SEO friendliness and rapid page speeds",
        "Custom administrative portals and database boards",
        "Mobile-first responsive optimization"
      ]
    },
    {
      title: "Graphic Design",
      icon: Palette,
      desc: "Delivering world-class corporate artwork, flyer designs, conference manuals, and high-impact social assets.",
      benefits: [
        "Modern flyer design for event campaigns",
        "Corporate presentation books and magazines",
        "Scalable vectors and print-ready files",
        "Direct consultation to guide physical prints"
      ]
    },
    {
      title: "UI/UX Design",
      icon: Layers,
      desc: "Designing comprehensive, user-oriented digital wireframes and pixel-perfect interactive mocks.",
      benefits: [
        "Intensive wireframing and persona discovery labs",
        "Stellar custom component architectures in Figma",
        "Interactive clickable prototypes for early tests",
        "User journey testing and user retention guidelines"
      ]
    },
    {
      title: "Digital Branding",
      icon: Activity,
      desc: "Forging dynamic and coherent logo packages, style books, typography systems, and identity presets.",
      benefits: [
        "Unique logo designs that build immediate trust",
        "Strict brand style guides and custom palettes",
        "Social media branding templates and assets",
        "Cohesive offline and online design language"
      ]
    },
    {
      title: "IT Support",
      icon: Laptop,
      desc: "Professional installation, continuous maintenance, network tuning, and remote backup for office tech assets.",
      benefits: [
        "Rapid remote support and custom software provisioning",
        "Secure local area network setup and firewall logs",
        "Malware audits and hardware care inspections",
        "Direct emergency technical backup on call"
      ]
    },
    {
      title: "Technology Consulting",
      icon: Settings,
      desc: "Formulating digital roadmaps, system blueprints, and digital standard operating checklists for scaling ventures.",
      benefits: [
        "Complete structural system specifications and plans",
        "Digital transformation guidelines for organizations",
        "Educational and administrative workflow digitization",
        "In-depth tech safety audits and assessments"
      ]
    },
    {
      title: "Digital Training",
      icon: GraduationCap,
      desc: "Intensive, practical, instructor-led training cohorts designed to build job-ready digital experts.",
      benefits: [
        "Direct project mentoring with certified engineers",
        "Real-world capstone development assignments",
        "Instant CV styling and job-market portfolio reviews",
        "High-value completions certificates"
      ]
    },
    {
      title: "Website Maintenance",
      icon: ShieldAlert,
      desc: "Providing continuous server-side security care, content updates, form debugging, and platform updates.",
      benefits: [
        "Periodic file replication and cloud backups",
        "Instant plugin patches and code updates",
        "Constant uptime tracking and loading fixes",
        "Affordable ongoing content upload services"
      ]
    }
  ];

  // Projects list integrated here (as requested)
  const categories = ['All', 'Web Development', 'UI/UX Design', 'Branding & Graphics'];

  const projectList = [
    {
      title: 'E-Commerce Unified Hub',
      desc: 'Seamless, production-grade purchase engine with high-speed node server routing and dynamic inventory views.',
      category: 'Web Development',
      tech: 'React, Express, Tailwind',
      img: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=500&auto=format&fit=crop&q=60'
    },
    {
      title: 'Apex School Portal',
      desc: 'An automated student indexing and result sheet compiler built for private secondary academies.',
      category: 'Web Development',
      tech: 'React, Node, SQLite',
      img: 'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=500&auto=format&fit=crop&q=60'
    },
    {
      title: 'Zenith Corporate Branding',
      desc: 'Formulated coherent vectors, professional business brochures, and typography layouts for financial agencies.',
      category: 'Branding & Graphics',
      tech: 'Illustrator, Figma',
      img: 'https://images.unsplash.com/photo-1561070791-26c113006238?w=500&auto=format&fit=crop&q=60'
    },
    {
      title: 'Global Missions Flyer',
      desc: 'Eye-catching design designed to boost event registrations and support physical invitations distribution.',
      category: 'Branding & Graphics',
      tech: 'Photoshop, Canva Pro',
      img: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=500&auto=format&fit=crop&q=60'
    },
    {
      title: 'EduSphere Learning App',
      desc: 'Wireframing, persona research, and component library creation built for micro-learning ecosystems.',
      category: 'UI/UX Design',
      tech: 'Figma, Prototyping',
      img: 'https://images.unsplash.com/photo-1581291518655-9523c932ebcf?w=500&auto=format&fit=crop&q=60'
    },
    {
      title: 'Pulse Fitness Dashboard',
      desc: 'A responsive figma mockup tracking user daily cardio logs and healthy habit streaks.',
      category: 'UI/UX Design',
      tech: 'Figma, Wireframing',
      img: 'https://images.unsplash.com/photo-1510519138101-570d1dca3d66?w=500&auto=format&fit=crop&q=60'
    }
  ];

  const filteredProjects = filter === 'All' ? projectList : projectList.filter(p => p.category === filter);

  return (
    <div className="space-y-24 py-6 pb-20 max-w-7xl mx-auto px-6 animate-fade-in">
      {/* Title Header */}
      <section className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-widest text-[#00a8ff] bg-brand-accent px-3.5 py-1.5 rounded-full">
          What We Offer
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-brand-primary tracking-tight">
          Our Professional <span className="text-brand-secondary">Core Services</span>
        </h1>
        <p className="text-gray-600 text-sm md:text-base leading-relaxed">
          At EJaytech Concepts, we merge sophisticated software development with beautiful visual artwork to deliver complete digital transformations.
        </p>
      </section>

      {/* Services Cards List (Exactly 8) */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {servicesList.map((srv, i) => (
          <div key={i} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:border-brand-secondary/40 transition duration-300 flex flex-col justify-between group">
            <div className="space-y-5">
              <div className="w-12 h-12 rounded-2xl bg-brand-accent text-brand-primary flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <srv.icon className="w-6 h-6 text-brand-secondary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-extrabold text-brand-primary font-display">{srv.title}</h3>
                <p className="text-gray-500 text-xs md:text-sm leading-relaxed">{srv.desc}</p>
              </div>
              
              <div className="space-y-2 pt-3 border-t border-slate-100">
                {srv.benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6">
              <a 
                href={`https://wa.me/2348135402154?text=Hello%20EJaytech%2520Concepts!%2520I%2520am%2520inquiring%2520about%2520your%2520"${encodeURIComponent(srv.title)}"%2520services.`}
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-bold text-brand-secondary hover:text-brand-primary transition"
              >
                Inquire For This Service <ChevronRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </section>

      {/* Featured Projects Portfolio Section (as requested) */}
      <section id="portfolio-integration-services" className="space-y-12">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-[#00a8ff]">Case Studies & Products</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-brand-primary">Featured Projects Portfolio</h2>
          <p className="text-gray-600 text-xs md:text-sm leading-relaxed">
            Our portfolio showcases the design processes, technologies, and visual structures implemented for EJaytech Concepts clients.
          </p>
        </div>

        {/* Categories Tab selectors */}
        <div className="flex flex-wrap justify-center gap-2 max-w-xl mx-auto bg-brand-accent p-1.5 rounded-2xl border border-slate-200">
          {categories.map((catName) => (
            <button
              key={catName}
              onClick={() => setFilter(catName)}
              className={`flex-1 px-4 py-2.5 text-xs font-bold rounded-xl transition cursor-pointer ${
                filter === catName 
                  ? 'bg-brand-primary text-white shadow-sm' 
                  : 'text-slate-600 hover:bg-white/50'
              }`}
            >
              {catName}
            </button>
          ))}
        </div>

        {/* Portfolio Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((proj, i) => (
            <div key={i} className="bg-white rounded-3xl overflow-hidden border border-slate-200 hover:shadow-xl transition flex flex-col justify-between group">
              <div>
                <div className="relative h-52 w-full overflow-hidden bg-slate-100">
                  <img 
                    src={proj.img} 
                    alt={proj.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute top-4 left-4 inline-block text-[10px] font-bold uppercase tracking-wider bg-slate-900/90 text-brand-secondary px-2.5 py-1 rounded-md">
                    {proj.category}
                  </span>
                </div>

                <div className="p-6 space-y-3">
                  <h3 className="text-lg font-bold text-brand-primary font-display">{proj.title}</h3>
                  <p className="text-gray-500 text-xs md:text-sm leading-relaxed">{proj.desc}</p>
                </div>
              </div>

              <div className="p-6 pt-0 flex items-center justify-between">
                <span className="text-xs font-mono text-gray-500 bg-brand-accent px-2 py-1 rounded">
                  {proj.tech}
                </span>
                <a 
                  href={`https://wa.me/2348135402154?text=Hello!%2520I%2520am%2520interested%2520in%2520a%252520project%252520similar%252520to%252520"${encodeURIComponent(proj.title)}"`}
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-brand-secondary hover:text-brand-primary cursor-pointer"
                >
                  Discuss Customizations <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
