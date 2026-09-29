import React from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  Globe,
  FileText,
  Sparkles,
  Eye,
  EyeOff,
} from 'lucide-react';
import type { ResumeHeader } from '../../../../lib/resume/schema';

interface HeaderEditorProps {
  header: ResumeHeader;
  onChange: (header: ResumeHeader) => void;
}

export const HeaderEditor: React.FC<HeaderEditorProps> = ({ header, onChange }) => {
  const summaryWordCount = header.summary ? header.summary.trim().split(/\s+/).filter(Boolean).length : 0;
  const hiddenFields = new Set(header.hiddenFields || []);

  const handleChange = (field: keyof ResumeHeader, value: string) => {
    onChange({
      ...header,
      [field]: value,
    });
  };

  const toggleHiddenField = (field: string) => {
    const next = new Set(hiddenFields);
    if (next.has(field)) {
      next.delete(field);
    } else {
      next.add(field);
    }
    onChange({
      ...header,
      hiddenFields: Array.from(next),
    });
  };

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <User className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
              Contact &amp; Header Identity
            </h3>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
              Direct recruiter contact fields with per-field visibility control for exports.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
            Candidate Full Name *
          </label>
          <div className="relative">
            <User className="w-3.5 h-3.5 absolute left-3 top-2.5 text-neutral-400" />
            <input
              type="text"
              required
              value={header.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Manoj Khatri"
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Target Title */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              Target Job Title *
            </label>
            <button
              type="button"
              onClick={() => toggleHiddenField('title')}
              className={`text-[10px] font-semibold flex items-center gap-1 px-1.5 py-0.5 rounded cursor-pointer ${
                hiddenFields.has('title')
                  ? 'text-rose-600 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900'
                  : 'text-neutral-500 hover:text-neutral-800'
              }`}
              title={hiddenFields.has('title') ? 'Field is hidden in export' : 'Click to hide in export'}
            >
              {hiddenFields.has('title') ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              <span>{hiddenFields.has('title') ? 'Hidden' : 'Visible'}</span>
            </button>
          </div>
          <div className="relative">
            <Sparkles className="w-3.5 h-3.5 absolute left-3 top-2.5 text-neutral-400" />
            <input
              type="text"
              required
              value={header.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Backend Software Engineer"
              className={`w-full pl-9 pr-3 py-2 text-xs rounded-lg border bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                hiddenFields.has('title')
                  ? 'border-dashed border-rose-300 dark:border-rose-800 opacity-60'
                  : 'border-neutral-200 dark:border-neutral-700'
              }`}
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              Direct Email Address *
            </label>
            <button
              type="button"
              onClick={() => toggleHiddenField('email')}
              className={`text-[10px] font-semibold flex items-center gap-1 px-1.5 py-0.5 rounded cursor-pointer ${
                hiddenFields.has('email')
                  ? 'text-rose-600 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900'
                  : 'text-neutral-500 hover:text-neutral-800'
              }`}
              title={hiddenFields.has('email') ? 'Field is hidden in export' : 'Click to hide in export'}
            >
              {hiddenFields.has('email') ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              <span>{hiddenFields.has('email') ? 'Hidden' : 'Visible'}</span>
            </button>
          </div>
          <div className="relative">
            <Mail className="w-3.5 h-3.5 absolute left-3 top-2.5 text-neutral-400" />
            <input
              type="email"
              required
              value={header.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="manojkc1dev@gmail.com"
              className={`w-full pl-9 pr-3 py-2 text-xs rounded-lg border bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                hiddenFields.has('email')
                  ? 'border-dashed border-rose-300 dark:border-rose-800 opacity-60'
                  : 'border-neutral-200 dark:border-neutral-700'
              }`}
            />
          </div>
        </div>

        {/* Phone */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              Phone Number
            </label>
            <button
              type="button"
              onClick={() => toggleHiddenField('phone')}
              className={`text-[10px] font-semibold flex items-center gap-1 px-1.5 py-0.5 rounded cursor-pointer ${
                hiddenFields.has('phone')
                  ? 'text-rose-600 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900'
                  : 'text-neutral-500 hover:text-neutral-800'
              }`}
              title={hiddenFields.has('phone') ? 'Field is hidden in export' : 'Click to hide in export'}
            >
              {hiddenFields.has('phone') ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              <span>{hiddenFields.has('phone') ? 'Hidden' : 'Visible'}</span>
            </button>
          </div>
          <div className="relative">
            <Phone className="w-3.5 h-3.5 absolute left-3 top-2.5 text-neutral-400" />
            <input
              type="tel"
              value={header.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="+977-9800000000"
              className={`w-full pl-9 pr-3 py-2 text-xs rounded-lg border bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                hiddenFields.has('phone')
                  ? 'border-dashed border-rose-300 dark:border-rose-800 opacity-60'
                  : 'border-neutral-200 dark:border-neutral-700'
              }`}
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              Location (City, Country)
            </label>
            <button
              type="button"
              onClick={() => toggleHiddenField('location')}
              className={`text-[10px] font-semibold flex items-center gap-1 px-1.5 py-0.5 rounded cursor-pointer ${
                hiddenFields.has('location')
                  ? 'text-rose-600 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900'
                  : 'text-neutral-500 hover:text-neutral-800'
              }`}
              title={hiddenFields.has('location') ? 'Field is hidden in export' : 'Click to hide in export'}
            >
              {hiddenFields.has('location') ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              <span>{hiddenFields.has('location') ? 'Hidden' : 'Visible'}</span>
            </button>
          </div>
          <div className="relative">
            <MapPin className="w-3.5 h-3.5 absolute left-3 top-2.5 text-neutral-400" />
            <input
              type="text"
              value={header.location}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="Kathmandu, Nepal"
              className={`w-full pl-9 pr-3 py-2 text-xs rounded-lg border bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                hiddenFields.has('location')
                  ? 'border-dashed border-rose-300 dark:border-rose-800 opacity-60'
                  : 'border-neutral-200 dark:border-neutral-700'
              }`}
            />
          </div>
        </div>

        {/* LinkedIn */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              LinkedIn Profile
            </label>
            <button
              type="button"
              onClick={() => toggleHiddenField('linkedin')}
              className={`text-[10px] font-semibold flex items-center gap-1 px-1.5 py-0.5 rounded cursor-pointer ${
                hiddenFields.has('linkedin')
                  ? 'text-rose-600 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900'
                  : 'text-neutral-500 hover:text-neutral-800'
              }`}
              title={hiddenFields.has('linkedin') ? 'Field is hidden in export' : 'Click to hide in export'}
            >
              {hiddenFields.has('linkedin') ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              <span>{hiddenFields.has('linkedin') ? 'Hidden' : 'Visible'}</span>
            </button>
          </div>
          <div className="relative">
            <Linkedin className="w-3.5 h-3.5 absolute left-3 top-2.5 text-neutral-400" />
            <input
              type="url"
              value={header.linkedin || ''}
              onChange={(e) => handleChange('linkedin', e.target.value)}
              placeholder="https://linkedin.com/in/manoj-khatri"
              className={`w-full pl-9 pr-3 py-2 text-xs rounded-lg border bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                hiddenFields.has('linkedin')
                  ? 'border-dashed border-rose-300 dark:border-rose-800 opacity-60'
                  : 'border-neutral-200 dark:border-neutral-700'
              }`}
            />
          </div>
        </div>

        {/* GitHub */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              GitHub Profile
            </label>
            <button
              type="button"
              onClick={() => toggleHiddenField('github')}
              className={`text-[10px] font-semibold flex items-center gap-1 px-1.5 py-0.5 rounded cursor-pointer ${
                hiddenFields.has('github')
                  ? 'text-rose-600 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900'
                  : 'text-neutral-500 hover:text-neutral-800'
              }`}
              title={hiddenFields.has('github') ? 'Field is hidden in export' : 'Click to hide in export'}
            >
              {hiddenFields.has('github') ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              <span>{hiddenFields.has('github') ? 'Hidden' : 'Visible'}</span>
            </button>
          </div>
          <div className="relative">
            <Github className="w-3.5 h-3.5 absolute left-3 top-2.5 text-neutral-400" />
            <input
              type="url"
              value={header.github || ''}
              onChange={(e) => handleChange('github', e.target.value)}
              placeholder="https://github.com/manoj-khatri"
              className={`w-full pl-9 pr-3 py-2 text-xs rounded-lg border bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                hiddenFields.has('github')
                  ? 'border-dashed border-rose-300 dark:border-rose-800 opacity-60'
                  : 'border-neutral-200 dark:border-neutral-700'
              }`}
            />
          </div>
        </div>

        {/* Portfolio Website */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              Portfolio Website
            </label>
            <button
              type="button"
              onClick={() => toggleHiddenField('website')}
              className={`text-[10px] font-semibold flex items-center gap-1 px-1.5 py-0.5 rounded cursor-pointer ${
                hiddenFields.has('website')
                  ? 'text-rose-600 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900'
                  : 'text-neutral-500 hover:text-neutral-800'
              }`}
              title={hiddenFields.has('website') ? 'Field is hidden in export' : 'Click to hide in export'}
            >
              {hiddenFields.has('website') ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              <span>{hiddenFields.has('website') ? 'Hidden' : 'Visible'}</span>
            </button>
          </div>
          <div className="relative">
            <Globe className="w-3.5 h-3.5 absolute left-3 top-2.5 text-neutral-400" />
            <input
              type="url"
              value={header.website || ''}
              onChange={(e) => handleChange('website', e.target.value)}
              placeholder="https://manojkc1.com.np"
              className={`w-full pl-9 pr-3 py-2 text-xs rounded-lg border bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                hiddenFields.has('website')
                  ? 'border-dashed border-rose-300 dark:border-rose-800 opacity-60'
                  : 'border-neutral-200 dark:border-neutral-700'
              }`}
            />
          </div>
        </div>

        {/* Summary */}
        <div className="sm:col-span-2">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                Professional Summary
              </label>
              <button
                type="button"
                onClick={() => toggleHiddenField('summary')}
                className={`text-[10px] font-semibold flex items-center gap-1 px-1.5 py-0.5 rounded cursor-pointer ${
                  hiddenFields.has('summary')
                    ? 'text-rose-600 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900'
                    : 'text-neutral-500 hover:text-neutral-800'
                }`}
                title={hiddenFields.has('summary') ? 'Summary is hidden in export' : 'Click to hide summary in export'}
              >
                {hiddenFields.has('summary') ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                <span>{hiddenFields.has('summary') ? 'Hidden in Export' : 'Visible'}</span>
              </button>
            </div>
            <span
              className={`text-[11px] font-mono ${
                summaryWordCount >= 40 && summaryWordCount <= 120
                  ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                  : 'text-amber-600 dark:text-amber-400'
              }`}
            >
              {summaryWordCount} words (ideal: 40–120)
            </span>
          </div>
          <textarea
            rows={3}
            value={header.summary || ''}
            onChange={(e) => handleChange('summary', e.target.value)}
            placeholder="Performance-driven Backend Software Engineer with 3+ years of experience architecting and maintaining production Django REST APIs, PostgreSQL databases, and Celery worker pipelines..."
            className={`w-full px-3 py-2 text-xs rounded-lg border bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed ${
              hiddenFields.has('summary')
                ? 'border-dashed border-rose-300 dark:border-rose-800 opacity-60'
                : 'border-neutral-200 dark:border-neutral-700'
            }`}
          />
        </div>
      </div>
    </div>
  );
};

