import React from 'react';
import { useCMS } from '../../context/CMSContext';
import {
  Award,
  CheckCircle2,
  Clock,
  Code2,
  Cpu,
  Layers,
  Quote,
  Sparkles,
  Target,
  Zap,
  Download
} from 'lucide-react';

export const AboutSection: React.FC = () => {
  const { about, hero, setIsResumeModalOpen } = useCMS();

  return (
    <section id="about" className="py-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 uppercase tracking-wider">
            About The Architect
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            Enterprise Scale Engineering & Clean Architecture
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Designing resilient backend microservices and high-throughput data platforms.
          </p>
        </div>

        {/* Stats Grid Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-indigo-600 dark:text-indigo-400 font-mono">
              {about.yearsExperience}+
            </div>
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300">Years Experience</div>
            <p className="text-[11px] text-slate-500 dark:text-slate-500">Principal & Staff Roles</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-indigo-600 dark:text-indigo-400 font-mono">
              {about.projectsCompleted}+
            </div>
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300">Projects Delivered</div>
            <p className="text-[11px] text-slate-500 dark:text-slate-500">Enterprise B2B & FinTech</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
              100k+
            </div>
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300">Requests / Sec</div>
            <p className="text-[11px] text-slate-500 dark:text-slate-500">Peak System Throughput</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-indigo-600 dark:text-indigo-400 font-mono">
              99.99%
            </div>
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300">Production Uptime</div>
            <p className="text-[11px] text-slate-500 dark:text-slate-500">PostgreSQL HA Clusters</p>
          </div>
        </div>

        {/* Bio, Mission, & Vision Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Photo Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl group">
              <img
                src={about.photo}
                alt={hero.name}
                className="w-full h-[360px] sm:h-[420px] object-cover object-top group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                <p className="font-bold text-lg">{hero.name}</p>
                <p className="text-xs text-indigo-300 font-mono">{hero.title}</p>
              </div>
            </div>

            {/* Architectural Quote Card */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 relative shadow-sm">
              <Quote className="w-8 h-8 text-indigo-500/30 absolute top-4 right-4" />
              <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 leading-relaxed not-italic">
                "{about.quote}"
              </p>
            </div>
          </div>

          {/* Long Description & Highlights */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              <p className="font-semibold text-base text-slate-900 dark:text-white">
                {about.bio}
              </p>
              <div className="whitespace-pre-line text-xs text-slate-600 dark:text-slate-400 space-y-3">
                {about.longDescription}
              </div>
            </div>

            {/* Mission & Vision */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                  <Target className="w-4 h-4" />
                  Engineering Mission
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {about.mission}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  Architectural Vision
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {about.vision}
                </p>
              </div>
            </div>

            {/* Highlights List & Resume CTA */}
            <div className="space-y-4 pt-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Key Accomplishments
              </h3>
              <div className="space-y-2">
                {about.highlights.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setIsResumeModalOpen(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-600/25 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Curriculum Vitae (PDF / DOCX)</span>
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
