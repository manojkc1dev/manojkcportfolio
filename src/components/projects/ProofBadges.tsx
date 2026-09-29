import React from 'react';
import {
  ExternalLink,
  Github,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Rocket,
  Terminal,
  Box,
  Send,
} from 'lucide-react';
import type { ProofBadge } from '../../types';

interface ProofBadgesProps {
  proof?: ProofBadge[];
  className?: string;
  size?: 'sm' | 'md';
}

interface BadgeConfig {
  label: string;
  tooltip: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const BADGE_CONFIG: Record<ProofBadge, BadgeConfig> = {
  'live-demo': {
    label: 'Live Demo',
    tooltip: 'Production app deployed and accessible to the public',
    icon: ExternalLink,
    color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  },
  'public-repo': {
    label: 'Public Repo',
    tooltip: 'Open-source repository available on GitHub with commit history',
    icon: Github,
    color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
  },
  'readme': {
    label: 'README Docs',
    tooltip: 'Comprehensive setup, architecture, and deployment instructions',
    icon: FileText,
    color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  },
  'tests': {
    label: 'Automated Tests',
    tooltip: 'Unit & integration test suites validating backend logic',
    icon: ShieldCheck,
    color: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20',
  },
  'ci-passing': {
    label: 'CI Passing',
    tooltip: 'Automated CI build and lint verification pipeline passing green',
    icon: CheckCircle2,
    color: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
  },
  'deployed': {
    label: 'Deployed',
    tooltip: 'Live zero-downtime production deployment running on cloud infrastructure',
    icon: Rocket,
    color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
  },
  'api-docs': {
    label: 'API Docs',
    tooltip: 'OpenAPI / Swagger / DRF DefaultRouter API specification provided',
    icon: Terminal,
    color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  },
  'docker': {
    label: 'Dockerized',
    tooltip: 'Multi-stage Dockerfile and Docker Compose configuration included',
    icon: Box,
    color: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
  },
  'postman-collection': {
    label: 'Postman Collection',
    tooltip: 'Curated Postman / ThunderClient requests for rapid API testing',
    icon: Send,
    color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
  },
};

export const ProofBadges: React.FC<ProofBadgesProps> = ({
  proof,
  className = '',
  size = 'sm',
}) => {
  if (!proof || proof.length === 0) {
    return null;
  }

  const isSmall = size === 'sm';

  return (
    <div
      className={`flex flex-wrap items-center gap-1.5 ${className}`}
      aria-label="Proof and verification badges"
    >
      {proof.map((badgeKey) => {
        const config = BADGE_CONFIG[badgeKey];
        if (!config) return null;
        const Icon = config.icon;

        return (
          <div
            key={badgeKey}
            title={config.tooltip}
            className={`group relative inline-flex items-center gap-1 font-mono font-medium rounded-md border transition-all duration-150 hover:scale-105 cursor-help ${
              config.color
            } ${
              isSmall
                ? 'px-2 py-0.5 text-[10px] sm:text-[11px]'
                : 'px-2.5 py-1 text-xs sm:text-sm'
            }`}
          >
            <Icon className={isSmall ? 'w-3 h-3 shrink-0' : 'w-3.5 h-3.5 shrink-0'} />
            <span>{config.label}</span>
          </div>
        );
      })}
    </div>
  );
};
