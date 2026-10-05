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
import { isDjangoConfigured } from '../../../lib/api/client';
import { submitInquiry, updateAdminInquiry } from '../../../lib/api/inquiries';

interface InquiriesViewProps {
  inquiries: AdminInquiry[];
  onUpdateInquiries: (inquiries: AdminInquiry[]) => void;
  onDeleteInquiry?: (id: string) => Promise<void> | void;
  onShowToast: (message: string) => void;
  onRefresh?: () => void;
}

export const InquiriesView: React.FC<InquiriesViewProps> = ({
  inquiries,
  onUpdateInquiries,
  onDeleteInquiry,
  onShowToast,
  onRefresh,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'New' | 'In Progress' | 'Closed' | 'Won'>('all');
  const [projectFilter, setProjectFilter] = useState<string>('all');
  const [selectedInquiry, setSelectedInquiry] = useState<AdminInquiry | null>(null);
  const [inquiryToDelete, setInquiryToDelete] = useState<AdminInquiry | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const getInquiryProject = (i: AdminInquiry): { id: string; name: string; color: string } => {
    if (i.projectId === 'agritech' || i.projectTitle?.toLowerCase().includes('agritech')) {
      return { id: 'agritech', name: 'Agritech Marketplace', color: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' };
    }
    if (i.projectId === 'calcpro' || i.projectTitle?.toLowerCase().includes('calcpro')) {
      return { id: 'calcpro', name: 'CalcPro', color: 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800' };
    }
    if (i.projectId === 'shabdhabhandar' || i.projectTitle?.toLowerCase().includes('shabdhabhandar')) {
      return { id: 'shabdhabhandar', name: 'Shabdhabhandar', color: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800' };
    }
    if (i.projectId === 'acadflow' || i.projectTitle?.toLowerCase().includes('acadflow')) {
      return { id: 'acadflow', name: 'AcadFlow', color: 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800' };
    }

    const text = `${i.scopeTitle || ''} ${i.message || ''}`.toLowerCase();
    if (text.includes('agritech') || text.includes('agriculture') || text.includes('khalti') || text.includes('esewa')) {
      return { id: 'agritech', name: 'Agritech Marketplace', color: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' };
    }
    if (text.includes('calcpro') || text.includes('calculator')) {
      return { id: 'calcpro', name: 'CalcPro', color: 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800' };
    }
    if (text.includes('shabdhabhandar') || text.includes('dictionary') || text.includes('nepali')) {
      return { id: 'shabdhabhandar', name: 'Shabdhabhandar', color: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800' };
    }
    if (text.includes('acadflow') || text.includes('student') || text.includes('academic') || text.includes('sajha')) {
      return { id: 'acadflow', name: 'AcadFlow', color: 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800' };
    }
    return { id: 'general', name: 'General Inquiries', color: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700' };
  };

  const totalLeads = inquiries.length;
  const newLeads = inquiries.filter((i) => i.status === 'New' || !i.read).length;
  const inProgressLeads = inquiries.filter((i) => i.status === 'In Progress').length;
  const wonLeads = inquiries.filter((i) => i.status === 'Won').length;

  const handleRefreshClick = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    try {
      if (onRefresh) {
        await onRefresh();
      }
    } catch (err) {
      console.warn('Refresh error:', err);
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  // Quick Test Inquiry Generator for immediate verification
  const handleCreateTestLead = async () => {
    const sampleNames = ['Devendra Shrestha', 'Pooja Karki', 'Rohan Bhattarai', 'Elena Rostova'];
    const sampleCompanies = ['Himalayan Cloud Labs', 'FinTech Nepal Ltd', 'Vertex AI Solutions', 'Kathmandu Digital'];
    const sampleScopes = ['Django REST Architecture', 'PostgreSQL Audit & Scaling', 'Payment Gateway Integration', 'Full-Stack Microservices'];
    const sampleBudgets = ['NPR 150,000–250,000', 'NPR 200,000–400,000', 'US$1,500–3,000', 'US$2,500–5,000'];

    const idx = Math.floor(Math.random() * sampleNames.length);
    const newTestLead: AdminInquiry = {
      id: `inquiry-test-${Date.now()}`,
      name: sampleNames[idx],
      company: sampleCompanies[idx],
      email: `${sampleNames[idx].toLowerCase().replace(' ', '.')}@example.com`,
      phone: '+977 98510' + Math.floor(10000 + Math.random() * 90000),
      hasWhatsApp: true,
      scopeTitle: sampleScopes[idx],
      budgetRange: sampleBudgets[idx],
      timeline: '2–3 Months',
      message: `Hello Manoj! We reviewed your portfolio and were impressed with your Python/Django backend work. We have an immediate project opening for ${sampleScopes[idx].toLowerCase()}. Let us know if you're available for a technical discussion.`,
      submittedAt: new Date().toLocaleString(),
      status: 'New',
      read: false,
      replied: false,
    };

    const updated = [newTestLead, ...inquiries];
    onUpdateInquiries(updated);

    // Save to server API as well
    try {
      if (isDjangoConfigured) {
        await submitInquiry({
          name: newTestLead.name,
          email: newTestLead.email,
          message: newTestLead.message,
        });
      }
    } catch (e) {
      // ignore
    }

    onShowToast(`New test inquiry from "${newTestLead.name}" added to inbox.`);
  };

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
    const matchesProject = projectFilter === 'all' || getInquiryProject(i).id === projectFilter;

    return matchesSearch && matchesStatus && matchesProject;
  });

  const handleUpdateStatus = (id: string, newStatus: AdminInquiry['status']) => {
    const updated = inquiries.map((i) =>
      i.id === id ? { ...i, status: newStatus, read: true } : i
    );
    onUpdateInquiries(updated);
    if (selectedInquiry && selectedInquiry.id === id) {
      setSelectedInquiry({ ...selectedInquiry, status: newStatus, read: true });
    }
    if (isDjangoConfigured) {
      updateAdminInquiry(id, { status: newStatus, read: true }).catch((err) => {
        console.warn('Django update inquiry status notice:', err);
      });
    }
    onShowToast(`Inquiry status updated to ${newStatus}.`);
  };

  const handleToggleReplied = (id: string) => {
    let newReplied = false;
    const updated = inquiries.map((i) => {
      if (i.id === id) {
        newReplied = !i.replied;
        return { ...i, replied: newReplied, read: true };
      }
      return i;
    });
    onUpdateInquiries(updated);
    if (selectedInquiry && selectedInquiry.id === id) {
      setSelectedInquiry({ ...selectedInquiry, replied: newReplied, read: true });
    }
    if (isDjangoConfigured) {
      updateAdminInquiry(id, { replied: newReplied, read: true }).catch((err) => {
        console.warn('Django update inquiry replied notice:', err);
      });
    }
    onShowToast('Inquiry reply state updated.');
  };

  const handleExecuteDelete = async () => {
    if (!inquiryToDelete) return;
    const target = inquiryToDelete;
    const updated = inquiries.filter((i) => i.id !== target.id);
    onUpdateInquiries(updated);

    if (selectedInquiry?.id === target.id) {
      setSelectedInquiry(null);
    }
    setInquiryToDelete(null);

    if (onDeleteInquiry) {
      try {
        await onDeleteInquiry(target.id);
      } catch (err) {
        console.warn('Delete inquiry error:', err);
      }
    }

    onShowToast(`Inquiry from "${target.name}" deleted successfully.`);
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
          <button
            type="button"
            onClick={handleCreateTestLead}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-all cursor-pointer"
            title="Inject a verified test client inquiry to test inbox processing"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add Test Inquiry</span>
            <span className="sm:hidden">Test</span>
          </button>

          {onRefresh && (
            <button
              type="button"
              disabled={isRefreshing}
              onClick={handleRefreshClick}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-700 disabled:opacity-60 transition-all cursor-pointer"
              title="Synchronize latest inquiries from backend and local cache"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-indigo-500' : ''}`} />
              <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
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

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-neutral-400 shrink-0" />
          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className="w-full sm:w-36 px-2.5 py-2 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            title="Filter inquiries by tagged project"
          >
            <option value="all">All Projects</option>
            <option value="agritech">Agritech</option>
            <option value="calcpro">CalcPro</option>
            <option value="shabdhabhandar">Shabdhabhandar</option>
            <option value="acadflow">AcadFlow</option>
            <option value="general">General</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="w-full sm:w-40 px-3 py-2 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
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
                      {(() => {
                        const inqProj = getInquiryProject(inq);
                        return (
                          <div className="mt-1">
                            <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold border ${inqProj.color}`}>
                              {inqProj.name}
                            </span>
                          </div>
                        );
                      })()}
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
                          onClick={() => setInquiryToDelete(inq)}
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
          onDelete={(id) => {
            const target = inquiries.find((i) => i.id === id);
            if (target) setInquiryToDelete(target);
          }}
        />
      )}

      {/* Delete Confirmation In-App Modal */}
      {inquiryToDelete && (
        <div className="fixed inset-0 z-50 bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
              <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                Delete Client Inquiry?
              </h3>
            </div>

            <p className="text-xs text-neutral-600 dark:text-neutral-300">
              Are you sure you want to permanently delete the inquiry from{' '}
              <strong className="text-neutral-900 dark:text-white font-semibold">
                "{inquiryToDelete.name}"
              </strong>{' '}
              ({inquiryToDelete.email})? This action cannot be undone.
            </p>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-neutral-100 dark:border-neutral-800 text-xs">
              <button
                type="button"
                onClick={() => setInquiryToDelete(null)}
                className="px-3.5 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteDelete}
                className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold cursor-pointer"
              >
                Yes, Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
