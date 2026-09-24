import type { SkillGroup, SkillItem, SkillLevel } from '../types';

export type { SkillLevel, SkillItem as Skill, SkillGroup };

export const currentFocus: SkillItem[] = [
  { name: 'Celery', iconName: 'Zap', proficiency: 'Learning', level: 'learning', highlight: true, years: 1 },
  { name: 'Redis', iconName: 'HardDrive', proficiency: 'Learning', level: 'learning', highlight: true, years: 1 },
  { name: 'Docker Compose', iconName: 'Boxes', proficiency: 'Learning', level: 'learning', highlight: true, years: 1 },
  { name: 'LangChain / pgvector (RAG groundwork)', iconName: 'Sparkles', proficiency: 'Learning', level: 'learning', highlight: true, years: 1 },
  { name: 'DB indexing', iconName: 'Gauge', proficiency: 'Learning', level: 'learning', highlight: true, years: 2 },
];

export const skillGroups: SkillGroup[] = [
  {
    id: 'languages-frameworks',
    title: 'Languages & Frameworks',
    category: 'Languages & Frameworks',
    description: 'Core backend development frameworks, typing, and reactive interfaces.',
    skills: [
      { name: 'Python', iconName: 'Terminal', proficiency: 'Advanced', level: 'advanced', highlight: true, years: 4 },
      { name: 'Django', iconName: 'Server', proficiency: 'Advanced', level: 'advanced', highlight: true, years: 3 },
      { name: 'Django REST Framework', iconName: 'Cpu', proficiency: 'Advanced', level: 'advanced', highlight: true, years: 3 },
      { name: 'JavaScript (ES6+)', iconName: 'Code', proficiency: 'Intermediate', level: 'intermediate', highlight: false, years: 3 },
      { name: 'TypeScript', iconName: 'FileCode2', proficiency: 'Intermediate', level: 'intermediate', highlight: false, years: 2 },
      { name: 'React', iconName: 'Atom', proficiency: 'Intermediate', level: 'intermediate', highlight: false, years: 2 },
    ],
  },
  {
    id: 'databases',
    title: 'Databases & Persistence',
    category: 'Databases',
    description: 'Relational data persistence, schema design, and query optimization.',
    skills: [
      { name: 'PostgreSQL', iconName: 'Database', proficiency: 'Advanced', level: 'advanced', highlight: true, years: 3 },
      { name: 'MySQL', iconName: 'Database', proficiency: 'Intermediate', level: 'intermediate', highlight: false, years: 2 },
      { name: 'SQLite', iconName: 'DatabaseBackup', proficiency: 'Intermediate', level: 'intermediate', highlight: false, years: 3 },
      { name: 'Django ORM', iconName: 'Workflow', proficiency: 'Advanced', level: 'advanced', highlight: true, years: 3 },
      { name: 'Query Optimization', iconName: 'Gauge', proficiency: 'Advanced', level: 'advanced', highlight: true, years: 2 },
      { name: 'Schema Design', iconName: 'Layers', proficiency: 'Advanced', level: 'advanced', highlight: true, years: 3 },
      { name: 'Migrations', iconName: 'DatabaseBackup', proficiency: 'Advanced', level: 'advanced', highlight: true, years: 3 },
    ],
  },
  {
    id: 'auth-security',
    title: 'Auth & Security',
    category: 'Auth & Security',
    description: 'Stateless token issuance, role-based authorization, and resilient API safeguards.',
    skills: [
      { name: 'JWT', iconName: 'ShieldCheck', proficiency: 'Advanced', level: 'advanced', highlight: true, years: 3 },
      { name: 'RBAC', iconName: 'ShieldCheck', proficiency: 'Advanced', level: 'advanced', highlight: true, years: 3 },
      { name: 'Token-based Auth', iconName: 'ShieldCheck', proficiency: 'Advanced', level: 'advanced', highlight: true, years: 3 },
      { name: 'Secure-by-default API design', iconName: 'ShieldCheck', proficiency: 'Advanced', level: 'advanced', highlight: true, years: 3 },
    ],
  },
  {
    id: 'payments-integrations',
    title: 'Payments & Integrations',
    category: 'Payments & Integrations',
    description: 'Local Nepalese payment gateways, international payment APIs, and KYC flows.',
    skills: [
      { name: 'Khalti API', iconName: 'Layers', proficiency: 'Advanced', level: 'advanced', highlight: true, years: 2 },
      { name: 'eSewa API', iconName: 'Layers', proficiency: 'Advanced', level: 'advanced', highlight: true, years: 2 },
      { name: 'KYC Workflows', iconName: 'CheckCircle2', proficiency: 'Intermediate', level: 'intermediate', highlight: false, years: 1 },
      { name: 'Stripe (familiar)', iconName: 'CreditCard', proficiency: 'Learning', level: 'learning', highlight: false, years: 1 },
      { name: 'REST API integrations', iconName: 'Network', proficiency: 'Advanced', level: 'advanced', highlight: true, years: 3 },
    ],
  },
  {
    id: 'devops-tools',
    title: 'DevOps & Tooling',
    category: 'DevOps & Tools',
    description: 'Version control, containerization, WSGI servers, and cloud platform deployments.',
    skills: [
      { name: 'Git', iconName: 'GitBranch', proficiency: 'Advanced', level: 'advanced', highlight: true, years: 4 },
      { name: 'GitHub', iconName: 'GitMerge', proficiency: 'Advanced', level: 'advanced', highlight: true, years: 4 },
      { name: 'Docker', iconName: 'Container', proficiency: 'Intermediate', level: 'intermediate', highlight: true, years: 2 },
      { name: 'Gunicorn', iconName: 'Server', proficiency: 'Intermediate', level: 'intermediate', highlight: false, years: 2 },
      { name: 'WhiteNoise', iconName: 'Flame', proficiency: 'Intermediate', level: 'intermediate', highlight: false, years: 2 },
      { name: 'Render', iconName: 'Cloud', proficiency: 'Intermediate', level: 'intermediate', highlight: false, years: 2 },
      { name: 'Vercel', iconName: 'Cloud', proficiency: 'Intermediate', level: 'intermediate', highlight: false, years: 2 },
      { name: 'Postman', iconName: 'FileCode2', proficiency: 'Advanced', level: 'advanced', highlight: true, years: 3 },
      { name: 'Swagger/OpenAPI', iconName: 'FileCode2', proficiency: 'Advanced', level: 'advanced', highlight: true, years: 3 },
      { name: 'VS Code', iconName: 'Terminal', proficiency: 'Advanced', level: 'advanced', highlight: false, years: 4 },
    ],
  },
  {
    id: 'concepts-architecture',
    title: 'Architecture & Engineering Concepts',
    category: 'Architecture & Engineering Concepts',
    description: 'Foundational software engineering methodologies, architectural paradigms, and team standards.',
    skills: [
      { name: 'MVT', iconName: 'Workflow', proficiency: 'Advanced', level: 'advanced', highlight: true, years: 3 },
      { name: 'RESTful Principles', iconName: 'Network', proficiency: 'Advanced', level: 'advanced', highlight: true, years: 3 },
      { name: 'CRUD', iconName: 'Database', proficiency: 'Advanced', level: 'advanced', highlight: true, years: 4 },
      { name: 'OOP', iconName: 'Boxes', proficiency: 'Advanced', level: 'advanced', highlight: true, years: 4 },
      { name: 'SaaS MVP Patterns', iconName: 'Layers', proficiency: 'Intermediate', level: 'intermediate', highlight: false, years: 2 },
      { name: 'Feature Branching', iconName: 'GitBranch', proficiency: 'Intermediate', level: 'intermediate', highlight: false, years: 3 },
      { name: 'Code Review', iconName: 'CheckCircle2', proficiency: 'Intermediate', level: 'intermediate', highlight: false, years: 2 },
    ],
  },
  {
    id: 'frontend',
    title: 'Frontend (API-Integration Level)',
    category: 'Frontend (API-integration level)',
    description: 'Building and connecting semantic, responsive interfaces to backend endpoints.',
    skills: [
      { name: 'HTML5', iconName: 'Layout', proficiency: 'Intermediate', level: 'intermediate', highlight: false, years: 4 },
      { name: 'CSS3', iconName: 'Palette', proficiency: 'Intermediate', level: 'intermediate', highlight: false, years: 4 },
      { name: 'Tailwind CSS', iconName: 'Palette', proficiency: 'Intermediate', level: 'intermediate', highlight: false, years: 3 },
      { name: 'Vite', iconName: 'Flame', proficiency: 'Intermediate', level: 'intermediate', highlight: false, years: 2 },
    ],
  },
];

export const skills = skillGroups;

