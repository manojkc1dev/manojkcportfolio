
import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, X, Minus, Send, Bot, User, Mail, MessageSquare, AlertCircle } from 'lucide-react';
import { OWNER_PROFILE } from '@/lib/constants';
import { loadAIConfig, getLocalFallbackReply, type AIConfig } from '@/lib/aiConfig';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  source?: string;
}

const SUGGESTED_PROMPTS = [
  "What is Manoj's core backend tech stack?",
  'Can you tell me about his featured projects?',
  'What is his experience with Django & PostgreSQL?',
  'Is Manoj available for hire or remote roles?',
  'How can I contact Manoj or request an interview?',
];

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [showContactFallback, setShowContactFallback] = useState(false);
  const [aiConfig, setAiConfig] = useState<AIConfig>(loadAIConfig);
  const [sessionMsgCount, setSessionMsgCount] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('manojkc_session_msg_count');
      return stored ? parseInt(stored, 10) : 0;
    }
    return 0;
  });

  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('manojkc_chat_history');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {
        // Ignore error
      }
    }
    return [
      {
        id: 'welcome-msg',
        role: 'assistant',
        content: `Hi! I'm Manoj K.C.'s AI assistant. Ask me anything about his Python & Django backend engineering background, PostgreSQL architecture, or his projects!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Listen for AI config updates from Admin Studio
  useEffect(() => {
    const handleConfigUpdate = (e: CustomEvent<AIConfig>) => {
      if (e.detail) setAiConfig(e.detail);
    };
    window.addEventListener('ai_config_updated' as any, handleConfigUpdate as EventListener);
    return () => {
      window.removeEventListener('ai_config_updated' as any, handleConfigUpdate as EventListener);
    };
  }, []);

  // Persist chat to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && messages.length > 1) {
      try {
        localStorage.setItem('manojkc_chat_history', JSON.stringify(messages));
      } catch {
        // Ignore
      }
    }
  }, [messages]);

  // Scroll to bottom on new messages or streaming
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

  // Focus textarea when opening chat
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  }, [isOpen, isMinimized]);

  if (!aiConfig.enabled) {
    return null;
  }

  const handleSendMessage = async (textToSend?: string) => {
    const rawText = (textToSend || inputMessage).trim();
    if (!rawText || isLoading) return;

    // Hard Safeguard: Truncate input to 500 characters
    const text = rawText.slice(0, 500);

    // Safeguard: Session limit cap (100 messages/session)
    if (sessionMsgCount >= 100) {
      setMessages((prev) => [
        ...prev,
        {
          id: `usr-${Date.now()}`,
          role: 'user',
          content: text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
        {
          id: `ast-cap-${Date.now()}`,
          role: 'assistant',
          content: aiConfig.fallbackMessage || "You have reached the message limit for this session. Please contact Manoj directly via email or WhatsApp!",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setShowContactFallback(true);
      return;
    }

    const newCount = sessionMsgCount + 1;
    setSessionMsgCount(newCount);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('manojkc_session_msg_count', newCount.toString());
    }

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);
    setStreamingContent('');
    setShowContactFallback(false);

    try {
      const historyContext = messages.slice(-4).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      // 15-second client timeout safeguard
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const res = await fetch('/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history: historyContext }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      let reply = '';
      if (!res.ok) {
        // Fallback to local rule-based knowledge base
        reply = getLocalFallbackReply(text);
      } else {
        const data = await res.json();
        reply = data.reply || getLocalFallbackReply(text);
      }

      // Smooth streaming simulation
      let currentIdx = 0;
      const chars = reply.split('');
      const streamTimer = setInterval(() => {
        currentIdx += 3;
        if (currentIdx >= chars.length) {
          clearInterval(streamTimer);
          setStreamingContent('');
          setMessages((prev) => [
            ...prev,
            {
              id: `ast-${Date.now()}`,
              role: 'assistant',
              content: reply,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            },
          ]);
          setIsLoading(false);

          if (
            reply.toLowerCase().includes('contact') ||
            reply.toLowerCase().includes('email') ||
            reply.toLowerCase().includes('whatsapp')
          ) {
            setShowContactFallback(true);
          }
        } else {
          setStreamingContent(reply.slice(0, currentIdx));
        }
      }, 12);
    } catch {
      setIsLoading(false);
      setStreamingContent('');
      const fallback = getLocalFallbackReply(text);
      setMessages((prev) => [
        ...prev,
        {
          id: `ast-fallback-${Date.now()}`,
          role: 'assistant',
          content: fallback,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          source: 'local_fallback',
        },
      ]);
      setShowContactFallback(true);
    }
  };

  const clearChat = () => {
    const initialMsg: Message = {
      id: `welcome-${Date.now()}`,
      role: 'assistant',
      content: `Chat history reset. How can I help you learn about Manoj K.C.'s Python/Django engineering work?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages([initialMsg]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('manojkc_chat_history');
    }
    setShowContactFallback(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Trigger Button (when closed) */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          className="fixed bottom-6 right-6 z-40 p-3.5 rounded-full bg-primary text-primary-foreground shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center group"
          title="Open AI Assistant"
          aria-label="Open AI Assistant"
        >
          <Sparkles className="w-6 h-6 transition-transform group-hover:rotate-12" />
          <span className="sr-only">Open chat</span>
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-success border-2 border-background rounded-full" />
        </button>
      )}

      {/* Minimized Pill */}
      {isOpen && isMinimized && (
        <button
          type="button"
          onClick={() => setIsMinimized(false)}
          className="fixed bottom-6 right-6 z-40 px-4 py-2.5 rounded-full bg-surface border border-border shadow-xl flex items-center gap-2.5 text-xs font-semibold text-foreground cursor-pointer hover:border-primary/50 transition-all"
        >
          <Sparkles className="w-4 h-4 text-primary" />
          <span>Chat with Manoj's assistant</span>
          <span className="w-2 h-2 rounded-full bg-success" />
        </button>
      )}

      {/* Chat Window Panel: Mobile full-screen sheet (100dvh) | Tablet (340x520) | Desktop (380x560) */}
      {isOpen && !isMinimized && (
        <div
          id="chat-panel"
          className="fixed inset-0 z-50 w-screen h-screen h-[100dvh] rounded-none border-0 sm:fixed sm:inset-auto sm:bottom-6 sm:right-6 sm:w-[340px] sm:h-[520px] lg:w-[380px] lg:h-[560px] sm:rounded-2xl sm:border sm:border-border bg-surface shadow-2xl flex flex-col overflow-hidden animate-in fade-in duration-200"
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-border bg-surface-2 flex items-center justify-between shrink-0 pt-[max(0.75rem,env(safe-area-inset-top))] sm:pt-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-primary/15 text-primary flex items-center justify-center border border-primary/30 shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h3 className="text-xs font-bold text-foreground tracking-tight truncate">
                  Chat with Manoj&apos;s assistant
                </h3>
                <div className="flex items-center gap-1.5 text-[10px] text-muted">
                  <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse shrink-0" />
                  <span className="truncate">Free Tier · gemini-1.5-flash</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={clearChat}
                className="p-1.5 rounded-md text-muted hover:text-foreground hover:bg-surface transition-colors cursor-pointer"
                title="Clear chat"
                aria-label="Clear chat history"
              >
                <AlertCircle className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsMinimized(true)}
                className="hidden sm:inline-flex p-1.5 rounded-md text-muted hover:text-foreground hover:bg-surface transition-colors cursor-pointer"
                title="Minimize chat"
                aria-label="Minimize chat"
              >
                <Minus className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-md text-muted hover:text-foreground hover:bg-surface transition-colors cursor-pointer"
                title="Close chat"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-full bg-primary/15 text-primary flex items-center justify-center shrink-0 mt-0.5 border border-primary/20">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 leading-relaxed break-words ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-tr-xs'
                      : 'bg-surface-2 text-foreground border border-border rounded-tl-xs'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  <span
                    className={`block text-[9px] mt-1 ${
                      msg.role === 'user' ? 'text-primary-foreground/75 text-right' : 'text-muted'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>

                {msg.role === 'user' && (
                  <div className="w-6 h-6 rounded-full bg-surface-2 text-foreground flex items-center justify-center shrink-0 mt-0.5 border border-border">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {/* Live streaming text render */}
            {isLoading && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-6 h-6 rounded-full bg-primary/15 text-primary flex items-center justify-center shrink-0 mt-0.5 border border-primary/20">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="max-w-[85%] rounded-2xl rounded-tl-xs px-3.5 py-2.5 bg-surface-2 text-foreground border border-border leading-relaxed">
                  {streamingContent ? (
                    <p className="whitespace-pre-wrap">
                      {streamingContent}
                      <span className="inline-block w-1.5 h-3 bg-primary ml-1 animate-pulse" />
                    </p>
                  ) : (
                    <div className="flex items-center gap-1.5 py-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-muted animate-bounce" />
                      <span className="w-1.5 h-1.5 rounded-full bg-muted animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-muted animate-bounce [animation-delay:0.4s]" />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Direct contact action buttons fallback */}
            {showContactFallback && (
              <div className="pt-2 flex flex-wrap gap-2 justify-center">
                <a
                  href={`mailto:${OWNER_PROFILE.email}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/15 hover:bg-primary/25 border border-primary/30 text-primary text-[11px] font-semibold transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email Manoj</span>
                </a>
                <a
                  href="https://wa.me/9779809807760"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-success/15 hover:bg-success/25 border border-success/30 text-success text-[11px] font-semibold transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp (+977)</span>
                </a>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Ready Normal Queries */}
          {!isLoading && (
            <div className="px-3.5 py-2 bg-surface-2/70 border-t border-border/70 flex flex-col gap-1.5 shrink-0">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-mono font-semibold tracking-wider text-muted flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-primary" />
                  Ready Queries ({SUGGESTED_PROMPTS.length})
                </span>
                {messages.length > 2 && (
                  <button
                    type="button"
                    onClick={() => setShowSuggestions(!showSuggestions)}
                    className="text-[10px] text-primary hover:underline cursor-pointer font-mono"
                  >
                    {showSuggestions ? 'Hide' : 'Show queries'}
                  </button>
                )}
              </div>
              {(showSuggestions || messages.length <= 2) && (
                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-0.5">
                  {SUGGESTED_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => handleSendMessage(prompt)}
                      className="text-[11px] text-left px-2.5 py-1 rounded-full bg-surface border border-border text-foreground/90 hover:border-primary/50 hover:text-primary hover:bg-surface-2 transition-colors cursor-pointer leading-snug"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Sticky Input Box with safe-area padding */}
          <div className="sticky bottom-0 p-3 border-t border-border bg-surface shrink-0 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))]">
            <div className="relative flex items-end rounded-xl bg-surface-2 border border-border focus-within:border-primary/60 transition-colors">
              <textarea
                ref={textareaRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                maxLength={500}
                placeholder="Ask about Manoj's skills, projects..."
                rows={1}
                className="w-full resize-none bg-transparent py-2.5 pl-3 pr-10 text-xs text-foreground placeholder:text-muted focus:outline-none max-h-24"
              />

              <button
                type="button"
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim() || isLoading}
                className="absolute right-1.5 bottom-1.5 p-1.5 rounded-lg bg-primary text-primary-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:bg-primary/90 cursor-pointer"
                aria-label="Send message"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex items-center justify-between text-[10px] text-muted px-1 mt-1.5">
              <span>{inputMessage.length}/500 chars</span>
              <span>100% Free · No billing</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
