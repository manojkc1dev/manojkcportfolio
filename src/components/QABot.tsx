import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Send,
  Sparkles,
  Bot,
  User,
  RotateCcw,
  Volume2,
  VolumeX,
  ArrowRight,
  ExternalLink,
  Phone,
  Mail,
  ShieldCheck,
  Zap,
  Layers,
  CreditCard,
  Briefcase,
  Database,
  Lock,
} from 'lucide-react';
import { soundFx } from '../lib/soundFx';
import { useTheme } from '../context/ThemeContext';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  suggestedActions?: Array<{
    label: string;
    actionType: 'link' | 'query';
    target: string;
  }>;
}

interface KnowledgeTopic {
  id: string;
  category: 'tech' | 'database' | 'payments' | 'hiring' | 'projects' | 'security';
  keywords: string[];
  patterns: RegExp[];
  answer: string;
  suggestedActions?: Array<{
    label: string;
    actionType: 'link' | 'query';
    target: string;
  }>;
}

const KNOWLEDGE_BASE: KnowledgeTopic[] = [
  // 1. GREETINGS & INTRO
  {
    id: 'greeting',
    category: 'tech',
    keywords: ['hi', 'hello', 'hey', 'namaste', 'morning', 'afternoon', 'evening', 'sup', 'yo', 'start'],
    patterns: [/\b(hi|hello|hey|namaste|greetings)\b/i],
    answer:
      "Namaste! 🙏 I'm Manoj's Technical Portfolio Assistant.\n\nI can provide deep technical insights into Manoj's backend architectures, PostgreSQL performance benchmarks, payment integrations, or availability for freelance and full-time engineering.\n\nSelect a topic below or type any technical question:",
    suggestedActions: [
      { label: '🛠️ Backend Specialization', actionType: 'query', target: 'What backend technologies does Manoj specialize in?' },
      { label: '⚡ PostgreSQL Optimization', actionType: 'query', target: 'How does Manoj optimize database performance in Django/PostgreSQL?' },
      { label: '💳 Payment Gateways & Idempotency', actionType: 'query', target: 'What payment gateways has Manoj integrated?' },
      { label: '💼 Rates & Remote Availability', actionType: 'query', target: 'What are Manoj’s project rates and freelance availability?' },
    ],
  },

  // 2. TECH STACK & BACKEND SPECIALIZATION (FAQ 1)
  {
    id: 'tech_stack',
    category: 'tech',
    keywords: ['tech', 'stack', 'technology', 'skills', 'languages', 'python', 'django', 'drf', 'fastapi', 'rest', 'api', 'tools'],
    patterns: [/what\s+(backend\s+)?technolog(y|ies)/i, /tech\s*stack/i, /skills/i, /what\s+tools/i],
    answer:
      "Manoj's core backend engineering stack:\n\n• Core Languages: Python 3.12, TypeScript, SQL\n• Frameworks: Django 5.x, Django REST Framework (DRF), FastAPI\n• Databases: PostgreSQL (advanced relational schema design, indexing), MySQL\n• Asynchronous & Caching: Redis (in-memory caching, distributed locks), Celery (task queues, scheduled cron workers)\n• Authentication & Security: JWT, OAuth2, granular RBAC, CORS/CSRF hardening\n• DevOps & Infrastructure: Docker, Docker Compose, Linux system administration, Nginx reverse proxy, GitHub Actions CI/CD",
    suggestedActions: [
      { label: '🛠️ View Detailed Skills Matrix', actionType: 'link', target: '#skills' },
      { label: '⚡ PostgreSQL Query Tuning', actionType: 'query', target: 'How does Manoj optimize database performance in Django/PostgreSQL?' },
      { label: '📂 View Production Projects', actionType: 'link', target: '#projects' },
    ],
  },

  // 3. DATABASE OPTIMIZATION & POSTGRESQL TUNING (FAQ 4)
  {
    id: 'database_optimization',
    category: 'database',
    keywords: ['database', 'postgres', 'postgresql', 'optimize', 'optimization', 'performance', 'query', 'slow', 'n+1', 'indexes', 'explain', 'analyze'],
    patterns: [/optimize\s+(database|postgres|query|performance)/i, /n\+1/i, /indexing/i, /slow\s+queries/i],
    answer:
      "Manoj systematically resolves database bottlenecks through a 4-pillar methodology:\n\n1. Execution Plan Profiling: Auditing queries with PostgreSQL `EXPLAIN (ANALYZE, BUFFERS, VERBOSE)` to identify sequential table scans and memory spills.\n2. Eliminating N+1 ORM Traps: Enforcing `select_related` for ForeignKeys/OneToOne and `prefetch_related` with `Prefetch()` objects for ManyToMany/reverse relationships.\n3. Strategic B-Tree & Partial Indexing: Creating composite indexes tailored to high-cardinality filters (`WHERE tenant_id = ? AND status = ?`) and partial indexes for active records.\n4. Redis Query Caching: Storing serialized querysets for hot, high-read endpoints with transaction-safe cache invalidation signals.\n\nVerified Outcome: ~30% latency reduction across high-traffic inventory and transaction endpoints.",
    suggestedActions: [
      { label: '📂 Inspect Retail ERP Architecture', actionType: 'link', target: '#projects' },
      { label: '💳 Payment Webhook Pipelines', actionType: 'query', target: 'What payment gateways has Manoj integrated?' },
      { label: '💬 Book Architecture Audit', actionType: 'link', target: '#contact' },
    ],
  },

  // 4. PAYMENT INTEGRATIONS & FINTECH IDEMPOTENCY (FAQ 3)
  {
    id: 'payments',
    category: 'payments',
    keywords: ['payment', 'gateway', 'khalti', 'esewa', 'connectips', 'stripe', 'checkout', 'webhook', 'idempotency', 'fintech'],
    patterns: [/what\s+payment\s+gateways/i, /payment\s+gateway/i, /khalti/i, /esewa/i, /stripe/i, /webhook/i],
    answer:
      "Manoj has engineered production payment integrations with local and international gateways:\n\n• Khalti API v2: Server-to-server token verification with automated transaction state confirmation.\n• eSewa EPAY v2: HMAC-SHA256 request signature verification and automated status reconciliation.\n• Stripe: PaymentIntents API, asynchronous webhook event subscriptions, and customer portal sync.\n\nEnterprise Reliability Protections:\n✓ Unique Idempotency Keys: Enforced at database constraint level to prevent double-charging on network retries.\n✓ Signature Verification: Cryptographic verification of all incoming webhook payloads before processing.\n✓ Dead-Letter Queue (DLQ): Failed webhook events are persisted for automated exponential-backoff replay.\n✓ Two-Phase Ledger Reconciliation: Audit trails matching gateway settlement records against internal order states.",
    suggestedActions: [
      { label: '📂 View FinTech Settlement Case Study', actionType: 'link', target: '#projects' },
      { label: '💬 Inquire About Custom Payment Engine', actionType: 'link', target: 'https://wa.me/9779842203976' },
      { label: '💼 Rates & Timelines', actionType: 'query', target: 'What are Manoj’s project rates and freelance availability?' },
    ],
  },

  // 5. RATES, TIMELINES & FREELANCE AVAILABILITY (FAQ 2)
  {
    id: 'rates_hiring',
    category: 'hiring',
    keywords: ['rate', 'rates', 'pricing', 'price', 'cost', 'hire', 'hiring', 'available', 'availability', 'freelance', 'remote', 'budget', 'quote'],
    patterns: [/rate/i, /price/i, /pricing/i, /how\s+much/i, /is\s+manoj\s+available/i, /freelance/i, /remote/i, /hire/i],
    answer:
      "Manoj is actively available for remote freelance contracts, dedicated backend engineering, and technical consulting:\n\n• Availability: Immediate (Remote worldwide or on-site in Kathmandu)\n• Collaboration Hours: Sunday – Friday, 9:00 AM – 6:00 PM NPT (UTC+5:45), with regular overlap for North American & European time zones.\n\nTransparent Pricing Guidelines:\n• Small Modules / REST API Integrations: NPR 50,000 – 100,000 (~US$380 – $750) [1-2 weeks]\n• Full-Stack / Custom Web Applications: NPR 100,000 – 200,000 (~US$750 – $1,500) [3-4 weeks]\n• Multi-Module Enterprise ERP / FinTech Platforms: NPR 200,000 – 400,000+ (~US$1,500 – $3,000+) [2-3 months]\n\nEvery project includes clean source code, Docker configs, documentation, and post-launch maintenance.",
    suggestedActions: [
      { label: '💬 Direct WhatsApp Message', actionType: 'link', target: 'https://wa.me/9779842203976' },
      { label: '✉️ Send Email Inquiry', actionType: 'link', target: 'mailto:manojkc1dev@gmail.com' },
      { label: '📝 Fill Project Request Form', actionType: 'link', target: '#contact' },
    ],
  },

  // 6. ENTERPRISE ERP & MULTI-BRANCH INVENTORY CASE STUDY
  {
    id: 'erp_case_study',
    category: 'projects',
    keywords: ['erp', 'inventory', 'warehouse', 'pos', 'case study', 'himalayan', 'retail', 'billing', 'vat'],
    patterns: [/erp/i, /inventory/i, /pos/i, /case\s+study/i, /retail/i],
    answer:
      "Manoj engineered the core backend for the Himalayan Retail Group Enterprise ERP:\n\n• Challenge: Synchronizing high-volume stock movements across 5 distribution warehouses and 12 retail POS branches.\n• Solution: Designed a distributed Django/PostgreSQL architecture with Celery workers for offline-first queue synchronization, double-entry financial ledgers, and automated VAT invoicing compliant with Inland Revenue Department regulations.\n• Scale: Handles 50,000+ SKU movements daily with zero stock drift and sub-80ms transaction confirmation.",
    suggestedActions: [
      { label: '📂 Explore Full Project Details', actionType: 'link', target: '#projects' },
      { label: '⚡ Review PostgreSQL Tuning Used', actionType: 'query', target: 'How does Manoj optimize database performance in Django/PostgreSQL?' },
      { label: '💬 Discuss a Custom ERP', actionType: 'link', target: 'https://wa.me/9779842203976' },
    ],
  },

  // 7. SECURITY, AUTHENTICATION & RBAC
  {
    id: 'security',
    category: 'security',
    keywords: ['security', 'auth', 'authentication', 'jwt', 'rbac', 'permissions', 'owasp', 'safe', 'protect'],
    patterns: [/security/i, /authentication/i, /jwt/i, /rbac/i, /how\s+do\s+you\s+secure/i],
    answer:
      "Manoj enforces rigorous enterprise security across all API deployments:\n\n• Authentication: Stateless JWT with short-lived access tokens, encrypted refresh tokens stored in HttpOnly SameSite cookies, and token blacklisting on logout.\n• Authorization: Granular Role-Based Access Control (RBAC) via custom Django REST permissions, decoupling user roles from domain business logic.\n• Data Protection: Parameterized ORM queries preventing SQL injection, strict input sanitization, automated rate-limiting via Redis, and secure secret management via environment variables.\n• Transport: Mandatory HTTPS, HSTS, secure CORS origin whitelisting, and strict Content Security Policies (CSP).",
    suggestedActions: [
      { label: '🛠️ View Engineering Philosophy', actionType: 'link', target: '#about' },
      { label: '💳 Payment Gateway Security', actionType: 'query', target: 'What payment gateways has Manoj integrated?' },
      { label: '📩 Inquire for Security Audit', actionType: 'link', target: '#contact' },
    ],
  },

  // 8. DIRECT CONTACT & COMMUNICATION
  {
    id: 'contact_direct',
    category: 'hiring',
    keywords: ['contact', 'reach', 'email', 'phone', 'whatsapp', 'call', 'talk', 'address', 'location'],
    patterns: [/how\s+to\s+contact/i, /phone/i, /email/i, /whatsapp/i, /reach/i, /location/i],
    answer:
      "Direct channels to connect with Manoj K.C.:\n\n• Phone / WhatsApp: +977 9842203976 (Direct response within 2 hours)\n• Email: manojkc1dev@gmail.com\n• LinkedIn: linkedin.com/in/manojkc1dev\n• GitHub: github.com/manojkc1dev\n• Location: Kathmandu, Nepal (Available for international contracts)",
    suggestedActions: [
      { label: '💬 Open WhatsApp Chat', actionType: 'link', target: 'https://wa.me/9779842203976' },
      { label: '✉️ Email Manoj', actionType: 'link', target: 'mailto:manojkc1dev@gmail.com' },
      { label: '📝 Submit Contact Form', actionType: 'link', target: '#contact' },
    ],
  },
];

const FALLBACK_RESPONSE: {
  answer: string;
  suggestedActions: NonNullable<KnowledgeTopic['suggestedActions']>;
} = {
  answer:
    "I'm here to provide verified technical facts about Manoj's backend engineering, database architectures, payment pipelines, or contract rates. Please choose a topic below or reach out directly:",
  suggestedActions: [
    { label: '⚡ Backend & Tech Stack', actionType: 'query', target: 'What backend technologies does Manoj specialize in?' },
    { label: '🚀 Database Optimization', actionType: 'query', target: 'How does Manoj optimize database performance in Django/PostgreSQL?' },
    { label: '💳 Payment Gateways', actionType: 'query', target: 'What payment gateways has Manoj integrated?' },
    { label: '💼 Rates & Availability', actionType: 'query', target: 'What are Manoj’s project rates and freelance availability?' },
  ],
};

function matchQuery(userQuery: string): { answer: string; suggestedActions?: KnowledgeTopic['suggestedActions'] } {
  const clean = userQuery.toLowerCase().trim();

  let bestTopic: KnowledgeTopic | null = null;
  let maxScore = 0;

  for (const topic of KNOWLEDGE_BASE) {
    let score = 0;

    for (const pat of topic.patterns) {
      if (pat.test(clean)) {
        score += 8;
      }
    }

    for (const kw of topic.keywords) {
      if (clean.includes(kw)) {
        score += 3;
      }
    }

    if (score > maxScore) {
      maxScore = score;
      bestTopic = topic;
    }
  }

  if (bestTopic && maxScore >= 3) {
    return {
      answer: bestTopic.answer,
      suggestedActions: bestTopic.suggestedActions,
    };
  }

  return FALLBACK_RESPONSE;
}

export const QABot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSoundMuted, setIsSoundMuted] = useState(false);
  const { theme } = useTheme();

  const initialBotMessage: ChatMessage = {
    id: 'msg-welcome',
    sender: 'bot',
    text: "Namaste! I'm Manoj's Technical Portfolio Assistant. You can ask deep technical questions about his backend architecture, database tuning, payment integrations, or select a topic below:",
    timestamp: 'Just now',
    suggestedActions: [
      { label: '🛠️ Backend Specialization', actionType: 'query', target: 'What backend technologies does Manoj specialize in?' },
      { label: '⚡ PostgreSQL Tuning', actionType: 'query', target: 'How does Manoj optimize database performance in Django/PostgreSQL?' },
      { label: '💳 Payment Gateways & Idempotency', actionType: 'query', target: 'What payment gateways has Manoj integrated?' },
      { label: '💼 Rates & Remote Availability', actionType: 'query', target: 'What are Manoj’s project rates and freelance availability?' },
    ],
  };

  const [messages, setMessages] = useState<ChatMessage[]>([initialBotMessage]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages, isTyping]);

  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query) return;

    if (!isSoundMuted) soundFx.playSend();

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const match = matchQuery(query);
      const botReply: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: match.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: match.suggestedActions,
      };
      setMessages((prev) => [...prev, botReply]);
      setIsTyping(false);

      if (!isSoundMuted) soundFx.playReceive();
    }, 350);
  };

  const handleClearChat = () => {
    if (!isSoundMuted) soundFx.playTap();
    setMessages([initialBotMessage]);
  };

  const handleActionClick = (action: { label: string; actionType: 'link' | 'query'; target: string }) => {
    if (!isSoundMuted) soundFx.playTap();
    if (action.actionType === 'query') {
      handleSendMessage(action.target);
    } else if (action.actionType === 'link') {
      if (action.target.startsWith('#')) {
        const el = document.querySelector(action.target);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
          setIsOpen(false);
        }
      } else {
        window.open(action.target, '_blank', 'noopener,noreferrer');
      }
    }
  };

  const toggleSound = () => {
    const nextMuted = !isSoundMuted;
    setIsSoundMuted(nextMuted);
    soundFx.enabled = !nextMuted;
    if (!nextMuted) soundFx.playTap();
  };

  return (
    <>
      {/* Floating Trigger Button: Docked vertically at bottom-right */}
      <div className="fixed bottom-6 right-6 z-40">
        <motion.button
          type="button"
          id="qa-bot-trigger-button"
          onClick={() => {
            const nextState = !isOpen;
            setIsOpen(nextState);
            window.dispatchEvent(new CustomEvent('portfolio:chat-toggle', { detail: { open: nextState } }));
            if (!isSoundMuted) soundFx.playTap();
          }}
          aria-label={isOpen ? "Close Manoj's Assistant" : "Open Manoj's Assistant"}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative w-12 h-12 sm:w-[52px] sm:h-[52px] rounded-full p-[2px] bg-gradient-to-tr from-indigo-500 via-indigo-600 to-emerald-500 shadow-xl shadow-indigo-950/20 dark:shadow-indigo-950/50 hover:shadow-indigo-500/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-950 cursor-pointer transition-all flex items-center justify-center group"
        >
          {isOpen ? (
            <div className="w-full h-full rounded-full bg-white dark:bg-neutral-900 text-neutral-800 dark:text-white flex items-center justify-center border border-neutral-200 dark:border-neutral-700/80 shadow-inner">
              <X className="w-5 h-5 text-neutral-800 dark:text-white" />
            </div>
          ) : (
            <div className="relative w-full h-full rounded-full overflow-hidden border border-neutral-200 dark:border-neutral-700/80 bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center">
              <img
                src="/images/ai_chatbot.png"
                alt="Manoj's Assistant"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.endsWith('ai_chatbot.jpg')) {
                    target.src = '/images/ai_chatbot.jpg';
                  }
                }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {/* Online Pulse Dot */}
              <span className="absolute top-0 right-0 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-white dark:border-neutral-950" />
              </span>
            </div>
          )}
          {/* Tooltip */}
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-neutral-900/90 dark:bg-neutral-900/95 border border-neutral-700 dark:border-neutral-800 text-xs font-medium text-white shadow-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap hidden sm:block">
            {isOpen ? 'Close Assistant' : 'Ask Manoj AI'}
          </span>
        </motion.button>
      </div>

      {/* Slide-Up Chat Modal Card: Full Light & Dark Mode System Awareness */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            id="qa-bot-chat-window"
            className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] h-[600px] max-h-[calc(100vh-7.5rem)] bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 rounded-2xl shadow-2xl border border-neutral-200/90 dark:border-neutral-800 flex flex-col overflow-hidden backdrop-blur-xl ring-1 ring-black/5 dark:ring-white/10"
          >
            {/* Header */}
            <div className="px-4 py-3 bg-neutral-50/95 dark:bg-neutral-900/95 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative w-9 h-9 rounded-full overflow-hidden border border-emerald-500/80 shadow-sm shrink-0">
                  <img
                    src="/images/ai_chatbot.png"
                    alt="Manoj's Assistant"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.src.endsWith('ai_chatbot.jpg')) {
                        target.src = '/images/ai_chatbot.jpg';
                      }
                    }}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-0 right-0 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-neutral-900 dark:text-white tracking-wide">
                    Manoj's Assistant
                  </h3>
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                    Online · Technical Portfolio Advisor
                  </p>
                </div>
              </div>

              {/* Minimal Controls Toolbar */}
              <div className="flex items-center gap-1">
                {/* Sound Toggle */}
                <button
                  type="button"
                  onClick={toggleSound}
                  title={isSoundMuted ? 'Unmute tactile sound' : 'Mute tactile sound'}
                  className="p-1.5 rounded-lg text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200/70 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  {isSoundMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
                </button>

                {/* Reset Chat */}
                <button
                  type="button"
                  onClick={handleClearChat}
                  title="Reset conversation"
                  className="p-1.5 rounded-lg text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200/70 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                {/* Close */}
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  title="Close window"
                  className="p-1.5 rounded-lg text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200/70 dark:hover:bg-neutral-800 transition-colors cursor-pointer ml-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Interactive Inquiry Chips Ribbon (High-Value Technical Prompts) */}
            <div className="px-3 py-2 bg-neutral-100/70 dark:bg-neutral-900/60 border-b border-neutral-200/80 dark:border-neutral-800/80 overflow-x-auto flex items-center gap-1.5 no-scrollbar shrink-0">
              <button
                type="button"
                onClick={() => handleSendMessage('What backend technologies does Manoj specialize in?')}
                className="px-2.5 py-1 rounded-full bg-white dark:bg-neutral-800/90 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700/60 hover:border-indigo-400 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-white text-[11px] font-medium whitespace-nowrap transition-colors shadow-xs cursor-pointer flex items-center gap-1"
              >
                <Zap className="w-3 h-3 text-indigo-500" />
                <span>Tech Stack</span>
              </button>
              <button
                type="button"
                onClick={() => handleSendMessage('How does Manoj optimize database performance in Django/PostgreSQL?')}
                className="px-2.5 py-1 rounded-full bg-white dark:bg-neutral-800/90 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700/60 hover:border-indigo-400 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-white text-[11px] font-medium whitespace-nowrap transition-colors shadow-xs cursor-pointer flex items-center gap-1"
              >
                <Database className="w-3 h-3 text-emerald-500" />
                <span>DB Tuning</span>
              </button>
              <button
                type="button"
                onClick={() => handleSendMessage('What payment gateways has Manoj integrated?')}
                className="px-2.5 py-1 rounded-full bg-white dark:bg-neutral-800/90 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700/60 hover:border-indigo-400 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-white text-[11px] font-medium whitespace-nowrap transition-colors shadow-xs cursor-pointer flex items-center gap-1"
              >
                <CreditCard className="w-3 h-3 text-amber-500" />
                <span>Payments & Idempotency</span>
              </button>
              <button
                type="button"
                onClick={() => handleSendMessage('What are Manoj’s project rates and freelance availability?')}
                className="px-2.5 py-1 rounded-full bg-white dark:bg-neutral-800/90 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700/60 hover:border-indigo-400 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-white text-[11px] font-medium whitespace-nowrap transition-colors shadow-xs cursor-pointer flex items-center gap-1"
              >
                <Briefcase className="w-3 h-3 text-sky-500" />
                <span>Rates & Availability</span>
              </button>
              <button
                type="button"
                onClick={() => handleSendMessage('How does Manoj handle authentication, JWT, and RBAC security?')}
                className="px-2.5 py-1 rounded-full bg-white dark:bg-neutral-800/90 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700/60 hover:border-indigo-400 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-white text-[11px] font-medium whitespace-nowrap transition-colors shadow-xs cursor-pointer flex items-center gap-1"
              >
                <Lock className="w-3 h-3 text-purple-500" />
                <span>Security & RBAC</span>
              </button>
            </div>

            {/* Messages Body */}
            <div className="flex-1 p-3.5 sm:p-4 overflow-y-auto space-y-3.5 text-xs">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'bot' && (
                    <div className="w-7 h-7 rounded-full bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center shrink-0 mt-0.5 text-indigo-600 dark:text-indigo-400">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div className={`max-w-[86%] space-y-2 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`p-3.5 rounded-2xl leading-relaxed whitespace-pre-line text-[12.5px] shadow-xs ${
                        msg.sender === 'user'
                          ? 'bg-indigo-600 text-white rounded-tr-none font-medium'
                          : 'bg-neutral-100/90 dark:bg-neutral-900/90 border border-neutral-200/80 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 rounded-tl-none'
                      }`}
                    >
                      {msg.text}
                    </div>

                    {/* Interactive Action Suggestion Chips */}
                    {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {msg.suggestedActions.map((action, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => handleActionClick(action)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700/80 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 hover:border-indigo-300 dark:hover:border-indigo-500 hover:text-indigo-700 dark:hover:text-white transition-colors cursor-pointer shadow-2xs"
                          >
                            <span>{action.label}</span>
                            {action.actionType === 'link' && <ArrowRight className="w-3 h-3 opacity-70" />}
                          </button>
                        ))}
                      </div>
                    )}

                    <span className="text-[10px] text-neutral-400 dark:text-neutral-500 block px-1">
                      {msg.timestamp}
                    </span>
                  </div>

                  {msg.sender === 'user' && (
                    <div className="w-7 h-7 rounded-full bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 flex items-center justify-center shrink-0 mt-0.5 text-neutral-700 dark:text-neutral-300">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              ))}

              {/* Bot Typing Indicator */}
              {isTyping && (
                <div className="flex gap-2.5 justify-start items-center">
                  <div className="w-7 h-7 rounded-full bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center shrink-0 text-indigo-600 dark:text-indigo-400">
                    <Bot className="w-4 h-4 animate-spin" />
                  </div>
                  <div className="bg-neutral-100/90 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 p-2.5 rounded-2xl rounded-tl-none flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400 animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400 animate-bounce [animation-delay:0.15s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400 animate-bounce [animation-delay:0.3s]" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 bg-neutral-50 dark:bg-neutral-900/95 border-t border-neutral-200 dark:border-neutral-800 flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about Django, PostgreSQL, payments, rates..."
                className="flex-1 px-3.5 py-2 rounded-xl bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-2xs"
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                title="Send message"
                className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white transition-colors cursor-pointer shrink-0 shadow-xs"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
