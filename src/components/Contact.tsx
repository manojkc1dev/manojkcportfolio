import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mail,
  Phone,
  MessageCircle,
  MapPin,
  Copy,
  Check,
  Send,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Facebook,
  Music2,
  Sparkles,
  Info,
} from 'lucide-react';
import { isFirebaseConfigured, db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { track } from '../lib/analytics';

interface DirectContactItem {
  id: string;
  label: string;
  value: string;
  displayValue: string;
  icon: React.ElementType;
  href?: string;
}

const directContacts: DirectContactItem[] = [
  {
    id: 'email',
    label: 'Email',
    value: 'manojkc1dev@gmail.com',
    displayValue: 'manojkc1dev@gmail.com',
    icon: Mail,
    href: 'mailto:manojkc1dev@gmail.com',
  },
  {
    id: 'phone',
    label: 'Phone',
    value: '+977 9842203976',
    displayValue: '+977 9842203976',
    icon: Phone,
    href: 'tel:+9779842203976',
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    value: '+977 9842203976',
    displayValue: '+977 9842203976',
    icon: MessageCircle,
    href: 'https://wa.me/9779842203976',
  },
  {
    id: 'location',
    label: 'Location',
    value: 'Kathmandu, Nepal (UTC+5:45)',
    displayValue: 'Kathmandu, Nepal (UTC+5:45)',
    icon: MapPin,
  },
];

interface SocialLinkItem {
  name: string;
  url: string;
  icon: React.ElementType;
  handle: string;
}

const socialLinks: SocialLinkItem[] = [
  {
    name: 'GitHub',
    url: 'https://github.com/manojkc1dev/',
    icon: Github,
    handle: '@manojkc1dev',
  },
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com/in/manojkc1dev/',
    icon: Linkedin,
    handle: '@manojkc1dev',
  },
  {
    name: 'X',
    url: 'https://twitter.com/manojkc1dev',
    icon: Twitter,
    handle: '@manojkc1dev',
  },
  {
    name: 'Instagram',
    url: 'https://instagram.com/manojkc1dev',
    icon: Instagram,
    handle: '@manojkc1dev',
  },
  {
    name: 'Facebook',
    url: 'https://facebook.com/manojkc1dev',
    icon: Facebook,
    handle: '@manojkc1dev',
  },
  {
    name: 'TikTok',
    url: 'https://tiktok.com/@manojkc1dev',
    icon: Music2,
    handle: '@manojkc1dev',
  },
];

export const Contact: React.FC = () => {
  // Direct item clipboard copy feedback map
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState(''); // Anti-spam honeypot field

  // Form States & Errors
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleCopy = (id: string, textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId((prev) => (prev === id ? null : prev));
    }, 2400);
  };

  const validateForm = () => {
    const newErrors: { name?: string; email?: string; message?: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Please enter your name.';
    }

    const emailTrimmed = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailTrimmed) {
      newErrors.email = 'Please enter your email address.';
    } else if (!emailRegex.test(emailTrimmed)) {
      newErrors.email = 'Please provide a valid email address.';
    }

    const messageTrimmed = message.trim();
    if (!messageTrimmed) {
      newErrors.message = 'Please enter a message.';
    } else if (messageTrimmed.length < 10) {
      newErrors.message = 'Message must be at least 10 characters long.';
    } else if (messageTrimmed.length > 2000) {
      newErrors.message = 'Message must not exceed 2,000 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Honeypot check: If filled, fail silently or reject
    if (honeypot.trim() !== '') {
      setStatus('error');
      setErrorMessage('Spam detected. Submission blocked.');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    // If Firebase / production backend is not configured, show friendly notice instead of POSTing
    if (!isFirebaseConfigured) {
      setTimeout(() => {
        setStatus('success');
        setToastMessage("Thanks! Running in UI-only mode (Firebase not configured). Message preview captured.");
        setName('');
        setEmail('');
        setMessage('');
        setHoneypot('');
        setErrors({});
        track('contact_submit', { mode: 'unconfigured_preview' });
        setTimeout(() => {
          setToastMessage(null);
          setStatus('idle');
        }, 7000);
      }, 500);
      return;
    }

    try {
      let delivered = false;

      // 1. Deliver via Server Contact API route (persists to server store)
      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            message: message.trim(),
            _hp: honeypot,
            hp_field: honeypot,
          }),
        });

        if (response.ok) {
          delivered = true;
        } else if (response.status !== 404 && response.status !== 502) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || 'Failed to deliver message. Please try again.');
        }
      } catch (apiErr) {
        if (apiErr instanceof Error && !apiErr.message.includes('fetch') && !apiErr.message.includes('Failed to fetch')) {
          throw apiErr;
        }
      }

      // 2. Client-side LocalStorage persistence mirror
      try {
        const localList = JSON.parse(localStorage.getItem('portfolio_inquiries') || '[]');
        localList.unshift({
          id: `inquiry-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
          createdAt: new Date().toISOString(),
          read: false,
          replied: false,
        });
        localStorage.setItem('portfolio_inquiries', JSON.stringify(localList.slice(0, 100)));
        delivered = true;
      } catch (lsErr) {
        console.warn('LocalStorage backup error:', lsErr);
      }

      // 3. Direct Firestore write if available
      if (db) {
        try {
          await addDoc(collection(db, 'messages'), {
            name: name.trim(),
            email: email.trim(),
            message: message.trim(),
            createdAt: serverTimestamp(),
            read: false,
            replied: false,
          });
          delivered = true;
        } catch (fsErr) {
          console.warn('Firestore write notice (fallback active):', fsErr);
        }
      }

      if (!delivered) {
        throw new Error('Unable to deliver message at this moment. Please reach out directly to manojkc1dev@gmail.com');
      }

      setStatus('success');
      setToastMessage("Thanks! Your message has been received. I'll get back to you within 24 hours.");
      track('contact_submit', { mode: 'delivered' });
      // Reset form
      setName('');
      setEmail('');
      setMessage('');
      setHoneypot('');
      setErrors({});

      // Auto-dismiss toast after 7 seconds
      setTimeout(() => {
        setToastMessage(null);
        setStatus('idle');
      }, 7000);
    } catch (err: unknown) {
      setStatus('error');
      const errStr = err instanceof Error ? err.message : 'An unexpected error occurred while sending. Please try again.';
      setErrorMessage(errStr);
    }
  };

  return (
    <section
      id="contact"
      aria-label="Contact Manoj K.C."
      className="py-20 sm:py-24 lg:py-28 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Floating Toast Notification on Success */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              id="contact-success-toast"
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="fixed top-24 left-1/2 -translate-x-1/2 z-50 max-w-md w-[92%] sm:w-auto px-5 py-3.5 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xl border border-slate-700/80 dark:border-slate-200 flex items-center gap-3 backdrop-blur-md"
            >
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 dark:text-emerald-600 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="flex-1 text-xs sm:text-sm font-semibold">
                {toastMessage}
              </div>
              <button
                type="button"
                onClick={() => setToastMessage(null)}
                aria-label="Dismiss message notification"
                className="text-neutral-400 hover:text-white dark:hover:text-neutral-900 text-xs font-mono px-2 py-1 rounded cursor-pointer"
              >
                ✕
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-12 gap-x-16 lg:gap-x-20 items-start">
          {/* LEFT COLUMN: Heading, Short Pitch, Direct Items with Copy, Socials */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
            className="flex flex-col"
          >
            {/* Eyebrow Badge */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200/80 dark:border-indigo-900/60 font-mono uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Get In Touch</span>
              </div>
            </div>

            {/* Heading */}
            <h2
              id="contact-heading"
              className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mt-4 mb-5 leading-tight"
            >
              Let&apos;s build something reliable.
            </h2>

            {/* Short Pitch */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-md leading-relaxed">
              Open to remote backend freelance contracts and junior backend roles. I usually reply within 24 hours.
            </p>

            {/* Divider before Direct Contact */}
            <div className="mt-10 mb-6 border-t border-slate-200 dark:border-slate-800" />

            {/* Direct Contact Heading */}
            <h3 className="text-xs uppercase tracking-widest font-medium text-slate-500 dark:text-slate-400 mb-4">
              Direct Contact Information
            </h3>

            {/* Direct Contact Items (Uniform 72px min height, 16px padding) */}
            <div className="space-y-3">
              {directContacts.map((item) => {
                const Icon = item.icon;
                const isCopied = copiedId === item.id;

                return (
                  <div
                    key={item.id}
                    id={`contact-item-${item.id}`}
                    className="min-h-[72px] p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between gap-3 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors duration-150"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center shrink-0 text-indigo-600 dark:text-indigo-400">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[11px] uppercase tracking-wider font-medium text-slate-500 dark:text-slate-400 mb-0.5">
                          {item.label}
                        </div>
                        {item.href ? (
                          <a
                            href={item.href}
                            target={item.href.startsWith('http') ? '_blank' : undefined}
                            rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                            className="text-sm font-semibold text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors truncate block"
                          >
                            {item.displayValue}
                          </a>
                        ) : (
                          <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                            {item.displayValue}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Copy-to-Clipboard Button (Icon-only, 32x32) */}
                    <button
                      type="button"
                      onClick={() => handleCopy(item.id, item.value)}
                      aria-label={`Copy ${item.label.toLowerCase()}`}
                      title={`Copy ${item.label}`}
                      className="w-8 h-8 rounded-md flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 ml-auto cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                    >
                      {isCopied ? (
                        <Check className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Divider before Socials */}
            <div className="mt-10 mb-6 border-t border-slate-200 dark:border-slate-800" />

            {/* Social Block */}
            <div>
              <h3 className="text-xs uppercase tracking-widest font-medium text-slate-500 dark:text-slate-400 mb-4">
                Online Profiles (@manojkc1dev)
              </h3>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      id={`contact-social-${social.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => track('social_click', { platform: social.name })}
                      aria-label={`${social.name} profile`}
                      className="w-10 h-10 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:border-indigo-400 hover:text-indigo-600 dark:hover:border-indigo-500 dark:hover:text-indigo-400 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* RIGHT COLUMN: Contact Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:sticky lg:top-24"
          >
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-8 shadow-sm relative">
              <div className="mb-6">
                <h3
                  id="contact-form-heading"
                  className="text-2xl font-semibold mb-1 text-slate-900 dark:text-white"
                >
                  Send a M{'\u200B'}essage
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Fill in the details below to start a conversation about your project or role.
                </p>
              </div>

              {/* Friendly notice when Firebase is not configured */}
              {!isFirebaseConfigured && (
                <div
                  id="contact-unconfigured-notice"
                  className="mb-6 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs flex items-center gap-2.5"
                >
                  <Info className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
                  <span>
                    <strong>UI-Only Mode:</strong> Firebase is not configured with live credentials. Form submissions simulate preview delivery locally.
                  </span>
                </div>
              )}

              {/* Inline Failure Banner with Retry Button */}
              {status === 'error' && (
                <div
                  id="contact-form-error-banner"
                  className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs sm:text-sm"
                >
                  <div className="flex items-center gap-2.5">
                    <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
                    <span>{errorMessage || 'Failed to send message. Please try again.'}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSubmit()}
                    className="px-3 py-1.5 rounded-lg font-semibold text-xs bg-rose-600 hover:bg-rose-500 text-white shadow-xs transition-colors shrink-0 cursor-pointer"
                  >
                    Retry
                  </button>
                </div>
              )}

              {/* Contact Form */}
              <form
                role="form"
                aria-labelledby="contact-form-heading"
                onSubmit={handleSubmit}
                noValidate
                className="space-y-5"
              >
                {/* Honeypot Field (Anti-spam, must remain empty) */}
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    left: '-9999px',
                    top: '-9999px',
                    opacity: 0,
                    pointerEvents: 'none',
                  }}
                >
                  <label htmlFor="hp_field">Do not fill this field</label>
                  <input
                    type="text"
                    id="hp_field"
                    name="hp_field"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                  />
                </div>

                {/* Name Input */}
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block text-xs uppercase tracking-wider font-medium text-slate-700 dark:text-slate-300 mb-2"
                  >
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="contact-name"
                    name="name"
                    required
                    placeholder="e.g. Maya Sharma"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                    }}
                    className={`w-full h-11 px-3 rounded-lg border bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-slate-100 placeholder:text-sm placeholder:text-slate-400 focus:outline-none transition-colors ${
                      errors.name
                        ? 'border-red-500 focus:ring-2 focus:ring-red-500/20'
                        : 'border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                    }`}
                  />
                  {errors.name && (
                    <p className="mt-1.5 text-xs text-red-500 font-medium flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.name}</span>
                    </p>
                  )}
                </div>

                {/* Email Input */}
                <div>
                  <label
                    htmlFor="contact-email"
                    className="block text-xs uppercase tracking-wider font-medium text-slate-700 dark:text-slate-300 mb-2"
                  >
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="contact-email"
                    name="email"
                    required
                    placeholder="e.g. maya@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                    }}
                    className={`w-full h-11 px-3 rounded-lg border bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-slate-100 placeholder:text-sm placeholder:text-slate-400 focus:outline-none transition-colors ${
                      errors.email
                        ? 'border-red-500 focus:ring-2 focus:ring-red-500/20'
                        : 'border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1.5 text-xs text-red-500 font-medium flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>

                {/* Message Textarea */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label
                      htmlFor="contact-message"
                      className="text-xs uppercase tracking-wider font-medium text-slate-700 dark:text-slate-300"
                    >
                      Message <span className="text-red-500">*</span>
                    </label>
                    <span
                      className={`text-xs ${
                        message.length > 2000
                          ? 'text-red-500 font-semibold'
                          : message.length < 10 && message.length > 0
                          ? 'text-amber-500'
                          : 'text-slate-400'
                      }`}
                    >
                      {message.length} / 2000
                    </span>
                  </div>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={5}
                    placeholder="Tell me about your project or role..."
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      if (errors.message) setErrors((prev) => ({ ...prev, message: undefined }));
                    }}
                    className={`w-full min-h-[140px] resize-y px-3 py-2 rounded-lg border bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-slate-100 placeholder:text-sm placeholder:text-slate-400 focus:outline-none transition-colors ${
                      errors.message
                        ? 'border-red-500 focus:ring-2 focus:ring-red-500/20'
                        : 'border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                    }`}
                  />
                  {errors.message && (
                    <p className="mt-1.5 text-xs text-red-500 font-medium flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.message}</span>
                    </p>
                  )}
                </div>

                {/* Submit Button (Solid indigo-600, w-full sm:w-auto, h-11, px-6) */}
                <div className="pt-2">
                  <button
                    type="submit"
                    id="contact-submit-btn"
                    disabled={status === 'loading'}
                    className="w-full sm:w-auto h-11 px-6 rounded-lg inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-medium text-sm disabled:opacity-60 disabled:cursor-not-allowed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 cursor-pointer"
                  >
                    {status === 'loading' ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

