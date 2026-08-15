import React, { useState, useEffect } from 'react';
import { useCMS } from '../../context/CMSContext';
import {
  Briefcase,
  MapPin,
  Sparkles,
  ArrowRight,
  Terminal,
  ShieldCheck,
  Zap,
  Download
} from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { hero, setViewMode, setIsResumeModalOpen } = useCMS();

  // Typing animation text state
  const [typingIndex, setTypingIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!hero.typingTexts || hero.typingTexts.length === 0) return;
    const currentFullText = hero.typingTexts[typingIndex % hero.typingTexts.length];
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setDisplayText(currentFullText.substring(0, displayText.length + 1));
        if (displayText.length === currentFullText.length) {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        setDisplayText(currentFullText.substring(0, displayText.length - 1));
        if (displayText.length === 0) {
          setIsDeleting(false);
          setTypingIndex((prev) => prev + 1);
        }
      }
    }, isDeleting ? 40 : 80);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, typingIndex, hero.typingTexts]);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-12 pb-20 overflow-hidden bg-slate-950 text-white">
      
      {/* Background Decorative Mesh / Grids */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-600/20 to-violet-600/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Availability Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-indigo-500/30 text-xs font-semibold text-indigo-300 shadow-inner">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{hero.availabilityBadge}</span>
            </div>

            {/* Main Name & Title */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight text-white">
                Hi, I'm <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-violet-300 to-indigo-200">{hero.name}</span>
              </h1>
              
              {/* Dynamic Typing Title */}
              <div className="h-10 text-lg sm:text-2xl font-mono font-bold text-indigo-400 flex items-center justify-center lg:justify-start gap-1">
                <span>{displayText}</span>
                <span className="w-2.5 h-6 bg-indigo-500 inline-block animate-pulse" />
              </div>
            </div>

            {/* Subtitle & Description */}
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              {hero.subtitle} {hero.description}
            </p>

            {/* Location & Architecture Spec Pill */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-indigo-400" />
                {hero.location}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <Zap className="w-4 h-4" />
                Python Django 5+ & FastAPI
              </span>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 pt-4 flex-wrap">
              <button
                onClick={() => setIsResumeModalOpen(true)}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.03] active:scale-[0.98] group cursor-pointer"
              >
                <Download className="w-4 h-4 text-emerald-100 group-hover:translate-y-0.5 transition-transform" />
                <span>Download Resume</span>
              </button>

              <a
                href={hero.hireMeUrl}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02]"
              >
                <Briefcase className="w-4 h-4" />
                Hire / Consult
              </a>
            </div>
          </div>

          {/* Right Image / Profile Visual Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-sm sm:max-w-md rounded-3xl bg-slate-900/90 p-3 border border-slate-800/80 shadow-2xl flex flex-col gap-3 group">
              {/* Clean Image Frame */}
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800/60">
                <img
                  src={hero.profileImage}
                  alt={hero.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              
              {/* Info Badge Card - Shifted below photo to normal position */}
              <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800/80 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="flex items-center gap-1.5 font-bold text-indigo-300">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" /> Python & Django Dev
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-indigo-950/80 text-indigo-300 text-[10px] border border-indigo-800/50">
                    BIT Graduate
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-mono leading-relaxed">
                  Django REST • PostgreSQL • JWT Auth • Khalti & eSewa APIs
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
