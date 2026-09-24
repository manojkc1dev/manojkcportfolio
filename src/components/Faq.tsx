import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';

export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQ_DATA: FaqItem[] = [
  {
    question: 'What backend technologies does Manoj K.C. specialize in?',
    answer:
      'Manoj K.C. specializes in Python 3.12, Django 5.x, Django REST Framework (DRF), and PostgreSQL database architecture. His engineering core encompasses composite B-Tree query indexing, Celery asynchronous task queues, Redis caching, Docker containerization, and Linux server operations. He develops secure RESTful APIs fortified with JWT authentication, role-based access control (RBAC), and strict input validation.',
  },
  {
    question: 'Is Manoj K.C. available for remote freelance work?',
    answer:
      'Yes, Manoj K.C. is actively available for remote freelance engineering contracts, technical backend consulting, and full-time junior-to-mid backend engineering roles. Based in Kathmandu, Nepal (NPT / UTC+5:45), he collaborates effectively with international engineering teams across North America, Europe, and Asia-Pacific via asynchronous Git workflows, clear documentation, and prompt communication.',
  },
  {
    question: 'What payment gateways has Manoj K.C. integrated?',
    answer:
      'Manoj K.C. has built production-grade integrations with Nepalese fintech payment gateways including Khalti API v2 and eSewa EPAY v2 (with HMAC-SHA256 signature verification), as well as global gateways like Stripe. His payment architectures enforce strict transaction idempotency keys, automated reconciliation retries, and failure-safe webhook pipelines to guarantee zero duplicate charges.',
  },
  {
    question: 'How does Manoj K.C. optimize database performance in Django/PostgreSQL?',
    answer:
      'Manoj systematically profiles execution bottlenecks using PostgreSQL EXPLAIN ANALYZE and Django Debug Toolbar. He eliminates N+1 query loops using select_related and prefetch_related, designs composite indexes tailored to high-cardinality filters, and leverages Redis for cached hot query results—achieving verified ~30% API response time reductions on high-traffic endpoints.',
  },
];

export const Faq: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section
      id="faq"
      aria-label="Frequently Asked Questions"
      className="py-20 sm:py-24 relative overflow-hidden bg-neutral-100/50 dark:bg-neutral-900/30 border-y border-neutral-200/80 dark:border-neutral-800/80"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800/60 text-xs font-mono font-medium text-indigo-700 dark:text-indigo-300 mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions?</span>
          </div>

          <h2
            id="faq-heading"
            className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white"
          >
            Frequently Asked Questions
          </h2>

          <p className="mt-4 text-sm sm:text-base text-neutral-600 dark:text-neutral-400">
            Everything you need to know about Manoj K.C.&apos;s technical specialization, remote availability, and engineering practices.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {FAQ_DATA.map((item, idx) => {
            const isOpen = openIndex === idx;
            const contentId = `faq-answer-${idx}`;
            const buttonId = `faq-question-${idx}`;

            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'bg-white dark:bg-neutral-900/90 border-indigo-300 dark:border-indigo-700/60 shadow-md shadow-indigo-500/5'
                    : 'bg-white/70 dark:bg-neutral-900/50 border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
                }`}
              >
                <h3>
                  <button
                    type="button"
                    id={buttonId}
                    aria-expanded={isOpen}
                    aria-controls={contentId}
                    onClick={() => toggleAccordion(idx)}
                    className="w-full text-left px-5 sm:px-6 py-5 flex items-center justify-between gap-4 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-2xl"
                  >
                    <span className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white tracking-tight">
                      {item.question}
                    </span>
                    <span
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 ${
                        isOpen
                          ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rotate-180'
                          : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </span>
                  </button>
                </h3>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={contentId}
                      role="region"
                      aria-labelledby={buttonId}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                    >
                      <div className="px-5 sm:px-6 pb-6 pt-1 text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed border-t border-neutral-100 dark:border-neutral-800/80">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Bottom Helper Note with Call to Action */}
        <div className="mt-10 p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 text-center flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
            <Sparkles className="w-4 h-4 text-indigo-500 shrink-0" />
            <span>Have a specific project or technical question in mind?</span>
          </div>
          <a
            href="#contact"
            className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors shadow-xs shrink-0"
          >
            Get in Touch Directly &rarr;
          </a>
        </div>
      </div>
    </section>
  );
};
