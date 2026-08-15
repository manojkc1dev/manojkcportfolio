import React from 'react';
import { useCMS } from '../../context/CMSContext';
import { Briefcase, GraduationCap, CheckCircle2, Calendar, MapPin, Building, Trophy } from 'lucide-react';

export const ExperienceSection: React.FC = () => {
  const { experiences, educations } = useCMS();

  return (
    <section id="experience" className="py-20 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 uppercase tracking-wider">
            Career Journey & Academics
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            20+ Years Leadership Timeline
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            A track record of leading high-performing engineering organizations and scaling cloud systems.
          </p>
        </div>

        {/* Experience Timeline Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Work History Timeline (Col 1-8) */}
          <div className="lg:col-span-8 space-y-8">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-indigo-500" /> Professional Experience
            </h3>

            <div className="relative pl-6 border-l-2 border-indigo-500/30 space-y-10">
              {experiences.map((exp) => (
                <div key={exp.id} className="relative group">
                  {/* Timeline Dot */}
                  <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-indigo-600 border-4 border-slate-50 dark:border-slate-950 shadow-md" />

                  <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 hover:border-indigo-500/50 transition-colors shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                          {exp.position}
                        </h4>
                        <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5 mt-0.5">
                          <Building className="w-3.5 h-3.5" /> {exp.company}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 font-mono text-xs text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-indigo-500" /> {exp.duration}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" /> {exp.location}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {exp.description}
                    </p>

                    {/* Achievements */}
                    {exp.achievements && exp.achievements.length > 0 && (
                      <div className="space-y-1.5 pt-2">
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                          <Trophy className="w-3.5 h-3.5 text-amber-500" /> Key Impact & Deliverables
                        </div>
                        {exp.achievements.map((ach, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{ach}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Tech Badges */}
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {exp.technologiesUsed.map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-mono"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Education Sidebar (Col 9-12) */}
          <div className="lg:col-span-4 space-y-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-indigo-500" /> Academic Credentials
            </h3>

            <div className="space-y-4">
              {educations.map((edu) => (
                <div
                  key={edu.id}
                  className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm"
                >
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                    CGPA: {edu.cgpa}
                  </span>
                  
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    {edu.degree} in {edu.major}
                  </h4>

                  <div className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
                    {edu.institute}
                  </div>

                  <div className="text-[11px] font-mono text-slate-400">
                    {edu.duration}
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
                    {edu.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
