import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Send,
  Sparkles,
  Bot,
  User,
  ArrowRight,
  RotateCcw,
  ExternalLink,
  Phone,
  Mail,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

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
    keywords: ['hi', 'hello', 'hey', 'namaste', 'morning', 'afternoon', 'evening', 'sup', 'yo'],
    patterns: [/\b(hi|hello|hey|namaste|greetings)\b/i],
    answer:
      "Namaste! 🙏 I'm Manoj's Assistant. I can answer questions about his software engineering services, tech stack, past projects, pricing, or how to get in touch. How can I help you today?",
    suggestedActions: [
      { label: '🛠️ What services do you offer?', actionType: 'query', target: 'What services do you offer?' },
      { label: '💻 What is your tech stack?', actionType: 'query', target: 'What is your tech stack?' },
      { label: '💰 How much does a project cost?', actionType: 'query', target: 'What are your rates and pricing?' },
    ],
  },
  {
    id: 'who_is_manoj',
    keywords: ['who', 'manoj', 'about', 'background', 'bio', 'engineer', 'developer', 'profile'],
    patterns: [/who\s+is\s+manoj/i, /tell\s+me\s+about\s+(him|manoj|yourself)/i, /background/i],
    answer:
      "Manoj K.C. is a dedicated Backend Software Engineer based in Kathmandu, Nepal. He specializes in Python, Django REST Framework, PostgreSQL, and modern React/TypeScript. He has built enterprise ERP platforms, high-throughput payment webhook engines, and scalable SaaS backends.",
    suggestedActions: [
      { label: '📂 View Portfolio Projects', actionType: 'link', target: '#projects' },
      { label: '📞 Contact Details', actionType: 'query', target: 'How can I contact Manoj?' },
    ],
  },

  // 2. TECH STACK & SKILLS
  {
    id: 'tech_stack',
    keywords: ['tech', 'stack', 'technology', 'technologies', 'skills', 'languages', 'python', 'django', 'react', 'postgres', 'database', 'tools'],
    patterns: [/tech\s*stack/i, /technolog(y|ies)/i, /what\s+tools/i, /skills/i, /programming\s+language/i],
    answer:
      "Manoj's core technical expertise includes:\n\n• Backend: Python, Django, Django REST Framework (DRF), FastAPI, Node.js\n• Databases & Cache: PostgreSQL, MySQL, Redis, Celery background queues\n• Frontend: React, TypeScript, Next.js, Tailwind CSS\n• Integrations: Khalti, eSewa, Stripe, ConnectIPS\n• DevOps & Cloud: Docker, Linux server hardening, Nginx, Git, CI/CD",
    suggestedActions: [
      { label: '🛠️ View Detailed Skills', actionType: 'link', target: '#skills' },
      { label: '📂 See Projects Using Django', actionType: 'query', target: 'Tell me about projects built with Django' },
    ],
  },

  // 3. SERVICES & OFFERINGS
  {
    id: 'services',
    keywords: ['service', 'services', 'offer', 'offerings', 'build', 'what can you do', 'solutions', 'erp', 'api', 'web development'],
    patterns: [/what\s+(services|can\s+you\s+do|do\s+you\s+offer)/i, /services/i, /solutions/i],
    answer:
      "Key engineering services provided:\n\n1. Enterprise ERP & Business Management Systems (multi-branch stock sync, VAT compliance, ledgers)\n2. Custom Web Application Development (fast, responsive React & Next.js apps)\n3. High-Throughput RESTful APIs & Microservices\n4. Payment Gateway Integrations (Khalti, eSewa, ConnectIPS, Stripe)\n5. Database Design & Query Optimization (PostgreSQL tuning)\n6. Cloud DevOps & Production Docker deployments",
    suggestedActions: [
      { label: '💰 Inquire About Pricing', actionType: 'query', target: 'What are your rates and pricing?' },
      { label: '📩 Start a Project', actionType: 'link', target: '#contact' },
    ],
  },

  // 4. ERP & BUSINESS MANAGEMENT SYSTEMS
  {
    id: 'erp_systems',
    keywords: ['erp', 'inventory', 'warehouse', 'pos', 'billing', 'vat', 'accounting', 'ledger', 'stock'],
    patterns: [/erp/i, /inventory/i, /accounting/i, /billing/i, /pos/i],
    answer:
      "Yes! Manoj has deep hands-on experience engineering custom Enterprise ERP solutions. His implementations feature multi-warehouse inventory tracking, real-time stock sync, double-entry ledgers, automated VAT invoicing, and role-based staff permissions. He built the Himalayan Retail Group ERP platform handling 50,000+ daily SKU movements.",
    suggestedActions: [
      { label: '📂 View ERP Case Study', actionType: 'link', target: '#projects' },
      { label: '💬 Discuss Custom ERP', actionType: 'link', target: 'https://wa.me/9779842203976' },
    ],
  },

  // 5. PROJECTS & PORTFOLIO
  {
    id: 'projects',
    keywords: ['project', 'projects', 'portfolio', 'work', 'case study', 'built', 'examples', 'showcase'],
    patterns: [/what\s+projects/i, /portfolio/i, /past\s+work/i, /case\s+stud(y|ies)/i],
    answer:
      "Featured production systems engineered by Manoj:\n\n• Enterprise ERP & Inventory Platform (Retail supply chain with offline sync)\n• FinTech Payment Settlement Engine (Automated escrow & dual webhook verification)\n• Omnichannel E-Commerce Platform (Headless storefront with high conversion)\n• Hospitality Resort Booking Portal (Direct commission-free booking engine)\n• Smart City Waste Management Dispatch (GIS spatial fleet optimization)\n• Telemedicine & EHR Suite (Encrypted clinical records & WebRTC)",
    suggestedActions: [
      { label: '📂 Explore Projects Section', actionType: 'link', target: '#projects' },
      { label: '🔗 Visit GitHub Profile', actionType: 'link', target: 'https://github.com/manojkc1dev/' },
    ],
  },

  // 6. PRICING, RATES & BUDGET
  {
    id: 'pricing',
    keywords: ['price', 'pricing', 'cost', 'rate', 'rates', 'budget', 'quote', 'quotation', 'how much', 'fee', 'charge', 'expensive', 'npr', 'usd', 'dollars'],
    patterns: [/how\s+much/i, /cost/i, /pric(e|ing)/i, /budget/i, /rates?/i, /quote/i],
    answer:
      "Pricing is transparent and based on project scope and technical complexity:\n\n• Rapid Prototype / MVP: NPR 50,000 – 100,000 (~US$380 – $750) [1-2 weeks]\n• Full Custom Web App: NPR 100,000 – 200,000 (~US$750 – $1,500) [3-4 weeks]\n• Multi-Module Enterprise ERP: NPR 200,000 – 400,000+ (~US$1,500 – $3,000+) [2-3 months]\n\nEvery project includes clean source code ownership, production deployment, and post-launch support.",
    suggestedActions: [
      { label: '📋 Request a Custom Quote', actionType: 'link', target: '#contact' },
      { label: '💬 Chat on WhatsApp', actionType: 'link', target: 'https://wa.me/9779842203976' },
    ],
  },

  // 7. TIMELINE & TURNAROUND
  {
    id: 'timeline',
    keywords: ['timeline', 'time', 'how long', 'duration', 'weeks', 'months', 'deadline', 'fast', 'delivery'],
    patterns: [/how\s+long/i, /timeline/i, /duration/i, /when\s+can\s+you\s+deliver/i],
    answer:
      "Typical delivery timelines:\n\n• Small tools / API modules: 1 to 2 weeks\n• MVP & standard web applications: 3 to 4 weeks\n• Comprehensive enterprise platforms / ERP: 2 to 3 months\n\nAll builds follow structured agile sprints with regular staging reviews and updates.",
    suggestedActions: [
      { label: '📅 Discuss Your Timeline', actionType: 'link', target: '#contact' },
    ],
  },

  // 8. CONTACT & GETTING IN TOUCH
  {
    id: 'contact',
    keywords: ['contact', 'reach', 'email', 'phone', 'whatsapp', 'call', 'talk', 'hire', 'get in touch', 'message', 'address', 'location', 'where'],
    patterns: [/how\s+to\s+contact/i, /reach\s+(him|you)/i, /phone/i, /email/i, /whatsapp/i, /location/i, /where\s+are\s+you/i],
    answer:
      "You can connect directly with Manoj via any of these channels:\n\n• WhatsApp / Phone: +977 9842203976\n• Official Email: manojkc1dev@gmail.com\n• Location: Kathmandu, Nepal (Serving clients locally & internationally)\n• Working Hours: Sunday – Friday, 9:00 AM – 6:00 PM NPT (UTC+5:45)",
    suggestedActions: [
      { label: '💬 Direct WhatsApp Chat', actionType: 'link', target: 'https://wa.me/9779842203976' },
      { label: '✉️ Send Email', actionType: 'link', target: 'mailto:manojkc1dev@gmail.com' },
      { label: '📝 Fill Contact Form', actionType: 'link', target: '#contact' },
    ],
  },

  // 9. HIRING / AVAILABILITY
  {
    id: 'hiring',
    keywords: ['hire', 'available', 'availability', 'freelance', 'fulltime', 'remote', 'job', 'contract', 'junior', 'developer'],
    patterns: [/are\s+you\s+available/i, /hire\s+you/i, /freelance/i, /job\s+opportunity/i, /remote/i],
    answer:
      "Yes! Manoj is currently open to:\n\n1. Freelance & contract software development projects\n2. Junior to mid-level Backend Software Engineer roles (Remote or Kathmandu-based)\n3. Technical consultations and database/code performance audits.\n\nHe responds to inquiries promptly, usually within a few hours.",
    suggestedActions: [
      { label: '✉️ Discuss Opportunity', actionType: 'link', target: 'mailto:manojkc1dev@gmail.com' },
      { label: '🔗 Connect on LinkedIn', actionType: 'link', target: 'https://linkedin.com/in/manojkc1dev/' },
    ],
  },

  // 10. PAYMENT INTEGRATIONS (KHALTI, ESEWA, STRIPE)
  {
    id: 'payments',
    keywords: ['khalti', 'esewa', 'connectips', 'stripe', 'payment', 'gateway', 'checkout', 'webhook'],
    patterns: [/payment\s+gateway/i, /khalti/i, /esewa/i, /connectips/i, /stripe/i],
    answer:
      "Manoj has extensive experience with payment architectures. He integrates Khalti, eSewa, ConnectIPS, and Stripe with idempotent webhook handling, duplicate payment prevention, HMAC signature validation, and real-time transaction reconciliation.",
    suggestedActions: [
      { label: '📂 View Payment Engine Project', actionType: 'link', target: '#projects' },
      { label: '💬 Inquire About Integration', actionType: 'link', target: '#contact' },
    ],
  },

  // 11. SECURITY & CODE QUALITY
  {
    id: 'security',
    keywords: ['security', 'quality', 'owasp', 'jwt', 'rbac', 'safe', 'testing', 'audit'],
    patterns: [/security/i, /data\s+safety/i, /code\s+quality/i, /rbac/i, /jwt/i],
    answer:
      "Security and clean architecture are top priorities. Manoj implements JWT & session-based authentication, granular Role-Based Access Control (RBAC), database connection pooling, sanitized inputs against SQL injections & XSS, and encrypted environment configurations.",
    suggestedActions: [
      { label: '🛠️ Review Tech Philosophy', actionType: 'link', target: '#about' },
    ],
  },
];

// Fallback response when query is unrecognized
const FALLBACK_RESPONSE: {
  answer: string;
  suggestedActions: NonNullable<KnowledgeTopic['suggestedActions']>;
} = {
  answer:
    "I'm here to help with information about Manoj's backend engineering work, services, pricing, tech stack, or hiring availability. Would you like to check one of these popular topics, or connect with him directly?",
  suggestedActions: [
    { label: '🛠️ Services Offered', actionType: 'query', target: 'What services do you offer?' },
    { label: '💻 Tech Stack', actionType: 'query', target: 'What is your tech stack?' },
    { label: '💰 Pricing & Rates', actionType: 'query', target: 'What are your rates and pricing?' },
    { label: '💬 Chat on WhatsApp', actionType: 'link', target: 'https://wa.me/9779842203976' },
  ],
};

function matchQuery(userQuery: string): { answer: string; suggestedActions?: KnowledgeTopic['suggestedActions'] } {
  const clean = userQuery.toLowerCase().trim();

  let bestTopic: KnowledgeTopic | null = null;
  let maxScore = 0;

  for (const topic of KNOWLEDGE_BASE) {
    let score = 0;

    // Pattern regex matching (high weight)
    for (const pat of topic.patterns) {
      if (pat.test(clean)) {
        score += 8;
      }
    }

    // Keyword matching
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
  const [hasUnread, setHasUnread] = useState(true);

  const initialBotMessage: ChatMessage = {
    id: 'msg-welcome',
    sender: 'bot',
    text: "Hi there! 👋 I'm Manoj's Assistant. How can I help you today? You can ask about services, tech stack, past projects, pricing, or how to get in touch.",
    timestamp: 'Just now',
    suggestedActions: [
      { label: '🛠️ What services do you offer?', actionType: 'query', target: 'What services do you offer?' },
      { label: '💻 What is your tech stack?', actionType: 'query', target: 'What is your tech stack?' },
      { label: '💰 Pricing & Budget', actionType: 'query', target: 'What are your rates and pricing?' },
      { label: '📞 Contact Details', actionType: 'query', target: 'How can I contact Manoj?' },
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
      setHasUnread(false);
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages, isTyping]);

  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInputValue('');
    setIsTyping(true);

    // Realistic typing effect (350ms)
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
    }, 350);
  };

  const handleClearChat = () => {
    setMessages([initialBotMessage]);
  };

  const handleActionClick = (action: { label: string; actionType: 'link' | 'query'; target: string }) => {
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

  return (
    <>
      {/* Floating Trigger Button: Positioned on the right, beside the ScrollToTop button */}
      <div className="fixed bottom-6 right-6 z-40">
        <motion.button
          type="button"
          id="qa-bot-trigger-button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close Manoj's Assistant" : "Open Manoj's Assistant"}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          className="relative w-16 h-16 sm:w-[68px] sm:h-[68px] rounded-full p-1 bg-gradient-to-tr from-emerald-500 via-indigo-600 to-purple-600 shadow-2xl shadow-indigo-600/40 hover:shadow-emerald-500/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-950 cursor-pointer transition-all flex items-center justify-center group"
        >
          {isOpen ? (
            <div className="w-full h-full rounded-full bg-neutral-900 text-white flex items-center justify-center">
              <X className="w-7 h-7 text-white" />
            </div>
          ) : (
            <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-emerald-400/90 bg-neutral-900 flex items-center justify-center">
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
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              {/* Subtle pulsing glow overlay */}
              <div className="absolute inset-0 bg-emerald-500/10 pointer-events-none rounded-full" />
            </div>
          )}
        </motion.button>
      </div>

      {/* Slide-Up Chat Modal Card */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            id="qa-bot-chat-window"
            className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[410px] h-[560px] max-h-[calc(100vh-7.5rem)] bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 flex flex-col overflow-hidden backdrop-blur-xl"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-neutral-900 via-indigo-950 to-neutral-900 text-white flex items-center justify-between border-b border-white/10 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-emerald-400 shadow-md shadow-emerald-500/20 shrink-0">
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
                </div>
                <div>
                  <h3 className="text-sm font-bold tracking-tight text-white">
                    Manoj's Assistant
                  </h3>
                  <p className="text-[11px] text-emerald-400 flex items-center gap-1.5 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Online</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleClearChat}
                  title="Reset conversation"
                  className="p-1.5 rounded-lg text-neutral-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  title="Close window"
                  className="p-1.5 rounded-lg text-neutral-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'bot' && (
                    <div className="w-7 h-7 rounded-full overflow-hidden border border-emerald-400/80 shrink-0 mt-0.5 shadow-sm">
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
                    </div>
                  )}

                  <div className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} max-w-[82%]`}>
                    <div
                      className={`rounded-2xl p-3.5 leading-relaxed whitespace-pre-line ${
                        msg.sender === 'user'
                          ? 'bg-indigo-600 text-white rounded-br-none shadow-sm'
                          : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 rounded-bl-none border border-neutral-200/70 dark:border-neutral-700/60 shadow-xs'
                      }`}
                    >
                      {msg.text}
                    </div>

                    <span className="text-[10px] text-neutral-400 mt-1 px-1 font-mono">
                      {msg.timestamp}
                    </span>

                    {/* Suggested Action Chips (if provided by bot) */}
                    {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2 max-w-[100%]">
                        {msg.suggestedActions.map((action, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleActionClick(action)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-medium bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors cursor-pointer text-left"
                          >
                            <span>{action.label}</span>
                            {action.actionType === 'link' ? (
                              <ExternalLink className="w-3 h-3 shrink-0 opacity-75" />
                            ) : (
                              <ArrowRight className="w-3 h-3 shrink-0 opacity-75" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full overflow-hidden border border-emerald-400/80 shrink-0">
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
                  </div>
                  <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-neutral-100 dark:bg-neutral-800 w-fit text-neutral-500 dark:text-neutral-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" />
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]" />
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 bg-neutral-50 dark:bg-neutral-900/80 border-t border-neutral-200 dark:border-neutral-800 flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about services, tech, pricing..."
                className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                aria-label="Send query"
                className="p-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-40 transition-all cursor-pointer disabled:cursor-not-allowed shadow-sm"
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
