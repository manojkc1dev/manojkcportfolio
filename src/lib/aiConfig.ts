import { OWNER_PROFILE } from './constants';

export interface ChatSession {
  id: string;
  startedAt: string;
  messagesCount: number;
  tokensUsed: number;
  flagged: boolean;
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
    source?: string;
  }>;
}

export interface AIConfig {
  enabled: boolean;
  model: 'gemini-1.5-flash';
  temperature: number;
  systemPrompt: string;
  perPageEnabled: {
    home: boolean;
    projects: boolean;
    contact: boolean;
  };
  dailyGlobalLimit: number;
  dailySessionLimit: number;
  dailyMessagesCount: number;
  lastResetDate: string;
  fallbackMessage: string;
  cachedQA: Record<string, string>;
}

export const DEFAULT_AI_CONFIG: AIConfig = {
  enabled: true,
  model: 'gemini-1.5-flash',
  temperature: 0.7,
  systemPrompt: `You are the AI assistant for Manoj K.C.'s portfolio. Manoj is a Python and Django Backend Developer based in Kathmandu, Nepal. Answer questions concisely, professionally, and accurately about his skills (Python, Django, DRF, PostgreSQL, JWT Auth, REST APIs, FastAPI), his projects (CalcPro Calculator and Shabdhabhandar Dictionary), his qualifications (BIT graduate 2025), and his availability. If you do not know an answer, provide a friendly disclaimer and suggest reaching out to Manoj via email (manojkc1dev@gmail.com) or WhatsApp (+977-9809807760). Always speak in third person. Never invent facts.`,
  perPageEnabled: {
    home: true,
    projects: true,
    contact: true,
  },
  dailyGlobalLimit: 500,
  dailySessionLimit: 100,
  dailyMessagesCount: 14,
  lastResetDate: new Date().toISOString().split('T')[0],
  fallbackMessage: "I'm taking a short break. Please try again in a minute, or contact Manoj directly via email or WhatsApp.",
  cachedQA: {
    "what is manoj's core backend tech stack?":
      "Manoj specializes in Python, Django, Django REST Framework (DRF), PostgreSQL, JWT Authentication, and REST API architecture, along with FastAPI, SQLite, Git, and Docker basics.",
    "can you tell me about his featured projects?":
      "Manoj has developed CalcPro Calculator (a multi-functional web calculator with Basic, Scientific, Programmer, and Financial modes) and Shabdhabhandar Dictionary (a fast English-to-Nepali dictionary engine with custom fault-tolerant Unicode search).",
    "what is his experience with django & postgresql?":
      "Manoj has hands-on experience designing normalized relational database schemas in PostgreSQL, optimizing ORM queries with prefetch_related, implementing secure JWT authentication, and structuring scalable RESTful API endpoints using Django REST Framework.",
    "is manoj available for hire or remote roles?":
      "Yes! Manoj is actively available for on-site (Kathmandu, Nepal) and remote Python/Django backend developer roles worldwide.",
    "how can i contact manoj or request an interview?":
      "You can reach Manoj directly via email at manojkc1dev@gmail.com, WhatsApp at +977-9809807760, or connect on LinkedIn (linkedin.com/in/manojkc1) and GitHub (github.com/manojkc1).",
  },
};

const STORAGE_KEY = 'manojkc_ai_config';
const SESSIONS_KEY = 'manojkc_chat_sessions';

export function loadAIConfig(): AIConfig {
  if (typeof window === 'undefined') return DEFAULT_AI_CONFIG;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      const today = new Date().toISOString().split('T')[0];
      if (parsed.lastResetDate !== today) {
        parsed.dailyMessagesCount = 0;
        parsed.lastResetDate = today;
      }
      return { ...DEFAULT_AI_CONFIG, ...parsed };
    }
  } catch {
    // Ignore error
  }
  return DEFAULT_AI_CONFIG;
}

export function saveAIConfig(config: AIConfig): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    window.dispatchEvent(new CustomEvent('ai_config_updated', { detail: config }));
  } catch (err) {
    console.error('Failed to save AI config:', err);
  }
}

export function getLocalFallbackReply(query: string): string {
  const q = query.toLowerCase().trim();

  if (q.includes('django') && (q.includes('postgres') || q.includes('database') || q.includes('orm'))) {
    return "Manoj has strong hands-on experience designing normalized relational database schemas in PostgreSQL, writing performant Django ORM queries with select_related/prefetch_related, managing database migrations, and building secure REST APIs with Django REST Framework.";
  }

  if (q.includes('skill') || q.includes('stack') || q.includes('tech') || q.includes('language') || q.includes('framework')) {
    return "Manoj's core backend stack consists of Python, Django, Django REST Framework (DRF), and PostgreSQL. He also works with FastAPI, SQLite, JWT Authentication, RESTful APIs, and Git version control.";
  }

  if (q.includes('project') || q.includes('calcpro') || q.includes('shabdhabhandar') || q.includes('calculator') || q.includes('dictionary')) {
    return "Manoj's featured projects include:\n1. CalcPro Calculator: Built with Python Django & React, supporting scientific, programmer, and financial calculations.\n2. Shabdhabhandar Dictionary: English-to-Nepali dictionary engine featuring custom Unicode search logic and automated database ingestion.";
  }

  if (q.includes('contact') || q.includes('email') || q.includes('phone') || q.includes('whatsapp') || q.includes('hire') || q.includes('reach')) {
    return `You can contact Manoj directly:\n• Email: ${OWNER_PROFILE.email}\n• WhatsApp: ${OWNER_PROFILE.phone}\n• LinkedIn: linkedin.com/in/manojkc1\n• GitHub: github.com/manojkc1\nHe is currently available for full-time on-site and remote backend roles!`;
  }

  if (q.includes('education') || q.includes('degree') || q.includes('college') || q.includes('graduate') || q.includes('campus') || q.includes('bit')) {
    return "Manoj graduated with a Bachelor of Information Technology (BIT) in 2025 from Mahendra Multiple Campus (Tribhuvan University), Nepalgunj, Banke, Nepal.";
  }

  if (q.includes('rate') || q.includes('salary') || q.includes('cost') || q.includes('price')) {
    return "For hiring inquiries, contracts, and salary details, please reach out directly to Manoj at manojkc1dev@gmail.com or via WhatsApp at +977-9809807760.";
  }

  return `Manoj K.C. is a Python and Django Backend Developer based in Kathmandu, Nepal. He designs scalable REST APIs, database schemas, and secure authentication flows. Feel free to contact him directly at ${OWNER_PROFILE.email} or on WhatsApp at +977-9809807760.`;
}

export function loadChatSessions(): ChatSession[] {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem(SESSIONS_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {
    // Ignore error
  }
  // Return default seed sessions for the admin session viewer
  return [
    {
      id: 'sess-001',
      startedAt: 'Today, 10:24 AM',
      messagesCount: 4,
      tokensUsed: 420,
      flagged: false,
      messages: [
        { role: 'user', content: "What is Manoj's primary expertise?", timestamp: '10:24 AM' },
        { role: 'assistant', content: 'Manoj specializes in Python, Django, and PostgreSQL backend development.', timestamp: '10:24 AM', source: 'gemini-1.5-flash' },
        { role: 'user', content: 'Is he available for remote contracts?', timestamp: '10:25 AM' },
        { role: 'assistant', content: 'Yes, Manoj is available for remote and on-site backend positions.', timestamp: '10:25 AM', source: 'gemini-1.5-flash' },
      ],
    },
    {
      id: 'sess-002',
      startedAt: 'Yesterday, 3:45 PM',
      messagesCount: 2,
      tokensUsed: 195,
      flagged: false,
      messages: [
        { role: 'user', content: 'Tell me about the Shabdhabhandar project', timestamp: '3:45 PM' },
        { role: 'assistant', content: 'Shabdhabhandar is a fast English-to-Nepali dictionary engine with custom fault-tolerant Unicode search logic.', timestamp: '3:45 PM', source: 'gemini-1.5-flash' },
      ],
    },
  ];
}

export function saveChatSessions(sessions: ChatSession[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  } catch (err) {
    console.error('Failed to save sessions:', err);
  }
}
