import type { Profile } from '../types';

export const profile: Profile = {
  name: 'Manoj Khatri',
  title: 'Backend Software Engineer',
  tagline: 'Backend systems engineered for scale, security, and long-term reliability.',
  bio: [
    "I'm a Python/Django backend developer based in Kathmandu, Nepal, focused on building secure server-side systems that power real products. My work centers on Django REST Framework, PostgreSQL, JWT authentication, role-based access control, and payment gateway integrations like Khalti and eSewa.",
    "I've shipped REST APIs for marketplace platforms and data-driven apps, designing schemas, optimizing queries, and documenting endpoints for clean handoff. At Sajha Infotech, I cut average API response times by ~30% through query optimization on a student management system.",
    "I hold a BIT from Tribhuvan University (2025) and completed CS50's Web Programming with Python and JavaScript. Currently deepening Celery, Docker, and API architecture for larger systems.",
  ],
  photo: '/images/manoj.jpg',
  location: 'Kathmandu, Nepal',
  email: 'manojkc1dev@gmail.com',
  availability: 'Open to remote freelance & junior backend roles',
  resumeUrl: '/resume.pdf',
  stats: [
    {
      id: 'projects',
      label: 'Production Projects',
      value: '3+',
      subtext: 'Django, DRF & PostgreSQL',
      iconName: 'Code2',
    },
    {
      id: 'speedup',
      label: 'Avg. API Speedup',
      value: '30%',
      subtext: 'Query & DB optimization',
      iconName: 'Activity',
    },
    {
      id: 'records',
      label: 'Records Handled',
      value: '10K+',
      subtext: 'PostgreSQL data pipelines',
      iconName: 'Clock',
    },
    {
      id: 'education',
      label: 'BIT Graduate',
      value: '2025',
      subtext: 'Tribhuvan University',
      iconName: 'Users',
    },
  ],
  socials: [
    {
      name: 'GitHub',
      url: 'https://github.com/manojkc1dev',
      icon: 'Github',
      handle: '@manojkc1dev',
    },
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com/in/manojkc1dev',
      icon: 'Linkedin',
      handle: '@manojkc1dev',
    },
    {
      name: 'X (Twitter)',
      url: 'https://twitter.com/manojkc1dev',
      icon: 'Twitter',
      handle: '@manojkc1dev',
    },
    {
      name: 'Instagram',
      url: 'https://instagram.com/manojkc1dev',
      icon: 'Instagram',
      handle: '@manojkc1dev',
    },
    {
      name: 'Facebook',
      url: 'https://facebook.com/manojkc1dev',
      icon: 'Facebook',
      handle: '@manojkc1dev',
    },
    {
      name: 'TikTok',
      url: 'https://tiktok.com/@manojkc1dev',
      icon: 'Music2',
      handle: '@manojkc1dev',
    },
  ],
};
