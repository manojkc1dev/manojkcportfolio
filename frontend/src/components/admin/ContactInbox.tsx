import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';
import { ContactMessage } from '../../types';
import { contactService } from '../../services/contact.service';
import { Mail, Star, Trash2, CheckCircle2, Reply, ShieldCheck, Globe, Smartphone, Clock, X, Loader2 } from 'lucide-react';

export const ContactInbox: React.FC = () => {
  const { messages, updateContactMessage, deleteContactMessage } = useCMS();
  const [selectedMsg, setSelectedMsg] = useState<ContactMessage | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const handleSelectMessage = (msg: ContactMessage) => {
    setSelectedMsg(msg);
    if (msg.status === 'Unread') {
      updateContactMessage(msg.id, { status: 'Read' as any });
    }
  };

  const handleToggleStar = (msg: ContactMessage) => {
    updateContactMessage(msg.id, { starred: !msg.starred } as any);
  };

  const handleSendReply = async () => {
    if (!replyText.trim() || !selectedMsg || isSending) return;
    
    setIsSending(true);
    setSendSuccess(false);
    setSendError(null);

    try {
      const response = await contactService.reply(selectedMsg.id, { reply: replyText.trim() });
      
      if (response.success) {
        setSendSuccess(true);
        setReplyText('');
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSendSuccess(false);
        }, 3000);
      } else {
        setSendError(response.message || 'Failed to send reply');
      }
    } catch (error) {
      setSendError('Network error. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl animate-fade-in">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">Contact Inquiries Inbox</h2>
          <p className="text-xs text-slate-500">Review incoming client inquiries, IP geolocation telemetry, star important queries, and dispatch replies.</p>
        </div>

        <span className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-mono text-xs font-bold border border-indigo-200 dark:border-indigo-800">
          {messages.length} Messages Total
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Messages List (Col 1-5) */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900 divide-y divide-slate-100 dark:divide-slate-800">
          {messages.map((msg) => (
            <div
              key={msg.id}
              onClick={() => handleSelectMessage(msg)}
              className={`p-4 cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-950 ${
                selectedMsg?.id === msg.id ? 'bg-indigo-50/50 dark:bg-indigo-950/30 border-l-4 border-indigo-600' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                  {msg.name}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleToggleStar(msg); }}
                    className={`p-1 rounded ${msg.starred ? 'text-amber-500' : 'text-slate-300 hover:text-slate-500'}`}
                  >
                    <Star className="w-3.5 h-3.5 fill-current" />
                  </button>

                  {msg.status === 'Unread' && (
                    <span className="w-2 h-2 rounded-full bg-indigo-600" title="Unread" />
                  )}
                </div>
              </div>

              <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">
                {msg.subject}
              </div>

              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                {msg.message}
              </p>

              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mt-2">
                <span>{msg.country}</span>
                <span>{new Date(msg.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Message Detail & Reply Box (Col 6-12) */}
        <div className="lg:col-span-7">
          {selectedMsg ? (
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6">
              
              {/* Header */}
              <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    {selectedMsg.subject}
                  </h3>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mt-0.5">
                    From: {selectedMsg.name} &lt;{selectedMsg.email}&gt;
                  </p>
                </div>

                <button
                  onClick={() => deleteContactMessage(selectedMsg.id)}
                  className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 hover:bg-rose-100"
                  title="Delete message"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Security & Geolocation Telemetry */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] font-mono text-slate-500">
                <div>IP Address: <span className="text-slate-900 dark:text-white">{selectedMsg.ip}</span></div>
                <div>Country: <span className="text-slate-900 dark:text-white">{selectedMsg.country}</span></div>
                <div>Device: <span className="text-slate-900 dark:text-white truncate block">{selectedMsg.device}</span></div>
              </div>

              {/* Message Content */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-sans whitespace-pre-line">
                {selectedMsg.message}
              </div>

              {/* Dispatch Reply Box */}
              <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Reply className="w-4 h-4 text-indigo-500" /> Dispatch Email Reply
                </label>

                <textarea
                  rows={3}
                  placeholder="Type your official response..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  disabled={isSending}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                />

                {sendSuccess && (
                  <div className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Reply queued for email delivery
                  </div>
                )}

                {sendError && (
                  <div className="text-xs font-semibold text-rose-600 flex items-center gap-1">
                    <X className="w-4 h-4" /> {sendError}
                  </div>
                )}

                <button
                  onClick={handleSendReply}
                  disabled={isSending || !replyText.trim()}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 disabled:cursor-not-allowed text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition-all flex items-center gap-2"
                >
                  {isSending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Sending...
                    </>
                  ) : (
                    <>
                      <Reply className="w-4 h-4" /> Send Email Reply
                    </>
                  )}
                </button>
              </div>

            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 text-xs bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              Select a message from the list to inspect details and respond.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
