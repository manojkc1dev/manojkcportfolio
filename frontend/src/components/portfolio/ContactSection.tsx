import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';
import { WhatsAppIcon } from '../common/WhatsAppIcon';
import { Mail, Send, CheckCircle2, MapPin, ShieldCheck, Terminal } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const { hero, addContactMessage, setViewMode } = useCMS();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    addContactMessage({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      subject: formData.subject || 'Direct Engagement Query',
      message: formData.message,
    });

    setSubmitted(true);
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <section id="contact" className="py-20 bg-white dark:bg-slate-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 uppercase tracking-wider">
            Direct Principal Inquiry
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            Initiate Architectural Engagement
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Submit a message directly to the CMS backend inbox. Captured in real time for review.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Direct Info Card (Col 1-5) */}
          <div className="lg:col-span-5 space-y-6 p-8 rounded-3xl bg-slate-950 text-white border border-slate-800 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-2">
              <h3 className="text-xl font-extrabold text-white">Direct Channels</h3>
              <p className="text-xs text-slate-400">Available for Principal Software Architect engagements, advisory roles, and high-load system audits.</p>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
                <Mail className="w-4 h-4 text-indigo-400" />
                <div>
                  <span className="text-slate-500 block text-[10px]">DIRECT EMAIL</span>
                  <a href={hero.emailUrl} className="font-bold text-slate-200 hover:text-indigo-300">
                    contactmanojkhatri@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
                <WhatsAppIcon className="w-4 h-4 text-emerald-400" />
                <div>
                  <span className="text-slate-500 block text-[10px]">WHATSAPP DIRECT</span>
                  <a href={hero.whatsappUrl || 'https://wa.me/9779809807760'} target="_blank" rel="noopener noreferrer" className="font-bold text-slate-200 hover:text-emerald-300">
                    +977 9809807760
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
                <MapPin className="w-4 h-4 text-amber-400" />
                <div>
                  <span className="text-slate-500 block text-[10px]">LOCATION</span>
                  <span className="font-bold text-slate-200">{hero.location}</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-indigo-950/50 border border-indigo-800 space-y-1 text-xs">
              <span className="font-bold text-indigo-300 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Real-Time CMS Delivery
              </span>
              <p className="text-[11px] text-indigo-200/80">
                Messages submitted via the form opposite immediately arrive in the CMS Admin Message Inbox with IP and device telemetry.
              </p>
            </div>

            <button
              onClick={() => setViewMode('CMS_ADMIN')}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2"
            >
              <Terminal className="w-4 h-4" /> Open CMS Admin Inbox
            </button>
          </div>

          {/* Contact Form (Col 6-12) */}
          <div className="lg:col-span-7 p-8 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm">
            
            {submitted && (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 flex items-center gap-3 animate-fade-in">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                <div>
                  <div className="font-bold">Message Dispatched & Captured in CMS!</div>
                  <p className="text-[11px] mt-0.5">Your inquiry has been stored in the Django REST backend messages table.</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Evelyn Vance"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. lead@enterprise.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="+1 415 555 0192"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Subject / Topic
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. System Architecture Audit"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Message / System Requirements *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe your architecture requirements, throughput targets, or consulting scope..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Submit Message to CMS Backend
              </button>
            </form>
          </div>

        </div>

      </div>
    </section>
  );
};
