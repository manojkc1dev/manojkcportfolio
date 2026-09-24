import type { Project, ProjectCategory, ProjectStatus } from '../types';

export type { ProjectCategory, ProjectStatus };

export const projectCategories: ProjectCategory[] = ['backend', 'fullstack', 'tools', 'opensource'];

export const projects: Project[] = [
  {
    id: 'agritech',
    title: 'Agritech | Agriculture Marketplace Platform',
    tagline: 'Multi-vendor marketplace connecting farmers and buyers.',
    description: 'Role-based marketplace with JWT-secured APIs, KYC onboarding, live price negotiation, cart/order pipeline, and Khalti/eSewa payment integration.',
    category: 'backend',
    year: 2026,
    status: 'live',
    highlights: [
      'Role-based auth (farmer/buyer) with JWT + KYC onboarding',
      'Negotiation module with real-time inquiry pipeline & contact-sharing notifications',
      'Khalti & eSewa payment gateway integration',
      'Filterable, searchable product catalog via DRF DefaultRouter',
      'Docker-ready deployment (Gunicorn + WhiteNoise)',
    ],
    tech: ['Python', 'Django', 'DRF', 'PostgreSQL', 'React', 'Tailwind CSS', 'Docker'],
    links: {
      live: 'https://agritech-marketplace.onrender.com/',
      github: 'https://github.com/manojkc1dev/AgriTech_Marketplace',
    },
    featured: true,
    image: '/images/agritech.png',
  },
  {
    id: 'calcpro',
    title: 'CalcPro | Multi-Functional Web Calculator',
    tagline: 'Full-stack calculator with Basic, Scientific, Programmer & Financial modes.',
    description: 'DRF-backed expression evaluator with a mobile-first React UI deployed on Render.',
    category: 'fullstack',
    year: 2026,
    status: 'live',
    highlights: [
      'Safe mathematical expression evaluation via DRF REST API',
      'Basic, Scientific, Programmer & Financial calculator modes',
      'Mobile-first responsive UI built with Vite + React',
      'Zero-downtime deployment on Render',
    ],
    tech: ['Django REST Framework', 'React', 'Vite', 'JavaScript'],
    links: {
      live: 'https://calcpro-calculator.onrender.com/',
      github: 'https://github.com/manojkc1dev/calcpro-calculator/',
    },
    featured: true,
    image: '/images/calcpro.png',
  },
  {
    id: 'shabdhabhandar',
    title: 'Shabdhabhandar | English-to-Nepali Dictionary',
    tagline: 'Unicode-aware bilingual dictionary with 10,000+ entries.',
    description: "Fault-tolerant search engine with automated ingestion, session history, and a scheduled 'Word of the Day'.",
    category: 'backend',
    year: 2025,
    status: 'live',
    highlights: [
      'Fault-tolerant Unicode search across 10,000+ Nepali/English entries',
      'Automated dictionary ingestion pipeline',
      'Session-based search history',
      "Scheduler-driven 'Word of the Day' feature",
    ],
    tech: ['Python', 'Django', 'SQLite', 'JavaScript'],
    links: {
      live: 'https://sabdhabhandar.onrender.com/',
      github: 'https://github.com/manojkc1dev/sabdhabhandar/',
    },
    featured: true,
    image: '/images/shabdhabhandar.png',
  },
  {
    id: 'acadflow',
    title: 'AcadFlow | Student Management System (Final Year Project)',
    tagline: 'Solo-built student management system for BIT final year.',
    description: 'Role-based auth, attendance/grade tracking, and server-side PDF exports.',
    category: 'fullstack',
    year: 2025,
    status: 'live',
    highlights: [
      'Role-based authentication for students, teachers, and admin',
      'Attendance and grade tracking dashboards',
      'Server-side PDF report generation',
      'Solo-designed and shipped end-to-end',
    ],
    tech: ['Python', 'Django', 'PostgreSQL', 'ReportLab (PDF)', 'HTML5', 'CSS3'],
    links: {
      live: 'https://acadflow-sms.onrender.com/',
      github: 'https://github.com/manojkc1dev/AcadFlow_SMS',
    },
    featured: true,
    image: '/images/acadflow.png',
  },
  {
    id: 'auth-sentinel',
    title: 'AuthSentinel | Django JWT & RBAC Boilerplate',
    tagline: 'Production-ready authentication service with audit logging & token blacklisting.',
    description: 'A modular Django authentication microservice template featuring rotating JWTs, granular role-based permissions, rate limiting, and Redis token revocation.',
    category: 'tools',
    year: 2026,
    status: 'ongoing',
    highlights: [
      'Rotating JWT token architecture with Redis blacklisting',
      'Custom RBAC permission classes and policy decorators',
      'Audit logging middleware with request tracing',
      'Configured with Docker Compose & automated test suite',
    ],
    tech: ['Python', 'Django', 'Redis', 'Docker', 'PostgreSQL'],
    links: {
      github: 'https://github.com/manojkc1dev',
    },
    featured: true,
    image: '/images/agritech.png',
  },
  {
    id: 'nepal-geodata-api',
    title: 'Nepal GeoData | Administrative Boundaries API',
    tagline: 'High-performance open-source REST API for Nepal geographical data.',
    description: 'Open-source Django service delivering provinces, districts, and municipalities data with spatial query caching and GeoJSON output.',
    category: 'opensource',
    year: 2025,
    status: 'live',
    highlights: [
      'Nested JSON and GeoJSON outputs for 7 provinces and 77 districts',
      'In-memory caching delivering sub-15ms response times',
      'Comprehensive OpenAPI documentation and Swagger playground',
      'Community-driven open data repository',
    ],
    tech: ['Python', 'Django REST Framework', 'PostgreSQL', 'Docker'],
    links: {
      github: 'https://github.com/manojkc1dev',
    },
    featured: true,
    image: '/images/shabdhabhandar.png',
  },
  {
    id: 'paystream-gateway',
    title: 'PayStream | Unified Nepal Payment Hub (Khalti & eSewa)',
    tagline: 'Idempotent webhook-driven payment aggregation microservice.',
    description: 'Dedicated payment microservice handling signature verification, asynchronous transaction reconciliation, automatic retries, and HMAC validation for eSewa ePay and Khalti v2.',
    category: 'backend',
    year: 2026,
    status: 'live',
    highlights: [
      'Strict idempotent transaction handling preventing double-charge anomalies',
      'Dual integration: Khalti v2 REST verification & eSewa EPAY v2 HMAC-SHA256 signature validation',
      'Asynchronous webhook receiver with Celery task retry queue',
      'Prometheus latency metrics and Grafana transaction monitoring',
    ],
    tech: ['Python', 'Django REST Framework', 'Celery', 'Redis', 'PostgreSQL', 'Docker'],
    links: {
      github: 'https://github.com/manojkc1dev',
      live: 'https://agritech-marketplace.onrender.com/',
    },
    featured: true,
    image: '/images/calcpro.png',
  },
];

export const sortProjectsByYearDesc = (projs: Project[]): Project[] =>
  [...projs].sort((a, b) => (b.year ?? 0) - (a.year ?? 0));

