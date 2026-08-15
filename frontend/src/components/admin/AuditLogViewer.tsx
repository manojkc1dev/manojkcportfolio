import React from 'react';
import { useCMS } from '../../context/CMSContext';
import { ShieldCheck, Clock, UserCheck, Terminal } from 'lucide-react';

export const AuditLogViewer: React.FC = () => {
  const { auditLogs } = useCMS();

  return (
    <div className="space-y-6 max-w-5xl animate-fade-in">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">Security & Audit Trails</h2>
          <p className="text-xs text-slate-500">Immutable ledger of admin CRUD events, schema modifications, and auth updates.</p>
        </div>

        <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-xs font-bold">
          {auditLogs.length} Events Logged
        </span>
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-400 font-mono uppercase text-[10px]">
            <tr>
              <th className="p-3.5">Action</th>
              <th className="p-3.5">Module</th>
              <th className="p-3.5">Details</th>
              <th className="p-3.5">Role</th>
              <th className="p-3.5">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {auditLogs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/50 font-mono">
                <td className="p-3.5 font-bold">
                  <span className={`px-2 py-0.5 rounded text-[10px] ${
                    log.action === 'CREATE' ? 'bg-emerald-500/20 text-emerald-400' :
                    log.action === 'UPDATE' ? 'bg-indigo-500/20 text-indigo-400' :
                    log.action === 'DELETE' ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {log.action}
                  </span>
                </td>
                <td className="p-3.5 font-bold text-slate-900 dark:text-white">{log.module}</td>
                <td className="p-3.5 text-slate-600 dark:text-slate-300">{log.details}</td>
                <td className="p-3.5 text-indigo-500">{log.userRole}</td>
                <td className="p-3.5 text-slate-400 text-[11px]">{new Date(log.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
