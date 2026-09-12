export interface Project {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  image: string;
  githubUrl: string;
  liveUrl?: string;
  featured: boolean;
  applicationCategory: string;
  operatingSystem: string;
}

export interface SocialLink {
  platform: 'GitHub' | 'LinkedIn' | 'Email' | 'WhatsApp';
  url: string;
  display: string;
}

export interface SkillCategory {
  category: string;
  skills: string[];
}

export interface StatItem {
  value: string;
  label: string;
}

export const OWNER_PROFILE = {
  name: 'Manoj K.C.',
  title: 'Python–Django Backend Developer',
  headline: 'Manoj K.C. | Python and Django Backend Developer',
  subHeadline: 'Available for On-site & Remote Backend Roles',
  heroIntro:
    'I build reliable backend systems with REST APIs, database schemas, and secure authentication flows. I focus on writing clean, well-structured server-side code that is easy to maintain and built to scale.',
  location: 'Kathmandu, Nepal',
  addressCountry: 'NP',
  addressLocality: 'Kathmandu',
  timezone: 'UTC +5:45 (NPT)',
  email: 'manojkc1dev@gmail.com',
  phone: '+977-9809807760',
  domain: 'https://manojkc1.com.np',
  avatarImage: '/static/images/manoj-kc-python-backend-developer.jpg',
  qualification:
    'Bachelor of Information Technology (BIT), Mahendra Multiple Campus, Nepalgung, Banke, Nepal — Graduated 2025',
  alumniOf: {
    name: 'Mahendra Multiple Campus',
    department: 'Tribhuvan University',
    location: 'Nepalgunj, Banke, Nepal',
  },
  about:
    "BIT graduate from Nepal, building production-ready backend systems with Python, Django, and PostgreSQL. I specialize in Django REST Framework, designing REST APIs that are clean, versioned, well-documented, and built to scale from day one. My backend work covers the full server-side lifecycle: data modeling and schema design, Django ORM optimization, JWT authentication, and automated deployments. I've built systems handling real load — from dictionary engines ingesting 10,000+ word entries to secure calculation APIs.",
  pullQuote:
    'I care about code teammates can read, and APIs clients can integrate without a support call. Every endpoint I ship comes paired with Postman documentation and a strict README.',
  stats: [
    { value: '10+', label: 'Projects Built' },
    { value: 'REST API', label: 'Development' },
    { value: 'JWT', label: 'Authentication' },
    { value: 'Git', label: 'Version Control' },
  ] as StatItem[],
  techCategories: [
    {
      category: 'Languages',
      skills: ['Python', 'JavaScript', 'SQL', 'HTML/CSS'],
    },
    {
      category: 'Frameworks & Libraries',
      skills: ['Django', 'Django REST Framework', 'FastAPI'],
    },
    {
      category: 'Databases & Storage',
      skills: ['PostgreSQL', 'SQLite'],
    },
    {
      category: 'Tools, Auth & Architecture',
      skills: ['Git & GitHub', 'JWT Auth', 'REST APIs', 'VS Code'],
    },
  ] as SkillCategory[],
  skillsFlat: [
    'Python',
    'Django',
    'Django REST Framework',
    'DRF',
    'PostgreSQL',
    'REST APIs',
    'JWT Authentication',
    'FastAPI',
    'SQLite',
    'JavaScript',
    'SQL',
    'Git',
  ],
  socials: [
    {
      platform: 'GitHub',
      url: 'https://github.com/manojkc1',
      display: 'github.com/manojkc1',
    },
    {
      platform: 'LinkedIn',
      url: 'https://www.linkedin.com/in/manojkc1',
      display: 'linkedin.com/in/manojkc1',
    },
    {
      platform: 'Email',
      url: 'mailto:manojkc1dev@gmail.com',
      display: 'manojkc1dev@gmail.com',
    },
    {
      platform: 'WhatsApp',
      url: 'https://wa.me/9779809807760',
      display: '+977-9809807760',
    },
  ] as SocialLink[],
  featuredProjects: [
    {
      slug: 'calcpro-calculator',
      title: 'CalcPro Calculator',
      subtitle: 'Calculator project built with Python Django and React JS',
      description:
        'A responsive, multi-functional web calculator featuring Basic, Scientific, Programmer, and Financial modes. Built with a mobile-first design and safe mathematical evaluation.',
      tags: ['React', 'JavaScript', 'Vite', 'Math.js'],
      image: '/static/images/calcpro-django-rest-api-calculator.png',
      githubUrl: 'https://github.com/manojkc1/calcpro-calculator',
      liveUrl: 'https://calcpro.manojkc1.com.np',
      featured: true,
      applicationCategory: 'UtilityApplication',
      operatingSystem: 'Any',
    },
    {
      slug: 'shabdhabhandar-dictionary',
      title: 'Shabdhabhandar Dictionary',
      subtitle: 'Dictionary Built with Python Django',
      description:
        'A fast English-to-Nepali dictionary web app featuring custom fault-tolerant Unicode search logic, automated database ingestion, and session-based search history.',
      tags: ['Python', 'Django', 'JavaScript', 'SQLite'],
      image: '/static/images/shabdhabhandar-django-rest-api-calculator.png',
      githubUrl: 'https://github.com/manojkc1/shabdhabhandar-dictionary',
      liveUrl: 'https://shabdhabhandar.manojkc1.com.np',
      featured: true,
      applicationCategory: 'ReferenceApplication',
      operatingSystem: 'Any',
    },
  ] as Project[],
  navigation: [
    { label: 'Overview', href: '/' },
    { label: 'About', href: '/#about' },
    { label: 'Projects', href: '/#projects' },
    { label: 'Tech Stack', href: '/#tech-stack' },
    { label: 'Contact', href: '/#contact' },
  ],
  footerText:
    '© 2026 Manoj K.C. All rights reserved. Python & Django Backend Developer from Kathmandu, Nepal.',
} as const;

export const SEO_CONFIG = {
  metadataBase: 'https://manojkc1.com.np',
  titleDefault: 'Manoj K.C. | Python Django Backend Developer',
  titleTemplate: '%s | Manoj K.C.',
  description:
    'Manoj K.C. — Python & Django backend developer from Kathmandu, Nepal. Specializing in Django REST Framework, PostgreSQL, JWT auth, and scalable REST APIs. Available for on-site & remote roles.',
  keywords: [
    'Manoj K.C.',
    'Manoj KC Python developer',
    'Manoj KC Django developer',
    'Python Django developer Nepal',
    'Django REST Framework developer',
    'Python backend developer Kathmandu',
    'Hire Django developer Nepal',
    'REST API developer Nepal',
    'PostgreSQL developer Nepal',
    'JWT authentication Django',
  ],
  openGraphImage: '/static/images/manoj-kc-python-backend-developer.jpg',
  googleVerification: 'YOUR_GOOGLE_SEARCH_CONSOLE_CODE',
  canonical: 'https://manojkc1.com.np',
} as const;
