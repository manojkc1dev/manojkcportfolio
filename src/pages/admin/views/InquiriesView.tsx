import React, { useState } from 'react';
import {
  Search,
  Filter,
  Trash2,
  Eye,
  Mail,
  Phone,
  MessageCircle,
  Inbox,
  RefreshCw,
  Plus,
} from 'lucide-react';
import type { AdminInquiry } from '../types';
import { InquiryDetailModal } from './InquiryDetailModal';

interface InquiriesViewProps {
  inquiries: AdminInquiry[];
  onUpdateInquiries: (inquiries: AdminInquiry[]) => void;
  onShowToast: (message: string) => void;
  onRefresh?: () => void;
  onAddTestInquiry?: () => void;
}

export const InquiriesView: React.FC<InquiriesViewProps> = ({
  inquiries,
  onUpdateInquiries,
  onShowToast,
  onRefresh,
  onAddTestInquiry,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'New' | 'In Progress' | 'Closed' | 'Won'>('all');
  const [selectedInquiry, setSelectedInquiry] = useState<AdminInquiry | null>(null);

  const totalLeads = inquiries.length;
  const newLeads = inquiries.filter((i) => i.status === 'New' || !i.read).length;
  const inProgressLeads = inquiries.filter((i) => i.status === 'In Progress').length;
  const wonLeads = inquiries.filter((i) => i.status === 'Won').length;

  const filteredInquiries = inquiries.filter((i) => {
    const matchesSearch =
      !searchQuery.trim() ||
      i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (i.phone && i.phone.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (i.company && i.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
      i.scopeTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.message.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || i.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = (id: string, newStatus: AdminInquiry['status']) => {
    const updated = inquiries.map((i) =>
      i.id === id ? { ...i, status: newStatus, read: true } : i
    );
    onUpdateInquiries(updated);
    if (selectedInquiry && selectedInquiry.id === id) {
      setSelectedInquiry({ ...selectedInquiry, status: newStatus, read: true });
    }
    onShowToast(`Inquiry status updated to ${newStatus}.`);
  };

  const handleToggleReplied = (id: string) => {
    const updated = inquiries.map((i) =>
      i.id === id ? { ...i, replied: !i.replied, read: true } : i
    );
    onUpdateInquiries(updated);
    if (selectedInquiry && selectedInquiry.id === id) {
      setSelectedInquiry({ ...selectedInquiry, replied: !selectedInquiry.replied, read: true });
    }
    onShowToast('Inquiry reply state updated.');
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to permanently delete this lead inquiry?')) {
      const updated = inquiries.filter((i) => i.id !== id);
      onUpdateInquiries(updated);
      if (selectedInquiry?.id === id) {
        setSelectedInquiry(null);
      }
      onShowToast('Inquiry deleted successfully.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-neutral-900 dark:text-white">
            Project Inquiries & Lead Inbox
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Review incoming client specifications, project inquiries, and client contact submissions.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {onAddTestInquiry && (
            <button
              type="button"
              onClick={onAddTestInquiry}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Simulate Lead</span>
            </button>
          )}

          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs">
          <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
            Total Leads
          </div>
          <div className="mt-1 text-2xl font-bold text-neutral-900 dark:text-white">
            {totalLeads}
          </div>
        </div>

        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs">
          <div className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            New / Unread
          </div>
          <div className="mt-1 text-2xl font-bold text-blue-600 dark:text-blue-400">
            {newLeads}
          </div>
        </div>

        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs">
          <div className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
            In Progress
          </div>
          <div className="mt-1 text-2xl font-bold text-amber-600 dark:text-amber-400">
            {inProgressLeads}
          </div>
        </div>

        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs">
          <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            Won / Client
          </div>
          <div className="mt-1 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {wonLeads}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search inquiries by client name, email, phone, company, requirements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-neutral-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="w-full sm:w-44 px-3 py-2 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          >
            <option value="all">All Inquiries ({totalLeads})</option>
            <option value="New">New ({inquiries.filter((i) => i.status === 'New').length})</option>
            <option value="In Progress">
              In Progress ({inquiries.filter((i) => i.status === 'In Progress').length})
            </option>
            <option value="Won">Won ({inquiries.filter((i) => i.status === 'Won').length})</option>
            <option value="Closed">
              Closed ({inquiries.filter((i) => i.status === 'Closed').length})
            </option>
          </select>
        </div>
      </div>

      {/* Inquiries Table */}
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 dark:bg-neutral-800/60 border-b border-neutral-200 dark:border-neutral-800 text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3">Client / Company</th>
                <th className="px-4 py-3">Contact Details</th>
                <th className="px-4 py-3">Project Scope</th>
                <th className="px-4 py-3">Submitted</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {filteredInquiries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-neutral-500">
                    No matching inquiries found in lead inbox.
                  </td>
                </tr>
              ) : (
                filteredInquiries.map((inq) => (
                  <tr
                    key={inq.id}
                    className={`hover:bg-neutral-50/60 dark:hover:bg-neutral-800/40 transition-colors ${
                      !inq.read ? 'bg-blue-50/20 dark:bg-blue-950/10' : ''
                    }`}
                  >
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                        {!inq.read && (
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                        )}
                        <span>{inq.name}</span>
                      </div>
                      {inq.company && (
                        <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
                          {inq.company}
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="text-neutral-700 dark:text-neutral-300 font-mono text-[11px]">
                        {inq.email}
                      </div>
                      {inq.phone && (
                        <div className="text-neutral-500 text-[11px] flex items-center gap-1 mt-0.5">
                          <span>{inq.phone}</span>
                          {inq.hasWhatsApp && (
                            <span className="px-1 py-0.2 rounded text-[9px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                              WA
                            </span>
                          )}
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="font-medium text-neutral-800 dark:text-neutral-200 max-w-xs truncate">
                        {inq.scopeTitle}
                      </div>
                      <div className="text-[11px] text-neutral-500">
                        {inq.budgetRange}
                        {inq.timeline ? ` · ${inq.timeline}` : ''}
                      </div>
                    </td>

                    <td className="px-4 py-3.5 text-neutral-500 whitespace-nowrap text-[11px]">
                      {inq.submittedAt}
                    </td>

                    <td className="px-4 py-3.5">
                      <select
                        value={inq.status}
                        onChange={(e) =>
                          handleUpdateStatus(inq.id, e.target.value as AdminInquiry['status'])
                        }
                        className={`px-2 py-1 rounded-md text-[11px] font-semibold border transition-colors cursor-pointer ${
                          inq.status === 'Won'
                            ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 text-emerald-700 dark:text-emerald-300'
                            : inq.status === 'In Progress'
                            ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-300 text-amber-700 dark:text-amber-300'
                            : inq.status === 'Closed'
                            ? 'bg-neutral-100 dark:bg-neutral-800 border-neutral-300 text-neutral-600 dark:text-neutral-400'
                            : 'bg-blue-50 dark:bg-blue-950/50 border-blue-300 text-blue-700 dark:text-blue-300'
                        }`}
                      >
                        <option value="New">New</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Won">Won</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </td>

                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedInquiry(inq);
                            if (!inq.read) {
                              const updated = inquiries.map((i) =>
                                i.id === inq.id ? { ...i, read: true } : i
                              );
                              onUpdateInquiries(updated);
                            }
                          }}
                          className="px-2.5 py-1 rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Details</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(inq.id)}
                          className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                          title="Delete inquiry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inquiry Detail Modal */}
      {selectedInquiry && (
        <InquiryDetailModal
          inquiry={selectedInquiry}
          onClose={() => setSelectedInquiry(null)}
          onUpdateStatus={handleUpdateStatus}
          onToggleReplied={handleToggleReplied}
        />
      )}
    </div>
  );
};
