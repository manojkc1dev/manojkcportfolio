import React from 'react';
import { motion } from 'motion/react';
import { Hammer, Sparkles, Clock, ArrowRight, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCurrentlyBuilding } from '../hooks/useCurrentlyBuilding';
import type { CurrentItem } from '../data/currentlyBuilding';

export const CurrentlyBuilding: React.FC = () => {
  const items = useCurrentlyBuilding();

  return (
    <section
      id="currently-building"
      aria-label="Currently Building"
      className="py-16 sm:py-20 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/60 mb-3 font-mono uppercase tracking-wider">
              <Hammer className="w-3.5 h-3.5" />
              <span>In The Workshop</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
              Currently Building & Exploring
            </h2>
            <p className="mt-2 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-2xl">
              Real-time engineering snapshot: actively coded initiatives, architecture ports, and backend R&D topics in progress.
            </p>
          </div>
        </div>

        {/* Grid of Work Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {items.map((item: CurrentItem, idx: number) => {
            const isResearching = item.status === 'researching';
            const isPlanned = item.status === 'planned';

            return (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="group relative flex flex-col justify-between p-5 sm:p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-500/5 overflow-hidden"
              >
                <div>
                  {/* Top Meta Row */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold uppercase tracking-wider border ${
                        isResearching
                          ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20'
                          : isPlanned
                          ? 'bg-neutral-500/10 text-neutral-600 dark:text-neutral-400 border-neutral-500/20'
                          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                      }`}
                    >
                      {isResearching ? (
                        <Compass className="w-3 h-3" />
                      ) : (
                        <Sparkles className="w-3 h-3" />
                      )}
                      <span>{item.status}</span>
                    </span>

                    <span className="inline-flex items-center gap-1 text-xs text-neutral-400 dark:text-neutral-500 font-mono">
                      <Clock className="w-3 h-3" />
                      <span>{item.since}</span>
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Bottom Row: Progress or Related Project */}
                <div className="mt-5 pt-3.5 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between gap-4">
                  {typeof item.progress === 'number' ? (
                    <div className="w-full">
                      <div className="flex justify-between text-[11px] font-mono text-neutral-500 dark:text-neutral-400 mb-1.5">
                        <span>Sprint Completion</span>
                        <span className="font-semibold text-neutral-900 dark:text-neutral-200">
                          {item.progress}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-amber-500 to-indigo-500 transition-all duration-500"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400">
                      R&amp;D Architecture Phase
                    </div>
                  )}

                  {item.relatedProjectId && (
                    <Link
                      to={`/projects/${item.relatedProjectId}`}
                      className="shrink-0 inline-flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline"
                    >
                      <span>Related</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  )}
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
