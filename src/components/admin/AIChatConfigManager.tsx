import React, { useState, useEffect } from 'react';
import {
  Bot,
  Sliders,
  ShieldCheck,
  RotateCcw,
  Check,
  Flame,
  MessageSquare,
  AlertTriangle,
  Flag,
  ChevronRight,
  RefreshCw,
  Power
} from 'lucide-react';
import {
  loadAIConfig,
  saveAIConfig,
  loadChatSessions,
  saveChatSessions,
  DEFAULT_AI_CONFIG,
  type AIConfig,
  type ChatSession
} from '@/lib/aiConfig';

export function AIChatConfigManager() {
  const [config, setConfig] = useState<AIConfig>(loadAIConfig);
  const [sessions, setSessions] = useState<ChatSession[]>(loadChatSessions);
  const [selectedSessionId, setSelectedSessionId] = useState<string>(sessions[0]?.id || '');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved'>('idle');

  useEffect(() => {
    const handleUpdate = (e: CustomEvent<AIConfig>) => {
      if (e.detail) setConfig(e.detail);
    };
    window.addEventListener('ai_config_updated' as any, handleUpdate as EventListener);
    return () => {
      window.removeEventListener('ai_config_updated' as any, handleUpdate as EventListener);
    };
  }, []);

  const handleUpdateConfig = <K extends keyof AIConfig>(key: K, value: AIConfig[K]) => {
    const updated = { ...config, [key]: value };
    setConfig(updated);
    saveAIConfig(updated);
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 2500);
  };

  const handleResetCounter = () => {
    handleUpdateConfig('dailyMessagesCount', 0);
  };

  const toggleFlagSession = (sessionId: string) => {
    const updated = sessions.map((s) => (s.id === sessionId ? { ...s, flagged: !s.flagged } : s));
    setSessions(updated);
    saveChatSessions(updated);
  };

  const selectedSession = sessions.find((s) => s.id === selectedSessionId) || sessions[0];

  return (
    <div className="space-y-8 max-w-5xl animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2.5">
            <Bot className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              AI Assistant Studio (100% Free Tier)
            </h2>
          </div>
          <p className="text-xs text-muted mt-1">
            Governed by Google Gemini 1.5 Flash Free Tier. Strict token limits, rate caps, and local rule-based fallback.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {saveStatus === 'saved' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-success/15 text-success border border-success/30">
              <Check className="w-3.5 h-3.5" />
              <span>Config Saved</span>
            </span>
          )}

          {/* Master AI Toggle */}
          <button
            type="button"
            onClick={() => handleUpdateConfig('enabled', !config.enabled)}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
              config.enabled
                ? 'bg-success/15 border-success/30 text-success hover:bg-success/25'
                : 'bg-destructive/15 border-destructive/30 text-destructive hover:bg-destructive/25'
            }`}
          >
            <Power className="w-3.5 h-3.5" />
            <span>{config.enabled ? 'AI Enabled' : 'AI Paused'}</span>
          </button>
        </div>
      </div>

      {/* Free Tier Cost Safeguards Ribbon */}
      <div className="p-4 rounded-2xl bg-surface-2/70 border border-border grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-mono font-bold text-muted">Active Model</span>
          <p className="font-bold text-foreground flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-success" />
            gemini-1.5-flash
          </p>
          <p className="text-[10px] text-muted">Free 15 RPM · 1,500 RPD</p>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] uppercase font-mono font-bold text-muted">Monthly Bill</span>
          <p className="font-bold text-success text-sm">$0.00 / mo</p>
          <p className="text-[10px] text-muted">No credit card or billing</p>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] uppercase font-mono font-bold text-muted">Token Guards</span>
          <p className="font-bold text-foreground">500 In / 300 Out</p>
          <p className="text-[10px] text-muted">15-second client timeout</p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono font-bold text-muted">Today's Usage</span>
            <button
              type="button"
              onClick={handleResetCounter}
              title="Reset daily usage counter"
              className="text-[10px] text-primary hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              <RefreshCw className="w-2.5 h-2.5" />
              Reset
            </button>
          </div>
          <p className="font-bold text-foreground">
            {config.dailyMessagesCount} / {config.dailyGlobalLimit}
          </p>
          <div className="w-full bg-border h-1.5 rounded-full overflow-hidden mt-1">
            <div
              className="bg-primary h-full rounded-full transition-all"
              style={{
                width: `${Math.min(100, (config.dailyMessagesCount / config.dailyGlobalLimit) * 100)}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Model & System Prompt Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-2xl bg-surface border border-border space-y-5">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Sliders className="w-4 h-4 text-primary" />
              Engine &amp; System Prompt
            </h3>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Target Model (Free Tier Only)
              </label>
              <input
                type="text"
                readOnly
                value="gemini-1.5-flash (Locked Free Tier)"
                className="w-full px-3 py-2 text-xs rounded-lg bg-surface-2 border border-border text-foreground font-mono"
              />
              <p className="text-[10px] text-muted mt-1">
                Hardcoded to free tier to guarantee zero hidden costs.
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Temperature: {config.temperature}
                </label>
                <span className="text-[10px] font-mono text-muted">
                  {config.temperature < 0.5 ? 'Precise & Direct' : 'Balanced & Friendly'}
                </span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={config.temperature}
                onChange={(e) => handleUpdateConfig('temperature', parseFloat(e.target.value))}
                className="w-full cursor-pointer accent-primary"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Base System Prompt
                </label>
                <button
                  type="button"
                  onClick={() => handleUpdateConfig('systemPrompt', DEFAULT_AI_CONFIG.systemPrompt)}
                  className="text-[10px] text-muted hover:text-foreground flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  Restore Default
                </button>
              </div>
              <textarea
                rows={7}
                value={config.systemPrompt}
                onChange={(e) => handleUpdateConfig('systemPrompt', e.target.value)}
                className="w-full p-3 text-xs font-mono rounded-lg bg-surface-2 border border-border text-foreground focus:outline-none focus:border-primary leading-relaxed"
              />
              <p className="text-[10px] text-muted mt-1">
                Context instructions supplied to the Gemini free tier API endpoint on each message.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Fallback &amp; Rate Limit Message
              </label>
              <textarea
                rows={2}
                value={config.fallbackMessage}
                onChange={(e) => handleUpdateConfig('fallbackMessage', e.target.value)}
                className="w-full p-2.5 text-xs rounded-lg bg-surface-2 border border-border text-foreground focus:outline-none focus:border-primary"
              />
              <p className="text-[10px] text-muted mt-1">
                Shown if the user hits the 10 msg/min or 100 msg/session limit.
              </p>
            </div>
          </div>

          {/* Per-Page Enable Toggles */}
          <div className="p-6 rounded-2xl bg-surface border border-border space-y-4">
            <h3 className="text-sm font-bold text-foreground">Per-Page Widget Visibility</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { key: 'home', label: 'Home Page' },
                { key: 'projects', label: 'Projects Detail' },
                { key: 'contact', label: 'Contact Section' },
              ].map((page) => {
                const isEnabled = config.perPageEnabled[page.key as keyof typeof config.perPageEnabled];
                return (
                  <button
                    key={page.key}
                    type="button"
                    onClick={() =>
                      handleUpdateConfig('perPageEnabled', {
                        ...config.perPageEnabled,
                        [page.key]: !isEnabled,
                      })
                    }
                    className={`p-3 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer ${
                      isEnabled
                        ? 'bg-primary/10 border-primary text-primary'
                        : 'bg-surface-2 border-border text-muted hover:text-foreground'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span>{page.label}</span>
                      <span className={`w-2 h-2 rounded-full ${isEnabled ? 'bg-primary' : 'bg-muted'}`} />
                    </div>
                    <span className="text-[10px] font-normal block">
                      {isEnabled ? 'Widget Enabled' : 'Widget Disabled'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Session Viewer */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-surface border border-border space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-primary" />
                Live Session Inspector
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-2 text-muted">
                {sessions.length} recorded
              </span>
            </div>

            {/* Sessions list */}
            <div className="space-y-1.5 max-h-48 overflow-y-auto scrollbar-hide">
              {sessions.map((sess) => (
                <button
                  key={sess.id}
                  type="button"
                  onClick={() => setSelectedSessionId(sess.id)}
                  className={`w-full p-2.5 rounded-xl text-left text-xs border transition-all cursor-pointer flex items-center justify-between ${
                    sess.id === selectedSession?.id
                      ? 'bg-primary/10 border-primary text-foreground'
                      : 'bg-surface-2 border-border/70 text-muted hover:text-foreground'
                  }`}
                >
                  <div className="min-w-0">
                    <p className="font-semibold truncate">
                      {sess.messages[0]?.content || 'Empty Session'}
                    </p>
                    <span className="text-[10px] font-mono text-muted">
                      {sess.startedAt} · {sess.messagesCount} msgs · {sess.tokensUsed} tokens
                    </span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0 ml-2">
                    {sess.flagged && <Flag className="w-3 h-3 text-destructive fill-destructive" />}
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </button>
              ))}
            </div>

            {/* Transcript preview */}
            {selectedSession && (
              <div className="mt-4 pt-4 border-t border-border space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-foreground">Transcript: {selectedSession.id}</span>
                  <button
                    type="button"
                    onClick={() => toggleFlagSession(selectedSession.id)}
                    className={`flex items-center gap-1 text-[11px] px-2 py-1 rounded cursor-pointer ${
                      selectedSession.flagged
                        ? 'bg-destructive/15 text-destructive border border-destructive/30'
                        : 'bg-surface-2 text-muted hover:text-foreground border border-border'
                    }`}
                  >
                    <Flag className="w-3 h-3" />
                    <span>{selectedSession.flagged ? 'Flagged' : 'Flag Response'}</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-hide p-2 rounded-xl bg-surface-2/60 border border-border text-xs">
                  {selectedSession.messages.map((m, idx) => (
                    <div
                      key={idx}
                      className={`p-2 rounded-lg leading-relaxed ${
                        m.role === 'user'
                          ? 'bg-primary/15 text-foreground ml-4'
                          : 'bg-surface text-foreground mr-4 border border-border'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono text-muted mb-1">
                        <span>{m.role === 'user' ? 'Visitor' : 'Gemini 1.5 Flash'}</span>
                        <span>{m.timestamp}</span>
                      </div>
                      <p className="text-[11px] whitespace-pre-wrap">{m.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
