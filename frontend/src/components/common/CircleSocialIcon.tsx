import React from 'react';

export type SocialPlatformType =
  | 'instagram'
  | 'facebook'
  | 'twitter'
  | 'x'
  | 'line'
  | 'whatsapp'
  | 'youtube'
  | 'spotify'
  | 'google'
  | 'pinterest'
  | 'linkedin'
  | 'snapchat'
  | 'skype'
  | 'messenger'
  | 'tiktok'
  | 'behance'
  | 'dribbble'
  | 'github'
  | 'email'
  | 'mail'
  | 'website'
  | 'globe'
  | 'telegram';

interface CircleSocialIconProps {
  platform: string;
  url?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'outline' | 'brand-outline' | 'subtle';
  className?: string;
  title?: string;
  onClick?: () => void;
}

export const CircleSocialIcon: React.FC<CircleSocialIconProps> = ({
  platform,
  url,
  size = 'md',
  variant = 'outline',
  className = '',
  title,
  onClick,
}) => {
  const norm = (platform || '').toLowerCase().trim();

  // Size definitions for the outer circle and inner SVG
  const sizeConfig = {
    sm: { container: 'w-8 h-8', svg: 'w-4 h-4', stroke: 'border-[1.75px]' },
    md: { container: 'w-10 h-10', svg: 'w-5 h-5', stroke: 'border-2' },
    lg: { container: 'w-12 h-12', svg: 'w-6 h-6', stroke: 'border-2' },
    xl: { container: 'w-14 h-14', svg: 'w-7 h-7', stroke: 'border-[2.5px]' },
  }[size];

  // Helper to render platform-specific SVG glyphs matching the EPS-10 reference icon set
  const renderGlyph = (type: string) => {
    switch (type) {
      case 'instagram':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={sizeConfig.svg}>
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <circle cx="12" cy="12" r="4" />
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
          </svg>
        );

      case 'facebook':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" className={sizeConfig.svg}>
            <path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H7v3h3v8h3v-8h3l1-3h-4v-2c0-.6.4-1 1-1z" />
          </svg>
        );

      case 'twitter':
      case 'x':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" className={sizeConfig.svg}>
            <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
          </svg>
        );

      case 'line':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={sizeConfig.svg}>
            <path d="M21 11.5C21 6.8 16.97 3 12 3S3 6.8 3 11.5c0 4.19 3.2 7.7 7.7 8.35.48.1.75.27.7.67-.06.45-.33 1.25-.4 1.56-.12.5-.54 1.25 1.09.68 1.63-.57 4.4-2.6 6-4.45 1.84-2 2.91-4.22 2.91-6.81z" />
            <text x="12" y="14" textAnchor="middle" fontSize="6.5" fontWeight="900" fill="currentColor" stroke="none" fontFamily="sans-serif">LINE</text>
          </svg>
        );

      case 'whatsapp':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" className={sizeConfig.svg}>
            <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm5.78 14.16c-.24.68-1.2 1.25-1.92 1.3-1.46.1-3.37-.62-5.48-2.73-2.11-2.11-2.83-4.02-2.73-5.48.05-.72.62-1.68 1.3-1.92.2-.07.44-.02.58.12l1.6 1.6c.14.14.17.36.08.54l-.62 1.24c-.09.18-.04.4.1.54 1.04 1.04 2.15 1.7 3.01 1.95.14.04.28 0 .37-.1l.95-.95c.18-.18.45-.2.68-.08l1.78.89c.23.12.33.38.28.63z" />
          </svg>
        );

      case 'youtube':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" className={sizeConfig.svg}>
            <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33zM9.75 15.02V8.48l5.75 3.27-5.75 3.27z" />
          </svg>
        );

      case 'spotify':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" className={sizeConfig.svg}>
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.58 14.42c-.18.3-.56.39-.86.21-2.36-1.44-5.33-1.76-8.83-.96-.34.08-.68-.14-.76-.48-.08-.34.14-.68.48-.76 3.82-.87 7.12-.51 9.76 1.13.3.18.39.56.21.86zm1.22-2.72c-.23.37-.72.49-1.09.26-2.7-1.66-6.82-2.14-10.02-1.17-.42.13-.86-.11-.99-.53-.13-.42.11-.86.53-.99 3.66-1.11 8.21-.57 11.31 1.34.37.23.49.72.26 1.09zm.12-2.84C14.68 8.97 9.35 8.79 6.27 9.72c-.49.15-1.02-.13-1.17-.62-.15-.49.13-1.02.62-1.17 3.55-1.08 9.44-.86 13.2 1.37.44.26.59.83.33 1.27-.26.44-.83.59-1.33.29z" />
          </svg>
        );

      case 'google':
      case 'google+':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" className={sizeConfig.svg}>
            <path d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5zm0 14c-3 0-5.5-2.4-6.4-5.2L1.9 16.7C3.7 20.4 7.5 23 12 23c2.7 0 5.2-.9 7.1-2.6l-3.5-2.7C14.6 18.4 13.4 19 12 19zm9.9-7H12v4.5h5.7c-.8 2.2-2.7 3.8-5.7 3.8-3.4 0-6.2-2.8-6.2-6.3s2.8-6.3 6.2-6.3c1.5 0 2.9.5 4 1.4l3.2-3.2C17.3 3.3 14.8 2.5 12 2.5 6.8 2.5 2.5 6.8 2.5 12s4.3 9.5 9.5 9.5c5.5 0 9.1-3.9 9.1-9.3 0-.7-.1-1.4-.2-1.9v1.7z" />
          </svg>
        );

      case 'pinterest':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" className={sizeConfig.svg}>
            <path d="M12 2C6.48 2 2 6.48 2 12c0 4.24 2.65 7.86 6.4 9.3-.09-.78-.17-1.98.04-2.84.18-.78 1.2-5.08 1.2-5.08s-.31-.61-.31-1.52c0-1.42.82-2.49 1.85-2.49.87 0 1.29.66 1.29 1.45 0 .88-.56 2.19-.85 3.41-.24 1.02.51 1.85 1.52 1.85 1.82 0 3.22-1.92 3.22-4.69 0-2.45-1.76-4.16-4.28-4.16-2.91 0-4.62 2.18-4.62 4.44 0 .88.34 1.82.76 2.33.08.1.1.19.07.3-.08.33-.26 1.05-.29 1.2-.05.19-.15.23-.35.14-1.32-.61-2.15-2.54-2.15-4.09 0-3.33 2.42-6.39 6.98-6.39 3.66 0 6.51 2.61 6.51 6.1 0 3.64-2.29 6.57-5.48 6.57-1.07 0-2.08-.56-2.42-1.22l-.66 2.51c-.24.92-.88 2.07-1.31 2.78 1.03.32 2.12.49 3.25.49 5.52 0 10-4.48 10-10S17.52 2 12 2z" />
          </svg>
        );

      case 'linkedin':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" className={sizeConfig.svg}>
            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
          </svg>
        );

      case 'snapchat':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" className={sizeConfig.svg}>
            <path d="M12 3c-3.3 0-5 2.2-5 4.8 0 .8.2 2 .5 2.5-.5.2-1.4.6-1.5 1.1-.1.4.3.7.8.8.2 0 .4 0 .6-.1-.1.6-.5 1.3-1.6 1.5-.5.1-.8.5-.8.9s.4.7.9.8c1.3.2 2.2-.4 2.8-.8.6.6 1.7 1.3 3.3 1.3s2.7-.7 3.3-1.3c.6.4 1.5 1 2.8.8.5-.1.9-.4.9-.8s-.3-.8-.8-.9c-1.1-.2-1.5-.9-1.6-1.5.2.1.4.1.6.1.5-.1.9-.4.8-.8-.1-.5-1-.9-1.5-1.1.3-.5.5-1.7.5-2.5 0-2.6-1.7-4.8-5-4.8z" />
          </svg>
        );

      case 'skype':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" className={sizeConfig.svg}>
            <path d="M12 2C6.48 2 2 6.48 2 12c0 1.38.28 2.69.79 3.89-.37 1-.58 2.08-.58 3.21 0 5.03 4.07 9.1 9.1 9.1 1.13 0 2.21-.21 3.21-.58 1.2.51 2.51.79 3.89.79 5.52 0 10-4.48 10-10 0-1.38-.28-2.69-.79-3.89.37-1 .58-2.08.58-3.21 0-5.03-4.07-9.1-9.1-9.1-1.13 0-2.21.21-3.21.58C14.69 2.28 13.38 2 12 2zm3.8 14.54c-1.02 1.02-2.39 1.53-4.11 1.53-2.11 0-3.69-.72-4.73-2.16-.3-.42-.23-1.01.17-1.34.42-.33 1.02-.26 1.38.16.66.78 1.7 1.17 3.12 1.17 1.25 0 2.23-.35 2.92-1.04.54-.54.81-1.17.81-1.89 0-.66-.23-1.22-.68-1.67-.46-.45-1.22-.85-2.29-1.2l-1.3-.43c-1.37-.46-2.39-1.05-3.05-1.78-.66-.73-.99-1.62-.99-2.67 0-1.42.54-2.58 1.63-3.48C9.77 4.08 11.19 3.63 12.92 3.63c1.78 0 3.21.6 4.29 1.79.35.39.33.99-.05 1.36-.39.38-.99.36-1.37-.06-.72-.79-1.7-1.18-2.93-1.18-1.18 0-2.13.3-2.84.9-.53.45-.8 1.02-.8 1.71 0 .62.21 1.14.63 1.56.42.42 1.12.79 2.1 1.12l1.32.44c1.47.49 2.56 1.11 3.26 1.86.7.75 1.05 1.7 1.05 2.85 0 1.52-.59 2.77-1.78 3.76z" />
          </svg>
        );

      case 'messenger':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" className={sizeConfig.svg}>
            <path d="M12 2C6.48 2 2 6.03 2 11c0 2.87 1.49 5.43 3.82 7.04V22l3.74-2.05c.78.22 1.6.34 2.44.34 5.52 0 10-4.03 10-9s-4.48-9-10-9zm1.15 12.16-2.58-2.75-5.04 2.75 5.54-5.88 2.65 2.75 4.97-2.75-5.54 5.88z" />
          </svg>
        );

      case 'tiktok':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" className={sizeConfig.svg}>
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.88 2.89 2.89 0 0 1-2.89-2.88 2.89 2.89 0 0 1 2.89-2.89c.35 0 .68.07.98.2V9.45a6.37 6.37 0 0 0-.98-.08A6.34 6.34 0 0 0 3 15.71a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.71a8.21 8.21 0 0 0 4.91 1.43V6.69z" />
          </svg>
        );

      case 'behance':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" className={sizeConfig.svg}>
            <path d="M8.7 11.8c.8-.4 1.3-1.1 1.3-2 0-1.7-1.3-2.8-3.3-2.8H2v10h4.8c2.2 0 3.6-1.2 3.6-3.1 0-1-.6-1.8-1.7-2.1zM4.6 8.7h1.9c.9 0 1.5.5 1.5 1.2s-.6 1.2-1.5 1.2H4.6V8.7zm2.1 6.6H4.6v-2.7h2.1c1 0 1.7.6 1.7 1.3s-.7 1.4-1.7 1.4zm10.7-5.5h-4.3v1h4.3v-1zm-2.1 1.8c-2.4 0-4 1.6-4 4.1s1.6 4.1 4.1 4.1c1.8 0 3.1-.9 3.7-2.3h-2.1c-.3.6-.8.8-1.6.8-1.1 0-1.8-.7-1.9-1.8h5.8c.1-.3.1-.6.1-.9 0-2.3-1.6-4-4.1-4zm-1.8 3.1c.1-.9.8-1.6 1.8-1.6s1.6.7 1.8 1.6h-3.6z" />
          </svg>
        );

      case 'dribbble':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={sizeConfig.svg}>
            <circle cx="12" cy="12" r="10" />
            <path d="M19.13 5.09C15.22 9.14 10 10.44 2.25 10.94" />
            <path d="M21.75 12.84c-6.62-1.41-12.14 1-16.38 6.32" />
            <path d="M8.5 2.5c2.4 4.8 4.2 9.7 5.1 14.5" />
          </svg>
        );

      case 'github':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" className={sizeConfig.svg}>
            <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
          </svg>
        );

      case 'telegram':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" className={sizeConfig.svg}>
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.93-1.28 4.88-2.12 5.86-2.54 2.8-.1.2 3.37.83 3.37.83z" />
          </svg>
        );

      case 'email':
      case 'mail':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={sizeConfig.svg}>
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
        );

      case 'website':
      case 'globe':
      default:
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={sizeConfig.svg}>
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
            <path d="M2 12h20" />
          </svg>
        );
    }
  };

  // Determine standard platform key
  let platformKey = norm;
  if (norm.includes('git')) platformKey = 'github';
  else if (norm.includes('link')) platformKey = 'linkedin';
  else if (norm.includes('insta')) platformKey = 'instagram';
  else if (norm.includes('face')) platformKey = 'facebook';
  else if (norm.includes('twit') || norm === 'x') platformKey = 'twitter';
  else if (norm.includes('what') || norm.includes('wa')) platformKey = 'whatsapp';
  else if (norm.includes('tube') || norm.includes('yt')) platformKey = 'youtube';
  else if (norm.includes('spot')) platformKey = 'spotify';
  else if (norm.includes('pin')) platformKey = 'pinterest';
  else if (norm.includes('snap')) platformKey = 'snapchat';
  else if (norm.includes('skype')) platformKey = 'skype';
  else if (norm.includes('mess')) platformKey = 'messenger';
  else if (norm.includes('tik')) platformKey = 'tiktok';
  else if (norm.includes('beh')) platformKey = 'behance';
  else if (norm.includes('drib')) platformKey = 'dribbble';
  else if (norm.includes('line')) platformKey = 'line';
  else if (norm.includes('tele')) platformKey = 'telegram';
  else if (norm.includes('mail') || norm.includes('email')) platformKey = 'email';
  else if (norm.includes('web') || norm.includes('glob') || norm.includes('site')) platformKey = 'website';

  // Styling based on the image's circular outline design with interactive hover enhancements
  let styleClasses = '';

  if (variant === 'brand-outline') {
    switch (platformKey) {
      case 'github':
        styleClasses = 'border-slate-800 dark:border-slate-400 text-slate-800 dark:text-slate-200 hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-950 hover:border-slate-900 dark:hover:border-white shadow-sm';
        break;
      case 'linkedin':
        styleClasses = 'border-[#0A66C2] text-[#0A66C2] hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2] shadow-sm hover:shadow-[#0A66C2]/20';
        break;
      case 'instagram':
        styleClasses = 'border-rose-500 text-rose-500 hover:bg-gradient-to-tr hover:from-amber-500 hover:via-rose-500 hover:to-purple-600 hover:text-white hover:border-rose-500 shadow-sm';
        break;
      case 'facebook':
        styleClasses = 'border-[#1877F2] text-[#1877F2] hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] shadow-sm hover:shadow-[#1877F2]/20';
        break;
      case 'twitter':
        styleClasses = 'border-sky-500 text-sky-500 hover:bg-sky-500 hover:text-white hover:border-sky-500 shadow-sm';
        break;
      case 'whatsapp':
        styleClasses = 'border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white hover:border-[#25D366] shadow-sm hover:shadow-[#25D366]/20';
        break;
      case 'youtube':
        styleClasses = 'border-[#FF0000] text-[#FF0000] hover:bg-[#FF0000] hover:text-white hover:border-[#FF0000] shadow-sm hover:shadow-[#FF0000]/20';
        break;
      case 'spotify':
        styleClasses = 'border-[#1DB954] text-[#1DB954] hover:bg-[#1DB954] hover:text-white hover:border-[#1DB954] shadow-sm';
        break;
      case 'pinterest':
        styleClasses = 'border-[#E60023] text-[#E60023] hover:bg-[#E60023] hover:text-white hover:border-[#E60023] shadow-sm';
        break;
      case 'email':
        styleClasses = 'border-[#EA4335] text-[#EA4335] hover:bg-[#EA4335] hover:text-white hover:border-[#EA4335] shadow-sm hover:shadow-[#EA4335]/20';
        break;
      case 'dribbble':
        styleClasses = 'border-[#EA4C89] text-[#EA4C89] hover:bg-[#EA4C89] hover:text-white hover:border-[#EA4C89] shadow-sm';
        break;
      case 'behance':
        styleClasses = 'border-[#0057FF] text-[#0057FF] hover:bg-[#0057FF] hover:text-white hover:border-[#0057FF] shadow-sm';
        break;
      default:
        styleClasses = 'border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 shadow-sm';
    }
  } else {
    // Pure outline style directly matching the EPS-10 circular vector design in the uploaded picture
    // Circular outline ring with centered glyph, smooth brand-colored hover fill & lift
    switch (platformKey) {
      case 'github':
        styleClasses = 'border-slate-800 dark:border-slate-400 text-slate-800 dark:text-slate-200 hover:bg-[#24292e] hover:text-white hover:border-[#24292e] dark:hover:border-slate-200';
        break;
      case 'linkedin':
        styleClasses = 'border-slate-800 dark:border-slate-400 text-slate-800 dark:text-slate-200 hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2]';
        break;
      case 'instagram':
        styleClasses = 'border-slate-800 dark:border-slate-400 text-slate-800 dark:text-slate-200 hover:bg-gradient-to-tr hover:from-amber-500 hover:via-rose-500 hover:to-purple-600 hover:text-white hover:border-rose-500';
        break;
      case 'facebook':
        styleClasses = 'border-slate-800 dark:border-slate-400 text-slate-800 dark:text-slate-200 hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2]';
        break;
      case 'twitter':
        styleClasses = 'border-slate-800 dark:border-slate-400 text-slate-800 dark:text-slate-200 hover:bg-black hover:text-white hover:border-black';
        break;
      case 'whatsapp':
        styleClasses = 'border-slate-800 dark:border-slate-400 text-slate-800 dark:text-slate-200 hover:bg-[#25D366] hover:text-white hover:border-[#25D366]';
        break;
      case 'youtube':
        styleClasses = 'border-slate-800 dark:border-slate-400 text-slate-800 dark:text-slate-200 hover:bg-[#FF0000] hover:text-white hover:border-[#FF0000]';
        break;
      case 'spotify':
        styleClasses = 'border-slate-800 dark:border-slate-400 text-slate-800 dark:text-slate-200 hover:bg-[#1DB954] hover:text-white hover:border-[#1DB954]';
        break;
      case 'pinterest':
        styleClasses = 'border-slate-800 dark:border-slate-400 text-slate-800 dark:text-slate-200 hover:bg-[#E60023] hover:text-white hover:border-[#E60023]';
        break;
      case 'email':
        styleClasses = 'border-slate-800 dark:border-slate-400 text-slate-800 dark:text-slate-200 hover:bg-[#EA4335] hover:text-white hover:border-[#EA4335]';
        break;
      case 'dribbble':
        styleClasses = 'border-slate-800 dark:border-slate-400 text-slate-800 dark:text-slate-200 hover:bg-[#EA4C89] hover:text-white hover:border-[#EA4C89]';
        break;
      case 'behance':
        styleClasses = 'border-slate-800 dark:border-slate-400 text-slate-800 dark:text-slate-200 hover:bg-[#0057FF] hover:text-white hover:border-[#0057FF]';
        break;
      case 'tiktok':
        styleClasses = 'border-slate-800 dark:border-slate-400 text-slate-800 dark:text-slate-200 hover:bg-slate-950 hover:text-white hover:border-slate-950';
        break;
      default:
        styleClasses = 'border-slate-800 dark:border-slate-400 text-slate-800 dark:text-slate-200 hover:bg-indigo-600 hover:text-white hover:border-indigo-600';
    }
  }

  const baseClasses = `rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer select-none ${sizeConfig.container} ${sizeConfig.stroke} ${styleClasses} ${className}`;

  if (url) {
    return (
      <a
        href={url}
        target={url.startsWith('mailto:') || url.startsWith('tel:') ? '_self' : '_blank'}
        rel="noopener noreferrer"
        className={baseClasses}
        title={title || platform}
        aria-label={title || platform}
      >
        {renderGlyph(platformKey)}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={baseClasses}
      title={title || platform}
      aria-label={title || platform}
    >
      {renderGlyph(platformKey)}
    </button>
  );
};
