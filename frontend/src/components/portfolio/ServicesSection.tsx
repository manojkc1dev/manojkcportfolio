import React from 'react';
import { useCMS } from '../../context/CMSContext';
import { Server, Database, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

export const ServicesSection: React.FC = () => {
  const { services } = useCMS();

  const getIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'server': return <Server className="w-6 h-6 text-indigo-500" />;
      case 'database': return <Database className="w-6 h-6 text-emerald-500" />;
      default: return <Sparkles className="w-6 h-6 text-amber-500" />;
    }
  };

  return (
    <section id="services" className="py-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 uppercase tracking-wider">
            Enterprise Architecture Services
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            Specialized Backend Advisory
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Advisory and hands-on principal engineering for mission-critical software systems.
          </p>
        </div>

        {/* Services Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((srv) => (
            <div
              key={srv.id}
              className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-6 hover:border-indigo-500/50 transition-all hover:shadow-xl group flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  {getIcon(srv.iconName)}
                </div>

                <div className="space-y-1">
                  <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                    {srv.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {srv.description}
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Core Focus
                  </div>
                  {srv.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800/80">
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Inquire Engagement <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
