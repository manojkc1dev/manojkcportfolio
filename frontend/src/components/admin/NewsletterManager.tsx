import React from 'react';
import { useCMS } from '../../context/CMSContext';
import { Mail, Download, Users, CheckCircle2 } from 'lucide-react';

export const NewsletterManager: React.FC = () => {
  const { newsletter } = useCMS();

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8,"
      + ["Email,SubscribedAt,Status", ...newsletter.map(n => `${n.email},${n.subscribedAt},${n.status}`)].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "newsletter_subscribers.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-4xl animate-fade-in">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">Newsletter Subscribers CMS</h2>
          <p className="text-xs text-slate-500">Manage technical architecture mailing list subscribers.</p>
        </div>

        <button
          onClick={exportCSV}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/30"
        >
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-400 font-mono uppercase text-[10px]">
            <tr>
              <th className="p-3.5">Subscriber Email</th>
              <th className="p-3.5">Subscribed Date</th>
              <th className="p-3.5">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {newsletter.map((sub) => (
              <tr key={sub.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/50">
                <td className="p-3.5 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Mail className="w-4 h-4 text-indigo-500" />
                  {sub.email}
                </td>
                <td className="p-3.5 font-mono text-slate-500">
                  {new Date(sub.subscribedAt).toLocaleDateString()}
                </td>
                <td className="p-3.5">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 border border-emerald-200 dark:border-emerald-800">
                    {sub.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
