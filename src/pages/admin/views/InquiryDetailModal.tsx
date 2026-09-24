import React from 'react';
import {
  X,
  Mail,
  Phone,
  MessageCircle,
  Building2,
  Clock,
  DollarSign,
  CheckCircle2,
  Calendar,
  Send,
} from 'lucide-react';
import type { AdminInquiry } from '../types';

interface InquiryDetailModalProps {
  inquiry: AdminInquiry;
  onClose: () => void;
  onUpdateStatus: (id: string, status: AdminInquiry['status']) => void;
  onToggleReplied: (id: string) => void;
}

export const InquiryDetailModal: React.FC<InquiryDetailModalProps> = ({
  inquiry,
  onClose,
  onUpdateStatus,
  onToggleReplied,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="w-full max-w-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl overflow-hidden my-auto flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-neutral-50/70 dark:bg-neutral-900/70">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-neutral-900 dark:text-white">
                {inquiry.name}
              </h2>
              {inquiry.company && (
                <span className="text-xs text-neutral-500 flex items-center gap-1 font-medium">
                  · {inquiry.company}
                </span>
              )}
            </div>
            <p className="text-[11px] text-neutral-400 mt-0.5">
              Received: {inquiry.submittedAt}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 text-xs">
          {/* Status and Action Buttons Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-neutral-600 dark:text-neutral-400">
                Lead Status:
              </span>
              <select
                value={inquiry.status}
                onChange={(e) =>
                  onUpdateStatus(inquiry.id, e.target.value as AdminInquiry['status'])
                }
                className="px-2.5 py-1 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-xs font-semibold text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="New">New</option>
                <option value="In Progress">In Progress</option>
                <option value="Won">Won / Client</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => onToggleReplied(inquiry.id)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                inquiry.replied
                  ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                  : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-300'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{inquiry.replied ? 'Replied' : 'Mark as Replied'}</span>
            </button>
          </div>

          {/* Contact Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex items-center justify-between">
              <div className="min-w-0">
                <div className="text-[10px] text-neutral-400 uppercase font-bold">Email Address</div>
                <div className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 truncate mt-0.5">
                  {inquiry.email}
                </div>
              </div>
              <a
                href={`mailto:${inquiry.email}?subject=Regarding your inquiry: ${inquiry.scopeTitle} - Manoj Khatri`}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 hover:bg-blue-100 transition-colors"
                title="Send Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>

            <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex items-center justify-between">
              <div className="min-w-0">
                <div className="text-[10px] text-neutral-400 uppercase font-bold">Phone Number</div>
                <div className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 truncate mt-0.5">
                  {inquiry.phone || 'Not provided'}
                </div>
              </div>
              {inquiry.phone && (
                <div className="flex items-center gap-1.5">
                  <a
                    href={`tel:${inquiry.phone}`}
                    className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 transition-colors"
                    title="Call Client"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                  <a
                    href={`https://wa.me/${inquiry.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 transition-colors"
                    title="Open WhatsApp"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Scope and Budget Strip */}
          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-2">
            <div className="text-[10px] text-neutral-400 uppercase font-bold">Project Scope</div>
            <div className="text-sm font-bold text-neutral-900 dark:text-white">
              {inquiry.scopeTitle}
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300">
              <div className="flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Budget: {inquiry.budgetRange}</span>
              </div>
              {inquiry.timeline && (
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-blue-500 shrink-0" />
                  <span>Timeline: {inquiry.timeline}</span>
                </div>
              )}
            </div>
          </div>

          {/* Detailed Message Text */}
          <div className="space-y-1.5">
            <div className="text-[10px] text-neutral-400 uppercase font-bold">
              Client Message / Requirements
            </div>
            <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 leading-relaxed whitespace-pre-wrap font-sans text-xs">
              {inquiry.message || 'No additional notes provided.'}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/70 flex items-center justify-between">
          <a
            href={`mailto:${inquiry.email}?subject=Re: Portfolio Inquiry - ${inquiry.scopeTitle} (Manoj Khatri)`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send Email Reply</span>
          </a>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 font-medium text-xs cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
