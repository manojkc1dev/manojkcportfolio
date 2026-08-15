import React from 'react';
import { useCMS } from '../../context/CMSContext';
import { Quote, Star, Building } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const { testimonials, clients } = useCMS();

  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 uppercase tracking-wider">
            Executive Endorsements
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            Client & Engineering Peer Testimonials
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Reviews from CTOs, VPs of Engineering, and technical leaders.
          </p>
        </div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((test) => (
            <div
              key={test.id}
              className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6 relative shadow-sm hover:border-indigo-500/40 transition-colors"
            >
              <Quote className="w-8 h-8 text-indigo-400/20 absolute top-6 right-6" />

              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(test.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>

              <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-normal not-italic">
                "{test.review}"
              </p>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <img
                  src={test.photo}
                  alt={test.clientName}
                  className="w-12 h-12 rounded-full object-cover border border-indigo-500/30"
                />
                <div>
                  <div className="font-bold text-xs text-slate-900 dark:text-white">
                    {test.clientName}
                  </div>
                  <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">
                    {test.designation}, {test.company}
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Clients Banner */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800/80">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center mb-6">
            Trusted By Engineering Teams Worldwide
          </div>
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-80 grayscale hover:grayscale-0 transition-all">
            {clients.map((cli) => (
              <a
                key={cli.id}
                href={cli.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-indigo-500 transition-colors"
              >
                <Building className="w-4 h-4 text-indigo-500" />
                {cli.name}
              </a>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
