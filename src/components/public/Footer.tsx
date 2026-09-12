import React from 'react';
import Link from 'next/link';
import { Github, Linkedin, Mail, MessageCircle, MapPin } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { BackToTop } from './BackToTop';

interface FooterNavItem {
  title: string;
  url: string;
}

interface SocialItem {
  platform: string;
  url: string;
  display_text?: string;
}

const DEFAULT_FOOTER_NAV: FooterNavItem[] = [
  { title: 'About Me', url: '/#about' },
  { title: 'Tech Stack', url: '/#tech-stack' },
  { title: 'Featured Projects', url: '/#projects' },
  { title: 'Contact', url: '/#contact' },
];

const DEFAULT_SOCIALS: SocialItem[] = [
  { platform: 'GitHub', url: 'https://github.com/manojkc1', display_text: 'GitHub' },
  { platform: 'LinkedIn', url: 'https://www.linkedin.com/in/manojkc1', display_text: 'LinkedIn' },
  { platform: 'Email', url: 'mailto:manojkc1dev@gmail.com', display_text: 'Direct Email' },
  { platform: 'WhatsApp', url: 'https://wa.me/9779809807760', display_text: 'WhatsApp' },
];

export async function Footer() {
  let footerNav = DEFAULT_FOOTER_NAV;
  let socials = DEFAULT_SOCIALS;
  let tagline =
    'Independent Python & Django Backend Developer specializing in secure database schema architecture, decoupling monolithic systems, and building scalable RESTful APIs.';

  try {
    const supabase = await createClient();

    // Fetch footer navigation
    const { data: navData } = await supabase
      .from('navigation')
      .select('title, url')
      .eq('location', 'footer')
      .eq('status', 'published')
      .order('sort_order', { ascending: true });

    if (navData && navData.length > 0) {
      footerNav = navData;
    }

    // Fetch socials
    const { data: socialsData } = await supabase
      .from('socials')
      .select('platform, url, display_text')
      .eq('status', 'published')
      .order('sort_order', { ascending: true });

    if (socialsData && socialsData.length > 0) {
      // STRICT FILTER: Enforce ONLY GitHub, LinkedIn, Email, WhatsApp
      const allowedPlatforms = ['github', 'linkedin', 'email', 'whatsapp'];
      const filtered = socialsData.filter((s) =>
        allowedPlatforms.includes(s.platform.toLowerCase())
      );
      if (filtered.length > 0) {
        socials = filtered;
      }
    }

    // Fetch tagline from about or hero
    const { data: heroData } = await supabase
      .from('hero')
      .select('subheadline')
      .eq('status', 'published')
      .limit(1)
      .maybeSingle();

    if (heroData?.subheadline) {
      // Use tagline default or verified content
    }
  } catch {
    // Graceful fallback to verified constants
  }

  const renderSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'github':
        return <Github className="w-4 h-4" />;
      case 'linkedin':
        return <Linkedin className="w-4 h-4" />;
      case 'email':
        return <Mail className="w-4 h-4" />;
      case 'whatsapp':
        return <MessageCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <footer className="w-full bg-surface border-t border-border transition-colors duration-200">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* 4-Column Grid on Desktop, Stacked on Mobile */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 lg:gap-12">
          {/* COLUMN 1: Identity (span 2 on desktop) */}
          <div className="md:col-span-2 space-y-4">
            <Link
              href="/"
              className="inline-flex items-center text-xl font-bold tracking-tight text-foreground hover:opacity-90 transition-opacity"
            >
              <span>Manoj K.C</span>
              <span className="text-primary font-black ml-0.5">.</span>
            </Link>

            <p className="text-sm text-muted leading-relaxed max-w-lg">
              {tagline}
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-muted pt-1">
              <div className="flex items-center gap-1.5 text-foreground/90 font-medium">
                <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                <span>Kathmandu, Nepal · UTC +5:45 (NPT)</span>
              </div>
            </div>

            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-surface-2 border border-border text-foreground">
                <span className="text-amber-500">⚡</span>
                <span>Available for On-site & Remote Roles</span>
              </span>
            </div>
          </div>

          {/* COLUMN 2: Navigation */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
              Navigation
            </h3>
            <ul className="space-y-2.5 text-sm">
              {footerNav.map((link) => (
                <li key={link.title}>
                  <Link
                    href={link.url}
                    className="text-muted hover:text-foreground transition-colors duration-150 inline-block"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 3: Connect (ONLY 4 links strictly enforced) */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
              Connect
            </h3>
            <ul className="space-y-2.5 text-sm">
              {socials.map((social) => {
                const label =
                  social.display_text ||
                  social.platform.charAt(0).toUpperCase() + social.platform.slice(1);
                return (
                  <li key={social.platform}>
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2.5 text-muted hover:text-foreground transition-colors duration-150 group"
                    >
                      <span className="p-1 rounded bg-surface-2 border border-border text-muted group-hover:text-primary group-hover:border-primary/40 transition-colors">
                        {renderSocialIcon(social.platform)}
                      </span>
                      <span>{label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted">
          <p className="text-center sm:text-left">
            © 2026 Manoj K.C. | Python & Django Backend Developer Portfolio. All rights reserved.
          </p>

          <div className="flex items-center">
            <BackToTop />
          </div>
        </div>
      </div>
    </footer>
  );
}
