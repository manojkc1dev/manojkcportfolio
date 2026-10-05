import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Laptop, ExternalLink, ArrowLeft, Terminal, Cpu, Database, Layout, Sparkles, Cloud, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Seo } from '../components/Seo';
import { useUses } from '../hooks/useUses';

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Hardware: Cpu,
  'Editor & Terminal': Terminal,
  'Backend Tools': Database,
  Frontend: Layout,
  Productivity: Sparkles,
  Deployment: Cloud,
  Learning: BookOpen,
};

export const UsesPage: React.FC = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  // Live updates when changes are saved from the admin CMS
  useEffect(() => {
    const handleUpdate = () => setRefreshKey((k) => k + 1);
    window.addEventListener('portfolio_data_updated', handleUpdate);
    return () => {
      window.removeEventListener('portfolio_data_updated', handleUpdate);
    };
  }, []);

  const { data: usesCategories, loading } = useUses(refreshKey);

  return (
    <>
      <Seo
        title="Uses & Tech Setup | Manoj K.C. — Backend Software Engineer"
        description="A living catalogue of hardware, developer tools, editor setup, and software stacks used by Manoj K.C. for Python/Django backend engineering in Kathmandu, Nepal."
        canonical="https://manojkc1.com.np/uses"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          '@id': 'https://manojkc1.com.np/uses#webpage',
          url: 'https://manojkc1.com.np/uses',
          name: 'Uses & Developer Setup | Manoj K.C.',
          description:
            'A living catalogue of hardware, developer tools, editor setup, and software stacks used by Manoj K.C. for Python/Django backend engineering.',
          isPartOf: { '@id': 'https://manojkc1.com.np/#website' },
          about: { '@id': 'https://manojkc1.com.np/#person' },
        }}
      />

      <main className="min-h-screen py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-mono text-neutral-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-3xl mb-16"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200/80 dark:border-indigo-900/60 mb-4 font-mono uppercase tracking-wider">
            <Laptop className="w-3.5 h-3.5" />
            <span>Developer Workspace & Tools</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
            What I Use
          </h1>

          <p className="mt-4 text-base sm:text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed">
            A comprehensive, transparent breakdown of the hardware, developer tooling, terminal configuration, and backend software stack I rely on daily to build, profile, and ship scalable Python &amp; Django systems.
          </p>
        </motion.div>

        {/* Category Sections / Skeletons */}
        {loading ? (
          <div className="space-y-16" aria-busy="true" aria-label="Loading workspace setup">
            {[1, 2, 3].map((catIndex) => (
              <div key={catIndex} className="pt-8 border-t border-neutral-200/80 dark:border-neutral-800 animate-pulse">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-xl bg-neutral-200 dark:bg-neutral-800" />
                  <div className="h-7 w-48 bg-neutral-200 dark:bg-neutral-800 rounded-lg" />
                </div>
                <div className="h-4 w-72 bg-neutral-200/60 dark:bg-neutral-800/60 rounded mb-8 ml-11" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {[1, 2, 3, 4].map((itemIndex) => (
                    <div
                      key={itemIndex}
                      className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800"
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="h-5 w-40 bg-neutral-200 dark:bg-neutral-800 rounded" />
                        <div className="h-4 w-16 bg-neutral-200/60 dark:bg-neutral-800/60 rounded" />
                      </div>
                      <div className="h-4 w-full bg-neutral-200/40 dark:bg-neutral-800/40 rounded mt-2" />
                      <div className="h-4 w-4/5 bg-neutral-200/40 dark:bg-neutral-800/40 rounded mt-1" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-16">
            {usesCategories.map((category, catIdx) => {
              const Icon = CATEGORY_ICONS[category.title] || Laptop;

              return (
                <motion.section
                  key={category.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.4, delay: catIdx * 0.05 }}
                  className="pt-8 border-t border-neutral-200/80 dark:border-neutral-800"
                >
                  {/* Category Header */}
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-900/60">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">
                      {category.title}
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mb-8 ml-11 max-w-2xl">
                    {category.description}
                  </p>

                  {/* Items Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {category.items.map((item, itemIdx) => (
                      <div
                        key={itemIdx}
                        className="group relative p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 hover:border-indigo-300 dark:hover:border-indigo-800 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                      >
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-semibold text-neutral-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                              {item.name}
                            </h3>
                            {item.link && (
                              <a
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`Visit ${item.name} website`}
                                className="text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>

                          {item.tag && (
                            <span className="shrink-0 px-2 py-0.5 text-[10px] font-mono rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200/70 dark:border-neutral-700/60">
                              {item.tag}
                            </span>
                          )}
                        </div>

                        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                          {item.why}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.section>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
};
