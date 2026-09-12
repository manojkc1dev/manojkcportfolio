'use client';

import * as React from 'react';
import {
  Code2,
  Database,
  Layers,
  Wrench,
  Terminal,
  Cpu,
  Server,
  Shield,
  FileCode,
  Globe,
  GitBranch,
} from 'lucide-react';

interface SkillItem {
  name: string;
  category: 'language' | 'framework' | 'database' | 'tool';
  proficiency?: number;
  icon?: string;
}

const ALL_SKILLS: SkillItem[] = [
  { name: 'Python', category: 'language', proficiency: 5 },
  { name: 'Django', category: 'framework', proficiency: 5 },
  { name: 'Django REST Framework (DRF)', category: 'framework', proficiency: 5 },
  { name: 'PostgreSQL', category: 'database', proficiency: 5 },
  { name: 'REST APIs', category: 'framework', proficiency: 5 },
  { name: 'JWT Authentication', category: 'tool', proficiency: 5 },
  { name: 'Git & GitHub', category: 'tool', proficiency: 5 },
  { name: 'SQL', category: 'language', proficiency: 4 },
  { name: 'FastAPI', category: 'framework', proficiency: 4 },
  { name: 'SQLite', category: 'database', proficiency: 4 },
  { name: 'JavaScript', category: 'language', proficiency: 4 },
  { name: 'Docker (Foundations)', category: 'tool', proficiency: 3 },
  { name: 'Postman API Testing', category: 'tool', proficiency: 5 },
  { name: 'HTML5 & CSS3', category: 'language', proficiency: 4 },
  { name: 'Linux / Bash Scripting', category: 'tool', proficiency: 4 },
];

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'language', label: 'Languages' },
  { id: 'framework', label: 'Frameworks' },
  { id: 'database', label: 'Databases' },
  { id: 'tool', label: 'Tools' },
] as const;

export function TechStackFilter({ skills = ALL_SKILLS }: { skills?: SkillItem[] }) {
  const [activeCategory, setActiveCategory] = React.useState<string>('all');

  const filteredSkills = React.useMemo(() => {
    if (activeCategory === 'all') return skills;
    return skills.filter((s) => s.category.toLowerCase() === activeCategory);
  }, [activeCategory, skills]);

  const getSkillIcon = (category: string, name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('python')) return <Terminal className="w-4 h-4 text-primary" />;
    if (lower.includes('django') || lower.includes('drf')) return <Server className="w-4 h-4 text-accent" />;
    if (lower.includes('postgre') || lower.includes('sql')) return <Database className="w-4 h-4 text-primary" />;
    if (lower.includes('jwt') || lower.includes('auth')) return <Shield className="w-4 h-4 text-success" />;
    if (lower.includes('git')) return <GitBranch className="w-4 h-4 text-amber-500" />;
    if (category === 'language') return <Code2 className="w-4 h-4 text-primary" />;
    if (category === 'database') return <Database className="w-4 h-4 text-primary" />;
    if (category === 'framework') return <Layers className="w-4 h-4 text-accent" />;
    return <Wrench className="w-4 h-4 text-muted" />;
  };

  return (
    <div className="w-full">
      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
        {CATEGORIES.map((tab) => {
          const isActive = activeCategory === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveCategory(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'bg-surface border border-border text-muted hover:text-foreground hover:bg-surface-2'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
        {filteredSkills.map((skill) => (
          <div
            key={skill.name}
            className="p-3.5 rounded-xl bg-surface border border-border flex items-center gap-3 transition-all duration-200 hover:border-primary/50 hover:bg-surface-2 group"
          >
            <div className="p-2 rounded-lg bg-surface-2 border border-border group-hover:border-primary/30 transition-colors">
              {getSkillIcon(skill.category, skill.name)}
            </div>
            <div className="min-w-0">
              <span className="block text-xs font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                {skill.name}
              </span>
              <span className="text-[10px] uppercase font-mono text-muted capitalize">
                {skill.category}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
