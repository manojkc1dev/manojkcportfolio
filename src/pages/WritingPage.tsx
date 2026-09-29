import React, { useState } from 'react';
import { motion } from 'motion/react';
import { BookOpen, Mail, ArrowRight, ArrowLeft, Clock, Calendar, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Seo } from '../components/Seo';
import { posts, type Post } from '../data/writing';

export const WritingPage: React.FC = () => {
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  // Extract all unique tags
  const allTags = ['all', ...Array.from(new Set(posts.flatMap((p) => p.tags)))];

  const filteredPosts =
    selectedTag === 'all'
      ? posts
      : posts.filter((p) => p.tags.includes(selectedTag));

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubscribed(true);
    setEmail('');
  };

  return (
    <>
      <Seo
        title="Engineering Articles & Writing | Manoj K.C."
        description="Deep dives on Python 3.12, Django ORM query optimization, PostgreSQL composite indexing, and payment gateway architectures by Manoj K.C."
        canonical="https://manojkc1.com.np/writing"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          '@id': 'https://manojkc1.com.np/writing#collection',
          url: 'https://manojkc1.com.np/writing',
          name: 'Writing & Technical Articles | Manoj K.C.',
          description:
            'Deep dives on Python, Django, PostgreSQL, and backend systems architecture by Manoj K.C.',
          isPartOf: { '@id': 'https://manojkc1.com.np/#website' },
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
          className="max-w-3xl mb-12"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200/80 dark:border-indigo-900/60 mb-4 font-mono uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Articles & Notes</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
            Technical Writing & Notes
          </h1>

          <p className="mt-4 text-base sm:text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed">
            Reflections from the backend trenches: Django query profiling, PostgreSQL index optimization, idempotent payment orchestration, and production debugging.
          </p>
        </motion.div>

        {/* If posts exist, render tag filter & post grid */}
        {posts.length > 0 ? (
          <div>
            {/* Tag Filter Pills */}
            <div className="flex flex-wrap gap-2 mb-10 pb-4 border-b border-neutral-200/80 dark:border-neutral-800">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSelectedTag(tag)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-mono capitalize transition-all cursor-pointer ${
                    selectedTag === tag
                      ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post: Post) => (
                <article
                  key={post.slug}
                  className="group flex flex-col justify-between p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 hover:border-indigo-300 dark:hover:border-indigo-800 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div>
                    <div className="flex items-center gap-3 text-xs text-neutral-400 dark:text-neutral-500 font-mono mb-3">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{post.date}</span>
                      </span>
                      <span>&bull;</span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{post.readingTime} min read</span>
                      </span>
                    </div>

                    <h2 className="text-lg font-bold text-neutral-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-2">
                      <Link to={`/writing/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h2>

                    <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed mb-4">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {post.tags.slice(0, 2).map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 text-[10px] font-mono rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>

                    <Link
                      to={`/writing/${post.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-0.5 transition-transform"
                    >
                      <span>Read</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ) : (
          /* Empty State + Newsletter Subscription Box */
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="max-w-2xl mx-auto my-12 p-8 sm:p-12 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 shadow-xl text-center"
          >
            <div className="w-14 h-14 mx-auto mb-6 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-900/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Mail className="w-7 h-7" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white mb-3">
              Articles In The Oven
            </h2>

            <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed mb-8 max-w-lg mx-auto">
              I am currently drafting technical write-ups covering PostgreSQL query plan optimization in Django, idempotent payment webhooks with Khalti/eSewa, and building safe AST expression evaluators.
            </p>

            {subscribed ? (
              <div className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/80 text-emerald-700 dark:text-emerald-300 text-sm font-semibold">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Thank you! You will be the first to know when the next article drops.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email for updates..."
                  className="flex-1 px-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-colors cursor-pointer shrink-0 shadow-xs"
                >
                  Notify Me
                </button>
              </form>
            )}

            <div className="mt-8 pt-6 border-t border-neutral-100 dark:border-neutral-800/80 flex justify-center gap-6 text-xs text-neutral-500 font-mono">
              <span>Zero spam</span>
              <span>&bull;</span>
              <span>Pure technical insights</span>
              <span>&bull;</span>
              <span>Unsubscribe anytime</span>
            </div>
          </motion.div>
        )}
      </main>
    </>
  );
};
