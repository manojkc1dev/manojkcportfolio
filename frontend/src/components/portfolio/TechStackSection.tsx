import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';
import { TechCategory } from '../../types';
import {
  Code2,
  Layers,
  Database,
  Cloud,
  Container,
  Cpu,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Zap
} from 'lucide-react';

export const TechStackSection: React.FC = () => {
  const { techStack, skills } = useCMS();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Language', 'Framework', 'Database', 'Cloud', 'DevOps', 'Tool', 'Testing', 'AI'];

  const filteredTech = selectedCategory === 'All'
    ? techStack.filter(t => t.showOnHomepage && t.status === 'Active')
    : techStack.filter(t => t.category === selectedCategory && t.status === 'Active');

  return (
    <section id="techstack" className="py-20 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 uppercase tracking-wider">
            Dynamic Tech Stack & Skills
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            Enterprise Technology Ecosystem
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Battle-tested Python frameworks, PostgreSQL database clusters, Redis caching, and cloud infrastructure.
          </p>
        </div>

        {/* Category Filters Pill Bar */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Tech Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTech.map((tech) => (
            <div
              key={tech.id}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 hover:border-indigo-500/50 transition-all hover:shadow-xl group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                    <Code2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      {tech.name}
                    </h3>
                    <span className="text-[11px] font-mono text-indigo-500 font-semibold">
                      {tech.category}
                    </span>
                  </div>
                </div>

                <a
                  href={tech.officialWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  title={`Official website for ${tech.name}`}
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              {/* Skill Level Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-500 dark:text-slate-400">Mastery Level</span>
                  <span className="font-bold text-slate-900 dark:text-white">{tech.skillLevel}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-1000"
                    style={{ width: `${tech.skillLevel}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span>{tech.yearsOfExperience} Years Experience</span>
                {tech.featured && (
                  <span className="text-amber-500 font-bold flex items-center gap-0.5">
                    <Sparkles className="w-3 h-3" /> Core Expertise
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Skills Competency Progress List */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6 text-center">
            System Architecture & Core Engineering Competencies
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {skills.map((s) => (
              <div key={s.id} className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-indigo-500" />
                    {s.name}
                  </span>
                  <span className="font-mono text-indigo-500">{s.percentage}% ({s.yearsExperience} yrs)</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-indigo-600"
                    style={{ width: `${s.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
