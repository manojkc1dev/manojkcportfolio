import React, { useState, useEffect } from 'react';
import { useCMS } from '../../context/CMSContext';
import {
  X,
  Code2,
  Database,
  Layers,
  Container,
  Play,
  Copy,
  Check,
  Server,
  Key,
  ShieldAlert,
  FileCode2,
  CheckCircle2,
  Terminal,
  Cpu
} from 'lucide-react';

export const ArchitectureDocsModal: React.FC = () => {
  const { isArchitectureDocsOpen, setIsArchitectureDocsOpen, hero, projects, analytics } = useCMS();
  const [activeTab, setActiveTab] = useState<'swagger' | 'er_diagram' | 'clean_arch' | 'deployment'>('swagger');
  
  // Swagger state
  const [selectedEndpoint, setSelectedEndpoint] = useState<'hero' | 'projects' | 'contact' | 'dashboard'>('projects');
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsArchitectureDocsOpen(false);
      }
    };
    if (isArchitectureDocsOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isArchitectureDocsOpen, setIsArchitectureDocsOpen]);

  if (!isArchitectureDocsOpen) return null;

  const handleExecuteApi = () => {
    setIsExecuting(true);
    setTimeout(() => {
      let data: any = {};
      if (selectedEndpoint === 'hero') data = hero;
      if (selectedEndpoint === 'projects') data = { count: projects.length, results: projects };
      if (selectedEndpoint === 'dashboard') data = analytics;
      if (selectedEndpoint === 'contact') data = { status: '201 Created', message_id: 'msg_98412', status_code: 201 };
      
      setApiResponse(JSON.stringify(data, null, 2));
      setIsExecuting(false);
    }, 400);
  };

  const getCurlCommand = () => {
    switch (selectedEndpoint) {
      case 'hero':
        return `curl -X GET "https://api.portfolio.example.com/api/v1/hero/" \\
  -H "Accept: application/json"`;
      case 'projects':
        return `curl -X GET "https://api.portfolio.example.com/api/v1/projects/?featured=true&category=Distributed+Systems" \\
  -H "Accept: application/json"`;
      case 'contact':
        return `curl -X POST "https://api.portfolio.example.com/api/v1/contact/" \\
  -H "Content-Type: application/json" \\
  -d '{"name":"Architect", "email":"lead@enterprise.com", "subject":"Advisory Inquiry", "message":"Backend migration discussion"}'`;
      case 'dashboard':
        return `curl -X GET "https://api.portfolio.example.com/api/v1/admin/dashboard/" \\
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."`;
    }
  };

  const copyCurl = () => {
    navigator.clipboard.writeText(getCurlCommand());
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setIsArchitectureDocsOpen(false);
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in"
    >
      <div className="relative w-full max-w-5xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[90vh]">
        
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Enterprise Architecture & API Docs Suite
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-mono font-semibold">
                  100k+ Visitors Scalable
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                Django 5.0 REST Framework • FastAPI • PostgreSQL • Celery • Docker
              </p>
            </div>
          </div>
          <button
            type="button"
            aria-label="Close Architecture Docs"
            onClick={() => setIsArchitectureDocsOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-rose-600 transition-all cursor-pointer"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Tab Selector Bar */}
        <div className="flex items-center gap-1 px-6 border-b border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/50 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('swagger')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all ${
              activeTab === 'swagger'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Server className="w-4 h-4" />
            OpenAPI / Swagger Explorer
          </button>
          <button
            onClick={() => setActiveTab('er_diagram')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all ${
              activeTab === 'er_diagram'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Database className="w-4 h-4" />
            PostgreSQL ER Diagram
          </button>
          <button
            onClick={() => setActiveTab('clean_arch')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all ${
              activeTab === 'clean_arch'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            Django Clean Architecture
          </button>
          <button
            onClick={() => setActiveTab('deployment')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all ${
              activeTab === 'deployment'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Container className="w-4 h-4" />
            Docker & CI/CD Production Guide
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto flex-1">
          
          {/* TAB 1: SWAGGER EXPLORER */}
          {activeTab === 'swagger' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <button
                  onClick={() => { setSelectedEndpoint('projects'); setApiResponse(null); }}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedEndpoint === 'projects'
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-300'
                      : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500 text-white">GET</span>
                    <span className="text-[10px] font-mono text-slate-400">/v1/projects</span>
                  </div>
                  <div className="text-xs font-bold mt-2">Projects List API</div>
                </button>

                <button
                  onClick={() => { setSelectedEndpoint('hero'); setApiResponse(null); }}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedEndpoint === 'hero'
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-300'
                      : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500 text-white">GET</span>
                    <span className="text-[10px] font-mono text-slate-400">/v1/hero</span>
                  </div>
                  <div className="text-xs font-bold mt-2">Hero Section API</div>
                </button>

                <button
                  onClick={() => { setSelectedEndpoint('contact'); setApiResponse(null); }}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedEndpoint === 'contact'
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-300'
                      : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500 text-white">POST</span>
                    <span className="text-[10px] font-mono text-slate-400">/v1/contact</span>
                  </div>
                  <div className="text-xs font-bold mt-2">Submit Contact Message</div>
                </button>

                <button
                  onClick={() => { setSelectedEndpoint('dashboard'); setApiResponse(null); }}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedEndpoint === 'dashboard'
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-300'
                      : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-500 text-white">JWT</span>
                    <span className="text-[10px] font-mono text-slate-400">/admin/metrics</span>
                  </div>
                  <div className="text-xs font-bold mt-2">CMS Admin Metrics</div>
                </button>
              </div>

              {/* cURL Request Generator */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">cURL Command Request</h4>
                  <button
                    onClick={copyCurl}
                    className="flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    {copiedCurl ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedCurl ? 'Copied!' : 'Copy cURL'}
                  </button>
                </div>
                <pre className="p-4 rounded-xl bg-slate-950 text-slate-200 font-mono text-xs border border-slate-800 overflow-x-auto">
                  {getCurlCommand()}
                </pre>
              </div>

              {/* Execute Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleExecuteApi}
                  disabled={isExecuting}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-all shadow-md shadow-indigo-600/30"
                >
                  <Play className="w-4 h-4 fill-current" />
                  {isExecuting ? 'Sending Request...' : 'Try It Out (Execute REST Call)'}
                </button>
              </div>

              {/* Response Preview */}
              {apiResponse && (
                <div className="space-y-2 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold text-emerald-500 uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Response Code: 200 OK (Application/JSON)
                    </h4>
                    <span className="text-[10px] font-mono text-slate-400">Time: 14ms • Server: Gunicorn/Nginx</span>
                  </div>
                  <pre className="p-4 rounded-xl bg-slate-950 text-emerald-400 font-mono text-xs border border-slate-800 max-h-60 overflow-y-auto">
                    {apiResponse}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: POSTGRESQL ER DIAGRAM */}
          {activeTab === 'er_diagram' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-900 dark:text-indigo-300">
                <span className="font-bold">PostgreSQL Relational Topology:</span> Fully normalized DB schema with UUID primary keys, soft-delete (<code className="font-mono">deleted_at</code>), audit fields (<code className="font-mono">created_by</code>, <code className="font-mono">created_at</code>), and foreign key indices.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
                
                {/* Table: accounts_user */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="font-bold text-indigo-600 dark:text-indigo-400 border-b border-slate-200 dark:border-slate-800 pb-2 flex items-center justify-between">
                    <span>accounts_user</span>
                    <span className="text-[10px] text-slate-400 font-normal">AUTH</span>
                  </div>
                  <div className="space-y-1 text-slate-600 dark:text-slate-300 text-[11px]">
                    <div className="text-amber-500 font-bold">🔑 id (UUID, PK)</div>
                    <div>email (VARCHAR 255, UNIQUE)</div>
                    <div>password_hash (VARCHAR 255)</div>
                    <div>role (ENUM: SuperAdmin, Admin, Editor)</div>
                    <div>is_active (BOOLEAN)</div>
                    <div>created_at (TIMESTAMP)</div>
                  </div>
                </div>

                {/* Table: projects_project */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="font-bold text-indigo-600 dark:text-indigo-400 border-b border-slate-200 dark:border-slate-800 pb-2 flex items-center justify-between">
                    <span>projects_project</span>
                    <span className="text-[10px] text-slate-400 font-normal">CORE</span>
                  </div>
                  <div className="space-y-1 text-slate-600 dark:text-slate-300 text-[11px]">
                    <div className="text-amber-500 font-bold">🔑 id (UUID, PK)</div>
                    <div>title (VARCHAR 255)</div>
                    <div>slug (VARCHAR 255, UNIQUE)</div>
                    <div>category_id (UUID, FK -&gt; project_category)</div>
                    <div>problem (TEXT)</div>
                    <div>solution (TEXT)</div>
                    <div>status (ENUM: Published, Draft)</div>
                    <div className="text-slate-400">deleted_at (TIMESTAMP NULL)</div>
                  </div>
                </div>

                {/* Table: techstack_item */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="font-bold text-indigo-600 dark:text-indigo-400 border-b border-slate-200 dark:border-slate-800 pb-2 flex items-center justify-between">
                    <span>techstack_item</span>
                    <span className="text-[10px] text-slate-400 font-normal">M2M</span>
                  </div>
                  <div className="space-y-1 text-slate-600 dark:text-slate-300 text-[11px]">
                    <div className="text-amber-500 font-bold">🔑 id (UUID, PK)</div>
                    <div>name (VARCHAR 100)</div>
                    <div>category (VARCHAR 50)</div>
                    <div>skill_level (INT)</div>
                    <div>official_website (VARCHAR 255)</div>
                    <div>display_order (INT)</div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 3: CLEAN ARCHITECTURE MAP */}
          {activeTab === 'clean_arch' && (
            <div className="space-y-6">
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Following <strong>Clean Architecture & HackSoft Django Styleguide</strong>. Each Django app inside <code className="font-mono text-indigo-500">portfolio_backend/apps/</code> separates concerns cleanly:
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <div className="font-bold text-indigo-500 mb-1">models.py</div>
                  <div className="text-[11px] text-slate-500">ORMs, DB Constraints, UUID PKs</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <div className="font-bold text-indigo-500 mb-1">serializers.py</div>
                  <div className="text-[11px] text-slate-500">DRF Serialization & Validation</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <div className="font-bold text-indigo-500 mb-1">selectors.py</div>
                  <div className="text-[11px] text-slate-500">Read Queries & Prefetch Logic</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <div className="font-bold text-indigo-500 mb-1">services.py</div>
                  <div className="text-[11px] text-slate-500">Business Logic Mutators & Transactions</div>
                </div>
              </div>

              <pre className="p-4 rounded-xl bg-slate-950 text-indigo-300 font-mono text-xs overflow-x-auto border border-slate-800 leading-relaxed">
                {`# portfolio_backend/apps/projects/services.py
from django.db import transaction
from .models import Project

@transaction.atomic
def project_create(*, title: str, problem: str, solution: str, user_id: str) -> Project:
    project = Project(title=title, problem=problem, solution=solution)
    project.full_clean()
    project.save()
    
    # Trigger async Celery task for image compression & cache invalidate
    invalidate_project_cache_task.delay(project_id=str(project.id))
    return project`}
              </pre>
            </div>
          )}

          {/* TAB 4: DOCKER & CI/CD */}
          {activeTab === 'deployment' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                
                {/* Dockerfile */}
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Container className="w-4 h-4 text-indigo-500" /> Dockerfile (Multi-Stage Build)
                  </h4>
                  <pre className="p-4 rounded-xl bg-slate-950 text-slate-300 font-mono text-[11px] border border-slate-800 overflow-x-auto max-h-56">
                    {`FROM python:3.12-slim AS builder
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

FROM python:3.12-slim
WORKDIR /app
COPY --from=builder /usr/local /usr/local
COPY . .
EXPOSE 3000
CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:3000", "--workers", "4"]`}
                  </pre>
                </div>

                {/* docker-compose.yml */}
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Server className="w-4 h-4 text-indigo-500" /> docker-compose.yml
                  </h4>
                  <pre className="p-4 rounded-xl bg-slate-950 text-slate-300 font-mono text-[11px] border border-slate-800 overflow-x-auto max-h-56">
                    {`version: '3.8'
services:
  web:
    build: .
    ports: ["3000:3000"]
    env_file: .env
    depends_on: [postgres, redis]

  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: portfolio_db

  redis:
    image: redis:7-alpine

  celery_worker:
    build: .
    command: celery -A config worker -l info`}
                  </pre>
                </div>

              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span className="font-mono">drf-spectacular v0.27 • OpenAPI 3.0</span>
          <button
            onClick={() => setIsArchitectureDocsOpen(false)}
            className="px-4 py-1.5 rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold hover:bg-slate-800 dark:hover:bg-white transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
