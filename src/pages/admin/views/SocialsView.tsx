import React, { useState } from 'react';
import {
  Share2,
  Mail,
  Phone,
  Github,
  Linkedin,
  Twitter,
  MapPin,
  Save,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import type { SocialLink } from '../../../types';

interface SocialsViewProps {
  email: string;
  phone?: string;
  location: string;
  socials: SocialLink[];
  onUpdateSocials: (data: { email: string; phone: string; location: string; socials: SocialLink[] }) => void;
  onShowToast: (message: string) => void;
}

export const SocialsView: React.FC<SocialsViewProps> = ({
  email,
  phone = '+977 9842203976',
  location,
  socials,
  onUpdateSocials,
  onShowToast,
}) => {
  const [localEmail, setLocalEmail] = useState(email);
  const [localPhone, setLocalPhone] = useState(phone);
  const [localLocation, setLocalLocation] = useState(location);
  const [localSocials, setLocalSocials] = useState<SocialLink[]>(socials);

  const handleSave = () => {
    onUpdateSocials({
      email: localEmail,
      phone: localPhone,
      location: localLocation,
      socials: localSocials,
    });
    try {
      localStorage.setItem('portfolio_socials', JSON.stringify({
        email: localEmail,
        phone: localPhone,
        location: localLocation,
        socials: localSocials,
      }));
    } catch (e) {
      console.warn('Storage save failed:', e);
    }
    onShowToast('Contact details & Social profiles saved successfully.');
  };

  const handleUpdateSocialUrl = (index: number, url: string) => {
    const updated = [...localSocials];
    updated[index] = { ...updated[index], url };
    setLocalSocials(updated);
  };

  const handleUpdateSocialHandle = (index: number, handle: string) => {
    const updated = [...localSocials];
    updated[index] = { ...updated[index], handle };
    setLocalSocials(updated);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white flex items-center gap-2">
            <Share2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <span>Social Profiles &amp; Direct Contact</span>
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
            Manage your public professional links (GitHub, LinkedIn, Twitter/X) and direct contact coordinates.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-sm transition-colors cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save Contact Info</span>
        </button>
      </div>

      {/* Direct Contact Coordinates */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
          <Mail className="w-4 h-4 text-indigo-500" />
          <span>Direct Contact Coordinates</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Primary Direct Email
            </label>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-neutral-400 shrink-0" />
              <input
                type="email"
                value={localEmail}
                onChange={(e) => setLocalEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Phone / WhatsApp Number
            </label>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
              <input
                type="text"
                value={localPhone}
                onChange={(e) => setLocalPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Base Location
            </label>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
              <input
                type="text"
                value={localLocation}
                onChange={(e) => setLocalLocation(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Social Profiles Grid */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
          <Share2 className="w-4 h-4 text-indigo-500" />
          <span>Professional Network &amp; Profiles</span>
        </h2>

        <div className="space-y-4">
          {localSocials.map((social, idx) => {
            const isGithub = social.name.toLowerCase().includes('github');
            const isLinkedin = social.name.toLowerCase().includes('linkedin');
            const isTwitter = social.name.toLowerCase().includes('twitter') || social.name.toLowerCase().includes('x');

            return (
              <div
                key={idx}
                className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2.5 min-w-[140px]">
                  {isGithub && <Github className="w-4 h-4 text-neutral-800 dark:text-neutral-200" />}
                  {isLinkedin && <Linkedin className="w-4 h-4 text-blue-600" />}
                  {isTwitter && <Twitter className="w-4 h-4 text-sky-500" />}
                  {!isGithub && !isLinkedin && !isTwitter && <Share2 className="w-4 h-4 text-indigo-500" />}
                  <span className="text-xs font-bold text-neutral-900 dark:text-white">
                    {social.name}
                  </span>
                </div>

                <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="url"
                    placeholder="Profile URL"
                    value={social.url}
                    onChange={(e) => handleUpdateSocialUrl(idx, e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg text-xs bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <input
                    type="text"
                    placeholder="Handle (e.g. @manojkc1dev)"
                    value={social.handle || ''}
                    onChange={(e) => handleUpdateSocialHandle(idx, e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg text-xs bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <a
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg text-neutral-400 hover:text-indigo-600 transition-colors shrink-0"
                  title={`Open ${social.name}`}
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
