import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { OWNER_PROFILE, SEO_CONFIG, type Project } from '@/lib/constants';
import { Navbar } from '@/components/public/Navbar';
import { Footer } from '@/components/public/Footer';
import { ProjectCard } from '@/components/public/ProjectCard';
import { SectionReveal } from '@/components/public/SectionReveal';
import { TechStackFilter } from '@/components/public/TechStackFilter';
import { ProjectSchema } from '@/components/seo/ProjectSchema';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { createClient } from '@/lib/supabase/server';
import {
  Code2,
  Database,
  Server,
  Shield,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Clock,
  GraduationCap,
  Terminal,
  CheckCircle2,
  ArrowRight,
  ArrowUpRight,
  Layers,
  FileText,
  Download,
  Quote,
} from 'lucide-react';

const PROCESS_STEPS = [
  {
    step: '01',
    title: 'Discovery & Requirements',
    description: 'We map your business workflows and define API contracts before code.',
  },
  {
    step: '02',
    title: 'System Architecture',
    description: 'Database schema design, DRF serializers, JWT flow, deployment plan.',
  },
  {
    step: '03',
    title: 'API Engineering',
    description: 'Modular Django apps, DRF viewsets, tests, Postman docs.',
  },
  {
    step: '04',
    title: 'Testing & Hardening',
    description: 'Load testing, security audits, PostgreSQL query optimization.',
  },
  {
    step: '05',
    title: 'Deployment & Handover',
    description: 'CI/CD, Render/Vercel deploy, monitoring, documentation handoff.',
  },
];

export default async function HomePage() {
  const breadcrumbs = [{ name: 'Home', url: '/' }];

  // Fetch live CMS data with fallback to verified constants
  let heroData = {
    headline: OWNER_PROFILE.headline,
    subheadline: OWNER_PROFILE.subHeadline,
    intro: OWNER_PROFILE.heroIntro,
    availability_badge: 'Available for On-site & Remote Backend Roles',
  };

  let aboutData = {
    long_form: OWNER_PROFILE.about,
    pull_quote: OWNER_PROFILE.pullQuote,
  };

  let testimonials: Array<{ author: string; role: string; quote: string; company?: string }> = [];

  try {
    const supabase = await createClient();
    const { data: dbHero } = await supabase
      .from('hero')
      .select('*')
      .eq('status', 'published')
      .limit(1)
      .maybeSingle();

    if (dbHero) {
      heroData = {
        headline: dbHero.headline || heroData.headline,
        subheadline: dbHero.subheadline || heroData.subheadline,
        intro: dbHero.intro || heroData.intro,
        availability_badge: dbHero.availability_badge || heroData.availability_badge,
      };
    }

    const { data: dbAbout } = await supabase
      .from('about')
      .select('*')
      .eq('status', 'published')
      .limit(1)
      .maybeSingle();

    if (dbAbout) {
      aboutData = {
        long_form: dbAbout.long_form || aboutData.long_form,
        pull_quote: dbAbout.pull_quote || aboutData.pull_quote,
      };
    }

    const { data: dbTestimonials } = await supabase
      .from('testimonials')
      .select('client_name, client_title, company, quote')
      .eq('status', 'published');

    if (dbTestimonials && dbTestimonials.length > 0) {
      testimonials = dbTestimonials.map((t) => ({
        author: t.client_name,
        role: t.client_title,
        company: t.company,
        quote: t.quote,
      }));
    }
  } catch {
    // Database fallback active
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary selection:text-white">
      <BreadcrumbSchema items={breadcrumbs} />
      {OWNER_PROFILE.featuredProjects.map((project) => (
        <ProjectSchema key={project.slug} project={project} />
      ))}

      {/* PART B: Fixed Navbar */}
      <Navbar />

      <main id="main-content" className="flex-1">
        {/* 1. HERO SECTION */}
        <section className="pt-28 md:pt-36 pb-20 md:pb-28 px-4 sm:px-6 lg:px-8 border-b border-border relative overflow-hidden">
          {/* Subtle grid background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-[var(--mesh-opacity)]" />

          <div className="max-w-[1280px] mx-auto relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              {/* Left Column: Headlines & CTA */}
              <div className="lg:col-span-7 space-y-6">
                <SectionReveal>
                  {/* Availability Badge */}
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface border border-border text-xs font-medium text-success shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                    <span>{heroData.availability_badge}</span>
                  </div>

                  {/* Main H1 Headline */}
                  <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-extrabold tracking-tight text-foreground leading-[1.15] mt-4 mb-4">
                    {heroData.headline}
                  </h1>

                  {/* Sub-headline */}
                  <h2 className="text-lg sm:text-xl font-semibold text-primary/90 mb-4">
                    {heroData.subheadline}
                  </h2>

                  {/* Intro Paragraph */}
                  <p className="text-base sm:text-lg text-muted leading-relaxed max-w-2xl">
                    {heroData.intro}
                  </p>

                  {/* Action CTAs */}
                  <div className="flex flex-wrap items-center gap-4 pt-4">
                    <Link
                      href="#contact"
                      className="inline-flex items-center justify-center h-11 px-6 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-150 shadow-xs hover:scale-[1.02] cursor-pointer"
                    >
                      Hire Me
                    </Link>
                    <Link
                      href="#projects"
                      className="inline-flex items-center justify-center h-11 px-6 rounded-lg text-sm font-semibold border border-border bg-surface hover:bg-surface-2 text-foreground transition-all duration-150"
                    >
                      View Projects
                    </Link>
                  </div>
                </SectionReveal>
              </div>

              {/* Right Column: Square Profile Photo */}
              <div className="lg:col-span-5 flex justify-center lg:justify-end">
                <SectionReveal delay={0.15}>
                  <div className="relative w-72 sm:w-80 md:w-96 aspect-square rounded-2xl overflow-hidden border border-border bg-surface shadow-2xl p-2">
                    <div className="relative w-full h-full rounded-xl overflow-hidden bg-surface-2">
                      <Image
                        src={OWNER_PROFILE.avatarImage}
                        alt="Manoj K.C. - Python and Django Backend Developer"
                        fill
                        priority
                        sizes="(max-width: 640px) 288px, (max-width: 1024px) 320px, 384px"
                        className="object-cover object-top"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>
                </SectionReveal>
              </div>
            </div>

            {/* Below: Stats Strip */}
            <div className="mt-16 pt-10 border-t border-border">
              <SectionReveal delay={0.2}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {OWNER_PROFILE.stats.map((stat) => (
                    <div
                      key={stat.label}
                      className="p-4 rounded-xl bg-surface border border-border flex flex-col justify-center"
                    >
                      <span className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                        {stat.value}
                      </span>
                      <span className="text-xs text-muted font-medium mt-1">
                        {stat.label}
                      </span>
                    </div>
                  ))}
                </div>
              </SectionReveal>
            </div>
          </div>
        </section>

        {/* 2. ABOUT PREVIEW SECTION */}
        <section id="about" className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 border-b border-border bg-surface/30">
          <div className="max-w-[1280px] mx-auto">
            <SectionReveal>
              <div className="max-w-3xl mb-12">
                <span className="text-xs font-semibold uppercase tracking-widest text-primary block mb-2">
                  About
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-6">
                  Backend systems built to scale
                </h2>
                <p className="text-base sm:text-lg text-muted leading-relaxed mb-8">
                  {aboutData.long_form}
                </p>

                {/* Pull quote with accent left border */}
                <div className="p-6 rounded-r-xl bg-surface border-l-4 border-primary border-y border-r border-border my-8 shadow-xs">
                  <p className="italic text-foreground/90 text-sm sm:text-base leading-relaxed font-serif">
                    &ldquo;{aboutData.pull_quote}&rdquo;
                  </p>
                  <span className="block text-xs font-mono text-muted mt-3">
                    — Manoj K.C. · Backend Philosophy
                  </span>
                </div>

                <div className="flex items-center gap-6 pt-2">
                  <Link
                    href="#contact"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                  >
                    <span>Read Full About & Contact</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <a
                    href="mailto:manojkc1dev@gmail.com"
                    className="text-xs text-muted hover:text-foreground transition-colors font-mono"
                  >
                    manojkc1dev@gmail.com
                  </a>
                </div>
              </div>
            </SectionReveal>
          </div>
        </section>

        {/* 3. TECH STACK SECTION */}
        <section id="tech-stack" className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 border-b border-border">
          <div className="max-w-[1280px] mx-auto">
            <SectionReveal>
              <div className="text-center max-w-2xl mx-auto mb-12">
                <span className="text-xs font-semibold uppercase tracking-widest text-primary block mb-2">
                  Architecture & Skills
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-4">
                  Server-Side Technology Stack
                </h2>
                <p className="text-sm sm:text-base text-muted leading-relaxed">
                  Specialized in Python & Django ecosystems, schema modeling, RESTful API contracts, and high-performance relational databases.
                </p>
              </div>

              {/* Client Component with filter tabs */}
              <TechStackFilter />
            </SectionReveal>
          </div>
        </section>

        {/* 4. FEATURED PROJECTS SECTION */}
        <section id="projects" className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 border-b border-border bg-surface/30">
          <div className="max-w-[1280px] mx-auto">
            <SectionReveal>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-widest text-primary block mb-2">
                    Selected Work
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                    Featured Backend Projects
                  </h2>
                </div>

                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                >
                  <span>View All Projects</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* 2-column grid of square ProjectCards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {OWNER_PROFILE.featuredProjects.map((project, idx) => (
                  <ProjectCard key={project.slug} project={project} priority={idx === 0} />
                ))}
              </div>
            </SectionReveal>
          </div>
        </section>

        {/* 5. PROCESS SECTION (INSPIRED — NOT COPIED) */}
        <section id="process" className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 border-b border-border">
          <div className="max-w-[1280px] mx-auto">
            <SectionReveal>
              <div className="max-w-2xl mb-14">
                <span className="text-xs font-semibold uppercase tracking-widest text-primary block mb-2">
                  Engineering Workflow
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-4">
                  Structured Backend Development Process
                </h2>
                <p className="text-sm sm:text-base text-muted leading-relaxed">
                  From schema specification to production monitoring, every backend project adheres to a disciplined engineering lifecycle.
                </p>
              </div>

              {/* 5-step process layout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                {PROCESS_STEPS.map((item) => (
                  <div
                    key={item.step}
                    className="p-6 rounded-2xl bg-surface border border-border flex flex-col justify-between hover:border-primary/50 transition-all duration-200 group"
                  >
                    <div>
                      <span className="text-2xl font-mono font-extrabold text-primary mb-4 block">
                        {item.step}
                      </span>
                      <h3 className="text-base font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs text-muted leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </SectionReveal>
          </div>
        </section>

        {/* 6. TESTIMONIALS SECTION (Optional / pulled from table) */}
        {testimonials.length > 0 && (
          <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 border-b border-border bg-surface/30">
            <div className="max-w-[1280px] mx-auto">
              <SectionReveal>
                <div className="text-center max-w-2xl mx-auto mb-12">
                  <span className="text-xs font-semibold uppercase tracking-widest text-primary block mb-2">
                    Endorsements
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                    Collaborator Feedback
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {testimonials.map((t, idx) => (
                    <div
                      key={idx}
                      className="p-6 rounded-2xl bg-surface border border-border flex flex-col justify-between"
                    >
                      <Quote className="w-8 h-8 text-primary/30 mb-4" />
                      <p className="text-sm text-foreground/90 italic leading-relaxed mb-6">
                        &ldquo;{t.quote}&rdquo;
                      </p>
                      <div className="pt-4 border-t border-border">
                        <span className="font-semibold text-xs text-foreground block">
                          {t.author}
                        </span>
                        <span className="text-[11px] text-muted block">
                          {t.role} {t.company && `· ${t.company}`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </SectionReveal>
            </div>
          </section>
        )}

        {/* 7. CTA BAND */}
        <section id="contact" className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-surface">
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <SectionReveal>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-medium text-primary mb-6 shadow-xs">
                <span>⚡ Available for On-site & Remote Roles</span>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4">
                Ready to build your backend?
              </h2>

              <p className="text-base sm:text-lg text-muted max-w-2xl mx-auto mb-8 leading-relaxed">
                Available for on-site & remote roles, freelance projects, and technical consulting. Let&apos;s build reliable, scalable APIs together.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4">
                <a
                  href="mailto:manojkc1dev@gmail.com"
                  className="inline-flex items-center justify-center h-12 px-7 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-150 shadow-md hover:scale-[1.02] cursor-pointer"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  <span>Get in Touch</span>
                </a>

                <a
                  href="/static/resume-manoj-kc.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center h-12 px-7 rounded-xl text-sm font-semibold border border-border bg-surface-2 hover:bg-surface text-foreground transition-all duration-150 cursor-pointer"
                >
                  <Download className="w-4 h-4 mr-2" />
                  <span>Download Resume</span>
                </a>
              </div>

              {/* Direct communication pill */}
              <div className="mt-10 pt-8 border-t border-border/80 flex flex-wrap items-center justify-center gap-6 text-xs text-muted">
                <span className="flex items-center gap-1.5 font-medium text-foreground">
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                  Kathmandu, Nepal
                </span>
                <span>·</span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-muted" />
                  UTC +5:45 (NPT)
                </span>
                <span>·</span>
                <a
                  href="https://wa.me/9779809807760"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-mono"
                >
                  WhatsApp: +977-9809807760
                </a>
              </div>
            </SectionReveal>
          </div>
        </section>
      </main>

      {/* 8. FOOTER */}
      <Footer />
    </div>
  );
}
