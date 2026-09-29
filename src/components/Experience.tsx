import React, { useMemo, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Calendar,
  MapPin,
  CheckCircle2,
  Download,
  GraduationCap,
  ArrowRight,
} from 'lucide-react';
import { experiences as defaultExperiences } from '../data/experience';
import { ViewAllLink } from './ui/ViewAllLink';
import { track } from '../lib/analytics';
import type { Experience as ExperienceType } from '../types';

export const Experience: React.FC = () => {
  const navigate = useNavigate();
  const [dataVersion, setDataVersion] = useState(0);

  // Re-read storage dynamically when admin saves changes in the CMS
  useEffect(() => {
    const handleUpdate = () => setDataVersion((v) => v + 1);
    window.addEventListener('storage', handleUpdate);
    window.addEventListener('portfolio_data_updated', handleUpdate);
    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('portfolio_data_updated', handleUpdate);
    };
  }, []);

  const allItems = useMemo<ExperienceType[]>(() => {
    try {
      const saved = localStorage.getItem('portfolio_experience');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Experience load error:', e);
    }
    return defaultExperiences;
  }, [dataVersion]);

  // Show 3 experience entries/sections for homepage preview
  const previewItems = useMemo(() => {
    return allItems.slice(0, 3);
  }, [allItems]);

  return (
    <section
      id="experience"
      aria-label="Work Experience & Education"
      className="py-20 sm:py-28 relative overflow-hidden"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header with Left Eyebrow/Title/Subtitle and Right 'View Full Timeline' Link */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200/80 dark:border-indigo-900/60 mb-3 font-mono uppercase tracking-wider">
              <Briefcase className="w-3.5 h-3.5" />
              <span>Career &amp; Education</span>
            </div>
            <h2
              id="experience-title"
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white"
            >
              Experience
            </h2>
            <p className="mt-2 text-base sm:text-lg text-neutral-600 dark:text-neutral-400">
              Hands-on software engineering, production backend training, and degree capstones.
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <ViewAllLink
              to="/experience"
              label="View Full Timeline"
              count={allItems.length}
            />
          </div>
        </div>

        {/* Timeline Items (2 items preview) */}
        <div className="relative pl-6 sm:pl-8 border-l-2 border-neutral-200 dark:border-neutral-800 space-y-10 ml-2 sm:ml-4 mb-12">
          {previewItems.map((exp, index) => {
            const isEducation =
              exp.type === 'education' ||
              exp.type?.toLowerCase().includes('edu') ||
              exp.type?.toLowerCase().includes('student');

            return (
              <motion.article
                key={exp.id}
                id={`experience-entry-${exp.id}`}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: index * 0.15 }}
                className="relative group"
              >
                {/* Timeline Pin Indicator */}
                <div
                  className={`absolute -left-[31px] sm:-left-[39px] top-6 w-4 h-4 sm:w-5 sm:h-5 rounded-full border-4 border-white dark:border-neutral-950 flex items-center justify-center transition-transform group-hover:scale-125 ${
                    isEducation
                      ? 'bg-amber-500'
                      : 'bg-indigo-600 ring-4 ring-indigo-500/20'
                  }`}
                  aria-hidden="true"
                />

                {/* Experience Card */}
                <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 p-6 sm:p-8 shadow-xs hover:border-indigo-300 dark:hover:border-indigo-800 transition-all duration-200">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        {isEducation ? (
                          <GraduationCap className="w-5 h-5 text-amber-500" />
                        ) : (
                          <Briefcase className="w-5 h-5 text-indigo-500" />
                        )}
                        <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                          {exp.role}
                        </h3>
                      </div>
                      <p className="text-sm font-semibold text-neutral-600 dark:text-neutral-400 mt-1">
                        {exp.company}
                      </p>
                    </div>

                    <span
                      className={`self-start sm:self-auto text-xs font-semibold px-3 py-1 rounded-full border ${
                        isEducation
                          ? 'bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                          : 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
                      }`}
                    >
                      {exp.type}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-500 dark:text-neutral-400 font-mono mb-4 pb-3 border-b border-neutral-100 dark:border-neutral-800">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{exp.period || `${exp.start} — ${exp.end}`}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{exp.location}</span>
                    </span>
                  </div>

                  {exp.description && (
                    <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-4 leading-relaxed">
                      {exp.description}
                    </p>
                  )}

                  <div className="space-y-2 mb-6">
                    {exp.bullets.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-700 dark:text-neutral-300"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>

                  {exp.tech && exp.tech.length > 0 && (
                    <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex flex-wrap gap-1.5">
                      {exp.tech.map((techItem) => (
                        <span
                          key={techItem}
                          className="px-2.5 py-1 text-xs font-mono rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200/70 dark:border-neutral-700/60"
                        >
                          {techItem}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* Centered Bottom Action: View Full Timeline (N entries) */}
        <div className="text-center pt-4">
          <button
            type="button"
            onClick={() => navigate('/experience')}
            className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800/80 hover:border-indigo-400 dark:hover:border-indigo-500 font-semibold text-sm shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer group"
          >
            <span>View Full Timeline ({allItems.length} entries)</span>
            <ArrowRight className="w-4 h-4 text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};
