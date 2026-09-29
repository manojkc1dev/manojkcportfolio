export type ResumeType = 'resume' | 'cv';
export type ResumeTheme = 'ats-classic' | 'ats-modern' | 'minimal';
export type ResumeLocale = 'en' | 'ne';
export type SectionType =
  | 'experience'
  | 'education'
  | 'skills'
  | 'projects'
  | 'certifications'
  | 'awards'
  | 'custom';

export interface ResumeHeader {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  linkedin?: string;
  github?: string;
  summary?: string;
  hiddenFields?: string[]; // e.g. ['phone', 'location', 'website', 'summary', 'linkedin', 'github']
}

export interface ResumeEntry {
  id: string;
  title: string;              // job title, degree, project name
  organization?: string;      // company, school
  location?: string;
  startDate?: string;         // "2026-02"
  endDate?: string;           // "2026-07" | "present"
  bullets: string[];          // ATS-friendly action-verb bullets
  tags?: string[];            // tech stack for skills matching
  links?: { label: string; url: string }[];
  visible: boolean;
  hiddenBullets?: number[];   // indices of bullets hidden from export
}

export interface ResumeSection {
  id: string;
  type: SectionType;
  title: string;
  visible: boolean;
  order: number;
  entries: ResumeEntry[];
}

export interface ResumeContent {
  header: ResumeHeader;
  sections: ResumeSection[];
}

export interface AtsIssue {
  severity: 'error' | 'warning' | 'info';
  section: string;            // "experience", "header", etc.
  entryId?: string;
  message: string;
  fixHint: string;
}

export interface AtsScoreBreakdown {
  contactCompleteness: number;      // 0-10
  sectionPresence: number;          // 0-15
  actionVerbs: number;              // 0-20
  quantifiedAchievements: number;   // 0-20
  keywordDensity: number;           // 0-15
  formattingSafety: number;         // 0-10
  lengthAppropriateness: number;    // 0-10
  total: number;                    // 0-100
}

export interface ResumeDocument {
  resumeId: string;
  ownerUid: string;                 // admin
  type: ResumeType;
  variant: string;                  // "backend-engineer", "fullstack", etc.
  isActive: boolean;
  isPublic: boolean;
  theme: ResumeTheme;
  locale: ResumeLocale;
  content: ResumeContent;
  atsScore: number;                 // 0-100, computed on save
  atsIssues: AtsIssue[];
  atsBreakdown?: AtsScoreBreakdown;
  targetRole?: string;
  createdAt: string;                // ISO timestamp
  updatedAt: string;                // ISO timestamp
  version: number;
}

export function generateId(prefix = 'id'): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`;
}

export function createDefaultResume(
  type: ResumeType = 'resume',
  variant = 'backend-engineer'
): ResumeDocument {
  const now = new Date().toISOString();
  const id = generateId(type);

  return {
    resumeId: id,
    ownerUid: 'admin-manoj-kc',
    type,
    variant,
    isActive: true,
    isPublic: true,
    theme: 'ats-classic',
    locale: 'en',
    atsScore: 92,
    atsIssues: [],
    targetRole: 'Backend Engineer',
    version: 1,
    createdAt: now,
    updatedAt: now,
    content: {
      header: {
        name: 'Manoj Khatri',
        title: 'Backend Software Engineer',
        email: 'manojkc1dev@gmail.com',
        phone: '+977-9800000000',
        location: 'Kathmandu, Nepal',
        website: 'https://manojkc1.com.np',
        linkedin: 'https://linkedin.com/in/manoj-khatri',
        github: 'https://github.com/manoj-khatri',
        summary:
          'Performance-driven Backend Software Engineer with 3+ years of expertise designing and deploying resilient RESTful APIs, distributed microservices, and asynchronous event architectures. Specialized in Python, Django REST Framework, PostgreSQL query optimization, Celery, and Redis caching. Proven record of reducing API latency by 42% and architecting systems serving 100K+ monthly active users with 99.9% uptime.',
      },
      sections: [
        {
          id: generateId('sec-exp'),
          type: 'experience',
          title: 'Experience',
          visible: true,
          order: 0,
          entries: [
            {
              id: generateId('entry-exp-1'),
              title: 'Backend Software Engineer',
              organization: 'LightCode Technologies',
              location: 'Kathmandu, Nepal',
              startDate: '2023-08',
              endDate: 'present',
              visible: true,
              tags: ['Python', 'Django', 'PostgreSQL', 'Redis', 'Celery', 'Docker'],
              bullets: [
                'Architected high-throughput Django REST API processing 2.4M requests monthly with 99.95% service uptime and sub-120ms p95 latency.',
                'Optimized complex PostgreSQL database queries and indexes, reducing p99 database query execution times by 44% across 18 core endpoints.',
                'Engineered asynchronous background job pipeline utilizing Celery, RabbitMQ, and Redis to process 50,000+ daily notifications and transactional invoices.',
                'Implemented automated CI/CD deployment pipelines with Docker and GitHub Actions, slashing release deployment cycle time from 45 minutes to 7 minutes.',
              ],
            },
            {
              id: generateId('entry-exp-2'),
              title: 'Junior Python Developer',
              organization: 'FinTech Solutions Nepal',
              location: 'Lalitpur, Nepal',
              startDate: '2022-01',
              endDate: '2023-07',
              visible: true,
              tags: ['Python', 'Django', 'FastAPI', 'PostgreSQL', 'Git'],
              bullets: [
                'Developed secure payment gateway integrations handling over $450,000 in monthly digital wallet transactions across eSewa and Khalti APIs.',
                'Refactored legacy REST endpoints into modular service layer architecture, improving test coverage from 41% to 88% using PyTest.',
                'Collaborated with frontend engineering teams to design OpenAPI/Swagger contracts and unified error payload standards.',
              ],
            },
          ],
        },
        {
          id: generateId('sec-skills'),
          type: 'skills',
          title: 'Technical Skills',
          visible: true,
          order: 1,
          entries: [
            {
              id: generateId('entry-skills-1'),
              title: 'Backend & Frameworks',
              organization: '',
              visible: true,
              bullets: [
                'Python, Django, Django REST Framework, FastAPI, Flask, Celery, Asynchronous Programming',
              ],
            },
            {
              id: generateId('entry-skills-2'),
              title: 'Databases & Caching',
              organization: '',
              visible: true,
              bullets: [
                'PostgreSQL, Redis, MySQL, SQLite, Database Indexing, Query Optimization, Transaction Isolation',
              ],
            },
            {
              id: generateId('entry-skills-3'),
              title: 'DevOps & Cloud Tools',
              organization: '',
              visible: true,
              bullets: [
                'Docker, Docker Compose, Git, GitHub Actions, Linux Server Administration, Nginx, Gunicorn, RESTful APIs, JWT Auth',
              ],
            },
          ],
        },
        {
          id: generateId('sec-proj'),
          type: 'projects',
          title: 'Key Projects',
          visible: true,
          order: 2,
          entries: [
            {
              id: generateId('entry-proj-1'),
              title: 'Enterprise Hospital Management System (HMS)',
              organization: 'Production Open Source',
              location: 'Kathmandu, Nepal',
              startDate: '2024-01',
              endDate: '2024-09',
              visible: true,
              tags: ['Django', 'PostgreSQL', 'Redis', 'Docker'],
              links: [{ label: 'GitHub', url: 'https://github.com/manoj-khatri/hospital-management-system' }],
              bullets: [
                'Engineered comprehensive clinical records API managing 12,000+ patient records with role-based access control (RBAC) and audit logging.',
                'Reduced appointment double-booking error rate to zero by enforcing distributed Redis locks during concurrent checkout workflows.',
              ],
            },
            {
              id: generateId('entry-proj-2'),
              title: 'High-Concurrency Real-Time Analytics Pipeline',
              organization: 'Independent Project',
              startDate: '2023-10',
              endDate: '2024-03',
              visible: true,
              tags: ['Python', 'FastAPI', 'Redis Streams', 'PostgreSQL'],
              links: [{ label: 'GitHub', url: 'https://github.com/manoj-khatri/stream-analytics' }],
              bullets: [
                'Engineered event ingestion microservice handling 4,500 events/second using FastAPI, Redis Streams, and PostgreSQL partitioned tables.',
              ],
            },
          ],
        },
        {
          id: generateId('sec-edu'),
          type: 'education',
          title: 'Education',
          visible: true,
          order: 3,
          entries: [
            {
              id: generateId('entry-edu-1'),
              title: 'Bachelor of Science in Computer Science & Information Technology (B.Sc. CSIT)',
              organization: 'Tribhuvan University',
              location: 'Kathmandu, Nepal',
              startDate: '2019-09',
              endDate: '2023-09',
              visible: true,
              bullets: [
                'Core Coursework: Data Structures & Algorithms, Database Management Systems, Distributed Systems, Software Engineering, Operating Systems.',
              ],
            },
          ],
        },
        {
          id: generateId('sec-cert'),
          type: 'certifications',
          title: 'Certifications',
          visible: true,
          order: 4,
          entries: [
            {
              id: generateId('entry-cert-1'),
              title: 'Python Certified Associate Programmer (PCAP)',
              organization: 'Python Institute',
              startDate: '2023-05',
              visible: true,
              bullets: ['Verified advanced proficiency in object-oriented programming, data structures, and standard library internals.'],
            },
          ],
        },
      ],
    },
  };
}
