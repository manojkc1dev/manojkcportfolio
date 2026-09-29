import type { Experience, ExperienceType } from '../types';

export type { ExperienceType };

export const experiences: Experience[] = [
  {
    id: 'sajha-infotech',
    role: 'Backend Development Trainee',
    company: 'Sajha Infotech Pvt. Ltd.',
    companyUrl: 'https://github.com/manojkc1dev',
    period: 'Feb 2026 - Jul 2026',
    start: '2026-02',
    end: '2026-07',
    location: 'Kathmandu, Nepal (On-site)',
    type: 'internship',
    description: 'Developed and optimized production-grade REST APIs for core academic modules in an enterprise student management platform.',
    bullets: [
      'Completed hands-on training in Python, Django, and Django REST Framework, building REST API modules for a student management system covering attendance, grading, and user management.',
      'Wrote and optimized PostgreSQL queries, achieving ~30% reduction in average API response time under load.',
      'Collaborated with trainees and mentors via GitHub pull requests and code reviews; documented API endpoints via Postman collections for developer handoff.',
    ],
    tech: ['Python', 'Django', 'Django REST Framework', 'PostgreSQL', 'Postman', 'Git', 'GitHub'],
  },
  {
    id: 'freelance-backend',
    role: 'Freelance Backend Engineer',
    company: 'Client & Independent Projects',
    companyUrl: 'https://github.com/manojkc1dev',
    period: 'Aug 2025 - Jan 2026',
    start: '2025-08',
    end: '2026-01',
    location: 'Kathmandu, Nepal (Remote)',
    type: 'freelance',
    description: 'Delivered custom backend solutions, eSewa/Khalti payment integration pipelines, and normalized PostgreSQL schemas for small businesses.',
    bullets: [
      'Integrated Khalti & eSewa payment verification workflows with cryptographic signature checks and atomic transaction updates.',
      'Designed third-normal-form relational databases and managed schema migrations for custom business management portals.',
      'Containerized Django services using Docker & Gunicorn with zero-downtime deployment pipelines.',
    ],
    tech: ['Python', 'Django', 'PostgreSQL', 'Khalti API', 'eSewa API', 'Docker', 'Redis'],
  },
  {
    id: 'tribhuvan-university',
    role: 'BIT Student & Solo Developer',
    company: 'Mahendra Multiple Campus, Nepalgunj (Tribhuvan University)',
    companyUrl: 'https://github.com/manojkc1dev',
    period: '2020 - 2025',
    start: '2020-11',
    end: '2025-10',
    location: 'Nepalgunj, Banke, Nepal',
    type: 'education',
    description: 'Undergraduate study in Information Technology combined with end-to-end solo software engineering of capstone production systems.',
    bullets: [
      'Completed Bachelor of Information Technology with coursework in Data Structures, DBMS, Web Technologies, Software Engineering, and OOP.',
      "Built 'AcadFlow' as final year project, a solo student management system with role-based auth, attendance/grade tracking, and server-side PDF export.",
    ],
    tech: ['Python', 'Django', 'PostgreSQL', 'HTML5', 'CSS3', 'ReportLab (PDF)', 'Git'],
  },
];

export const experience = experiences;

export const sortExperienceByStartDesc = (exps: Experience[]): Experience[] =>
  [...exps].sort((a, b) => {
    const aVal = a.start || '';
    const bVal = b.start || '';
    return bVal.localeCompare(aVal);
  });

