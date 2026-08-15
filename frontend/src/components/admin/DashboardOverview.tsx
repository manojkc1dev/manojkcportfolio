import React from 'react';
import { useCMS } from '../../context/CMSContext';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  Folder,
  CheckCircle2,
  FileText,
  Users,
  MessageSquare,
  Download,
  Code2,
  BookOpen,
  Mail,
  Activity,
  ShieldCheck,
  TrendingUp,
  Globe
} from 'lucide-react';

export const DashboardOverview: React.FC = () => {
  const {
    projects,
    blogs,
    techStack,
    skills,
    messages,
    newsletter,
    analytics,
    auditLogs,
    resume
  } = useCMS();

  const totalProjects = projects.length;
  const publishedProjects = projects.filter((p) => p.status === 'Published').length;
  const draftProjects = projects.filter((p) => p.status === 'Draft').length;
  const unreadMessages = messages.filter((m) => m.status === 'Unread').length;

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#3b82f6'];

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Top Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-xs font-semibold text-indigo-300">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            Django 5.0 REST Backend Operational
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            Enterprise CMS Control Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Real-time telemetry, visitor analytics, project publishing, and incoming client inquiries.
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs text-slate-300 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
          <div>
            <span className="text-slate-500 block text-[10px]">CACHE LAYER</span>
            <span className="font-bold text-emerald-400">Redis v7 Active</span>
          </div>
          <div className="w-px h-8 bg-slate-800" />
          <div>
            <span className="text-slate-500 block text-[10px]">TASKS QUEUE</span>
            <span className="font-bold text-indigo-400">Celery Workers (4)</span>
          </div>
        </div>
      </div>

      {/* KPI Stats Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        
        {/* Card 1: Total Projects */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <div className="flex justify-between text-slate-400">
            <span className="text-[11px] font-semibold uppercase">Total Projects</span>
            <Folder className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">{totalProjects}</div>
          <div className="text-[10px] text-slate-500 font-mono">{publishedProjects} Pub / {draftProjects} Draft</div>
        </div>

        {/* Card 2: Total Visitors */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <div className="flex justify-between text-slate-400">
            <span className="text-[11px] font-semibold uppercase">Visitors</span>
            <Users className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">{analytics.totalVisitors.toLocaleString()}</div>
          <div className="text-[10px] text-emerald-500 font-mono font-semibold">+14.2% this week</div>
        </div>

        {/* Card 3: Contact Requests */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <div className="flex justify-between text-slate-400">
            <span className="text-[11px] font-semibold uppercase">Inquiries</span>
            <MessageSquare className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">{messages.length}</div>
          <div className="text-[10px] text-amber-500 font-mono font-semibold">{unreadMessages} Unread</div>
        </div>

        {/* Card 4: Resume Downloads */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <div className="flex justify-between text-slate-400">
            <span className="text-[11px] font-semibold uppercase">CV Downloads</span>
            <Download className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">{resume.downloadsCount}</div>
          <div className="text-[10px] text-slate-500 font-mono">PDF & DOCX Tracked</div>
        </div>

        {/* Card 5: Tech Stack & Skills */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <div className="flex justify-between text-slate-400">
            <span className="text-[11px] font-semibold uppercase">Tech Items</span>
            <Code2 className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">{techStack.length}</div>
          <div className="text-[10px] text-slate-500 font-mono">{skills.length} Competencies</div>
        </div>

        {/* Card 6: Blog Posts */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <div className="flex justify-between text-slate-400">
            <span className="text-[11px] font-semibold uppercase">Blog Posts</span>
            <BookOpen className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">{blogs.length}</div>
          <div className="text-[10px] text-slate-500 font-mono">{newsletter.length} Subscribers</div>
        </div>

      </div>

      {/* Analytics Recharts Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Chart 1: Traffic Views Over Time */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-500" /> Weekly Visitor Traffic & Page Views
              </h3>
              <p className="text-xs text-slate-500">PostgreSQL analytics aggregator telemetry</p>
            </div>
            <span className="text-xs font-mono text-indigo-500 font-semibold">Live Feed</span>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.viewsOverTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Line type="monotone" dataKey="views" name="Page Views" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="uniqueVisitors" name="Unique Visitors" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Geographic Visitor Demographics */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-indigo-500" /> Geographic Demographics
          </h3>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics.visitorCountries}
                  dataKey="count"
                  nameKey="country"
                  cx="50%"
                  cy="50%"
                  outerRadius={65}
                  innerRadius={35}
                  paddingAngle={3}
                >
                  {analytics.visitorCountries.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 font-mono text-[11px]">
            {analytics.visitorCountries.slice(0, 4).map((c, i) => (
              <div key={c.code} className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  {c.country}
                </span>
                <span className="font-bold">{c.count.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Audit Logs & Recent System Activity */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" /> CMS Audit Log & System Activity Stream
          </h3>
          <span className="text-xs font-mono text-slate-400">Security Middleware</span>
        </div>

        <div className="space-y-2">
          {auditLogs.slice(0, 5).map((log) => (
            <div
              key={log.id}
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
            >
              <div className="flex items-center gap-2.5">
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  log.action === 'CREATE' ? 'bg-emerald-500/20 text-emerald-400' :
                  log.action === 'UPDATE' ? 'bg-indigo-500/20 text-indigo-400' :
                  log.action === 'DELETE' ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-800 text-slate-300'
                }`}>
                  {log.action}
                </span>
                <span className="font-bold text-slate-900 dark:text-white">[{log.module}]</span>
                <span className="text-slate-600 dark:text-slate-300">{log.details}</span>
              </div>

              <div className="flex items-center gap-3 font-mono text-[11px] text-slate-400">
                <span>{log.userRole}</span>
                <span>•</span>
                <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
