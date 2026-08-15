import {
  HeroData,
  AboutData,
  TechStackItem,
  SkillItem,
  Project,
  BlogPost,
  Certification,
  Experience,
  Education,
  Service,
  Client,
  Testimonial,
  SocialLink,
  ResumeData,
  ContactMessage,
  NewsletterSubscriber,
  MediaFile,
  AuditLog,
  SiteAnalytics,
  SeoConfig,
  User,
} from '../types';

const manojPassportPhoto = '/avatar.jpg';

export const INITIAL_USER: User = {
  id: 'usr_001',
  name: 'MANOJ K.C.',
  email: 'contactmanojkhatri@gmail.com',
  role: 'Super Admin',
  avatar: manojPassportPhoto,
};

export const INITIAL_HERO: HeroData = {
  id: 'hero_001',
  name: 'MANOJ K.C.',
  title: 'Python & Django Backend Architect',
  subtitle: 'REST APIs • Microservices • PostgreSQL • JWT Auth & Enterprise RBAC • Payment Gateways (Khalti & eSewa)',
  description: 'Specialized in architecting high-throughput REST APIs, resilient relational database schemas, and secure transaction processing pipelines for enterprise software applications.',
  availabilityBadge: '🟢 Available for On-Site (Kathmandu) & Remote Backend Engineering Roles',
  location: 'Kathmandu, Nepal',
  profileImage: manojPassportPhoto,
  backgroundImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&auto=format&fit=crop&q=80',
  resumeUrl: '#resume',
  hireMeUrl: '#contact',
  githubUrl: 'https://github.com/manojkc1dev',
  linkedinUrl: 'https://linkedin.com/in/manojkc1dev',
  emailUrl: 'mailto:contactmanojkhatri@gmail.com',
  whatsappUrl: 'https://wa.me/9779809807760',
  typingTexts: [
    'Python & Django Backend Architect',
    'Django REST Framework (DRF) Specialist',
    'PostgreSQL Query & Schema Optimizer',
    'Enterprise JWT Auth & RBAC Security Engineer',
    'FinTech Payment Systems Integrator'
  ],
  status: 'Published',
  order: 1,
  updatedAt: new Date().toISOString(),
};

export const INITIAL_ABOUT: AboutData = {
  id: 'about_001',
  photo: manojPassportPhoto,
  bio: 'Senior Backend Engineer & Systems Architect proficient in Python, Django REST Framework, PostgreSQL, and cloud-native microservices. Specialized in engineering high-concurrency API backends, automated payment processing workflows, and multi-tenant security layers.',
  longDescription: `Targeting backend engineering and software architecture roles where high throughput, deterministic data pipelines, and clean maintainable code are essential. Graduated with a Bachelor of Information Technology (BIT) from Mahendra Multiple Campus, Nepal.

Proven expertise in designing enterprise-grade Role-Based Access Control (RBAC), stateless JWT authentication protocols, transactional order processing pipelines, and integrating FinTech payment APIs (Khalti & eSewa) with idempotent webhooks and audit logging.`,
  mission: 'To engineer resilient, scalable, and fault-tolerant backend architectures using Python, Django, and PostgreSQL that power high-availability enterprise applications.',
  vision: 'Championing clean architecture standards, domain-driven API design, query execution optimization, and seamless developer handoff through OpenAPI specification standards.',
  yearsExperience: 2,
  projectsCompleted: 8,
  quote: 'Clean architecture, deterministic automated testing, and standardized REST APIs form the bedrock of scalable enterprise platforms.',
  highlights: [
    'Architected Agritech Marketplace API with JWT auth, multi-tenant RBAC, and automated Khalti/eSewa webhooks',
    'Engineered PostgreSQL database query optimizations achieving ~30% latency reduction under peak concurrent load',
    'Designed Shabdhabhandar NLP & dictionary query service processing 10,000+ Unicode terms with automated async tasks',
    'Developed CalcPro enterprise computational REST API deployed with zero-downtime CI/CD automation pipelines',
    'Built modular multi-vendor marketplace backend supporting strict buyer/seller permission boundaries and audit trails'
  ],
  updatedAt: new Date().toISOString(),
};

export const INITIAL_TECH_STACK: TechStackItem[] = [
  {
    id: 'ts_01',
    name: 'Python',
    category: 'Language',
    iconName: 'Code2',
    color: '#3776AB',
    officialWebsite: 'https://www.python.org',
    skillLevel: 95,
    yearsOfExperience: 2,
    displayOrder: 1,
    showOnHomepage: true,
    featured: true,
    status: 'Active',
  },
  {
    id: 'ts_02',
    name: 'Django & DRF',
    category: 'Framework',
    iconName: 'Layers',
    color: '#092E20',
    officialWebsite: 'https://www.djangoproject.com',
    skillLevel: 95,
    yearsOfExperience: 2,
    displayOrder: 2,
    showOnHomepage: true,
    featured: true,
    status: 'Active',
  },
  {
    id: 'ts_03',
    name: 'PostgreSQL',
    category: 'Database',
    iconName: 'Database',
    color: '#4169E1',
    officialWebsite: 'https://www.postgresql.org',
    skillLevel: 92,
    yearsOfExperience: 2,
    displayOrder: 3,
    showOnHomepage: true,
    featured: true,
    status: 'Active',
  },
  {
    id: 'ts_04',
    name: 'JWT Auth & RBAC',
    category: 'Security',
    iconName: 'ShieldCheck',
    color: '#10B981',
    officialWebsite: 'https://jwt.io',
    skillLevel: 94,
    yearsOfExperience: 2,
    displayOrder: 4,
    showOnHomepage: true,
    featured: true,
    status: 'Active',
  },
  {
    id: 'ts_05',
    name: 'Khalti & eSewa APIs',
    category: 'Payments',
    iconName: 'Zap',
    color: '#8B5CF6',
    officialWebsite: 'https://khalti.com',
    skillLevel: 92,
    yearsOfExperience: 1,
    displayOrder: 5,
    showOnHomepage: true,
    featured: true,
    status: 'Active',
  },
  {
    id: 'ts_06',
    name: 'Docker & Gunicorn',
    category: 'DevOps',
    iconName: 'Container',
    color: '#2496ED',
    officialWebsite: 'https://www.docker.com',
    skillLevel: 88,
    yearsOfExperience: 1,
    displayOrder: 6,
    showOnHomepage: true,
    featured: true,
    status: 'Active',
  },
  {
    id: 'ts_07',
    name: 'HTML5 & CSS3',
    category: 'Frontend',
    iconName: 'Code',
    color: '#E34F26',
    officialWebsite: 'https://developer.mozilla.org/en-US/docs/Web/HTML',
    skillLevel: 90,
    yearsOfExperience: 2,
    displayOrder: 7,
    showOnHomepage: true,
    featured: true,
    status: 'Active',
  },
  {
    id: 'ts_08',
    name: 'JavaScript (In Progress)',
    category: 'Language',
    iconName: 'Code2',
    color: '#F7DF1E',
    officialWebsite: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
    skillLevel: 75,
    yearsOfExperience: 1,
    displayOrder: 8,
    showOnHomepage: true,
    featured: false,
    status: 'Active',
  },
  {
    id: 'ts_09',
    name: 'TypeScript (In Progress)',
    category: 'Language',
    iconName: 'Code2',
    color: '#3178C6',
    officialWebsite: 'https://www.typescriptlang.org',
    skillLevel: 70,
    yearsOfExperience: 1,
    displayOrder: 9,
    showOnHomepage: true,
    featured: false,
    status: 'Active',
  },
  {
    id: 'ts_10',
    name: 'React.js (In Progress)',
    category: 'Framework',
    iconName: 'Sparkles',
    color: '#61DAFB',
    officialWebsite: 'https://react.dev',
    skillLevel: 78,
    yearsOfExperience: 1,
    displayOrder: 10,
    showOnHomepage: true,
    featured: false,
    status: 'Active',
  },
  {
    id: 'ts_11',
    name: 'Tailwind CSS',
    category: 'Frontend',
    iconName: 'Code',
    color: '#38BDF8',
    officialWebsite: 'https://tailwindcss.com',
    skillLevel: 88,
    yearsOfExperience: 2,
    displayOrder: 11,
    showOnHomepage: true,
    featured: false,
    status: 'Active',
  }
];

export const INITIAL_SKILLS: SkillItem[] = [
  { id: 'sk_1', name: 'Python, Django & Django REST Framework (DRF)', category: 'Backend', percentage: 95, yearsExperience: 2, iconName: 'Layers', priority: 1, featured: true },
  { id: 'sk_2', name: 'PostgreSQL, Query Optimization & Schema Design', category: 'Database', percentage: 92, yearsExperience: 2, iconName: 'Database', priority: 2, featured: true },
  { id: 'sk_3', name: 'JWT Authentication & Role-Based Access Control (RBAC)', category: 'Security', percentage: 94, yearsExperience: 2, iconName: 'ShieldCheck', priority: 3, featured: true },
  { id: 'sk_4', name: 'Payment Integrations (Khalti API, eSewa API, KYC)', category: 'Payments', percentage: 92, yearsExperience: 1, iconName: 'Zap', priority: 4, featured: true },
  { id: 'sk_5', name: 'HTML5, CSS3 & Tailwind CSS', category: 'Frontend', percentage: 90, yearsExperience: 2, iconName: 'Code', priority: 5, featured: true },
  { id: 'sk_6', name: 'JavaScript, TypeScript & React.js (In Progress)', category: 'Frontend', percentage: 75, yearsExperience: 1, iconName: 'Sparkles', priority: 6, featured: true },
  { id: 'sk_7', name: 'Docker, Gunicorn, WhiteNoise & Deployments', category: 'DevOps', percentage: 88, yearsExperience: 1, iconName: 'Terminal', priority: 7, featured: false },
  { id: 'sk_8', name: 'RESTful Principles, Postman API Docs & Feature Branching', category: 'Concepts', percentage: 94, yearsExperience: 2, iconName: 'Code', priority: 8, featured: false },
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj_001',
    title: 'Agritech | Agriculture Marketplace Platform',
    slug: 'agritech-agriculture-marketplace-platform',
    category: 'Marketplace / FinTech',
    thumbnail: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1600&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1592417817098-8f3d6ef23a6f?w=1200&auto=format&fit=crop&q=80'
    ],
    description: 'A comprehensive agriculture marketplace platform architected with Django REST Framework, PostgreSQL, and React.js. Features role-based auth for farmers and buyers, price negotiation modules, and Khalti & eSewa payment gateway integrations.',
    problem: 'Farmers in Nepal lacked direct digital access to buyers, leading to middleman price cuts and inefficient trade negotiation.',
    solution: 'Built a multi-tier REST API platform distinguishing farmer and buyer permissions with JWT access, real-time negotiation channels, KYC verification workflows, and seamless digital payments.',
    architectureNodes: [
      { id: 'n1', label: 'React + Tailwind Frontend', tech: 'React.js + Vite', type: 'client' },
      { id: 'n2', label: 'Django REST API Gateway', tech: 'Gunicorn + DRF DefaultRouter', type: 'api' },
      { id: 'n3', label: 'JWT Auth & RBAC Security', tech: 'SimpleJWT + KYC Logic', type: 'cache' },
      { id: 'n4', label: 'PostgreSQL Relational DB', tech: 'PostgreSQL 16 + Django ORM', type: 'db' },
      { id: 'n5', label: 'Khalti & eSewa Payment Engine', tech: 'Khalti API + eSewa API', type: 'worker' }
    ],
    architectureDescription: 'Built using Django MVT & REST Framework patterns. Requests pass through custom JWT authentication middleware, DRF DefaultRouter, and optimized PostgreSQL query filters with Gunicorn and WhiteNoise handling static assets.',
    features: [
      'Role-based authentication & authorization distinguishing farmer and buyer permissions',
      'JWT-secured API access and KYC verification workflows for user onboarding',
      'Cart, order, and price negotiation modules enabling buyers to negotiate directly with farmers',
      'Integrated Khalti and eSewa payment gateways supporting secure digital transactions',
      'Searchable and filterable product catalog by agricultural categories',
      'Docker-ready deployment using Gunicorn WSGI server and WhiteNoise static asset handling'
    ],
    challenges: [
      'Ensuring real-time state synchronization during price negotiation between farmer and buyer',
      'Handling payment callbacks and webhooks safely across Khalti & eSewa environments'
    ],
    futureImprovements: [
      'Implement real-time WebSocket notifications for instant price counter-offers',
      'Add multi-language support (Nepali and English UI toggle)'
    ],
    role: 'Backend & Full-Stack Developer',
    client: 'Nepal Agriculture Tech',
    company: 'Personal / Open Source',
    duration: 'In Progress (2026)',
    teamSize: 1,
    responsibilities: [
      'Architected role-based JWT authentication and authorization logic',
      'Built cart, order, negotiation pipelines and DRF REST endpoints',
      'Integrated Khalti and eSewa payment APIs'
    ],
    techStack: ['Python', 'Django', 'Django REST Framework (DRF)', 'PostgreSQL', 'React.js', 'Tailwind CSS', 'Docker & Gunicorn'],
    programmingLanguages: ['Python 3.12', 'JavaScript (ES6+)', 'SQL', 'HTML5/CSS3'],
    frameworks: ['Django 5.0', 'Django REST Framework', 'React.js'],
    databases: ['PostgreSQL 16'],
    apis: ['Khalti API', 'eSewa API', 'DRF REST API'],
    authentication: 'JWT (SimpleJWT with RBAC Permissions)',
    deployment: 'Docker, Gunicorn, WhiteNoise, Render',
    githubUrl: 'https://github.com/manojkc1dev',
    liveDemoUrl: 'https://manojkc1.com.np',
    documentationUrl: 'https://github.com/manojkc1dev',
    caseStudyUrl: 'https://github.com/manojkc1dev',
    status: 'Published',
    isPrivate: false,
    featured: true,
    pinned: true,
    order: 1,
    viewsCount: 3400,
    likesCount: 290,
    sharesCount: 110,
    seoTitle: 'Agritech Agriculture Marketplace Platform - MANOJ K.C.',
    seoDescription: 'Django REST Framework & PostgreSQL agriculture marketplace with Khalti & eSewa digital payment integrations.',
    createdAt: '2026-03-01T10:00:00Z',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'proj_002',
    title: 'Shabdhabhandar | English-to-Nepali Dictionary Web App',
    slug: 'shabdhabhandar-english-to-nepali-dictionary-web-app',
    category: 'Web Application',
    thumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1600&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=1200&auto=format&fit=crop&q=80'
    ],
    description: 'A fault-tolerant Unicode English-to-Nepali dictionary web application built with Django, SQLite, and automated ingestion of 10,000+ dictionary word entries.',
    problem: 'Users required a fast, offline-capable, and fault-tolerant English to Nepali dictionary search engine supporting Unicode text and daily vocabulary practice.',
    solution: 'Engineered an optimized Unicode search engine with automated database ingestion of 10,000+ entries, session-based search history tracking, and automated Word of the Day scheduling.',
    architectureNodes: [
      { id: 'm1', label: 'Django Templates + JavaScript UI', tech: 'HTML5 + JS + Tailwind', type: 'client' },
      { id: 'm2', label: 'Unicode Search Engine Controller', tech: 'Django Views & Queries', type: 'api' },
      { id: 'm3', label: '10,000+ Words Ingestion DB', tech: 'SQLite3 + Ingestion Script', type: 'db' },
      { id: 'm4', label: 'Word of the Day Scheduler', tech: 'Django Background Tasks', type: 'worker' }
    ],
    features: [
      'Fault-tolerant Unicode search engine supporting instant keyword lookup',
      'Automated database ingestion script processing 10,000+ dictionary entries',
      'Session-based search history enabling quick vocabulary recap',
      'Word of the Day feature powered by Django background scheduler'
    ],
    challenges: [
      'Handling Devanagari Unicode string normalization and efficient substring matching'
    ],
    futureImprovements: [
      'Add audio pronunciation synthesis for English and Nepali terms'
    ],
    role: 'Full-Stack Developer',
    client: 'Open Source',
    company: 'Personal Project',
    duration: '2 Months',
    teamSize: 1,
    responsibilities: [
      'Wrote database ingestion scripts for 10,000+ dictionary words',
      'Implemented Django Unicode search engine and history session logic'
    ],
    techStack: ['Python', 'Django', 'SQLite', 'JavaScript', 'Tailwind CSS'],
    programmingLanguages: ['Python', 'JavaScript', 'HTML5/CSS3'],
    frameworks: ['Django'],
    databases: ['SQLite3'],
    apis: ['Django Internal API'],
    authentication: 'Session-based',
    deployment: 'Render / Vercel',
    githubUrl: 'https://github.com/manojkc1dev',
    liveDemoUrl: 'https://manojkc1.com.np',
    status: 'Published',
    isPrivate: false,
    featured: true,
    pinned: false,
    order: 2,
    viewsCount: 2800,
    likesCount: 210,
    sharesCount: 75,
    seoTitle: 'Shabdhabhandar English-to-Nepali Dictionary - MANOJ K.C.',
    seoDescription: 'Unicode dictionary web app with 10,000+ words and Word of the Day scheduler using Django.',
    createdAt: '2026-02-15T09:00:00Z',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'proj_003',
    title: 'CalcPro | Multi-Functional Web Calculator',
    slug: 'calcpro-multi-functional-web-calculator',
    category: 'Full-Stack Utility',
    thumbnail: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1600&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1587145820266-a5951ee6f620?w=1200&auto=format&fit=crop&q=80'
    ],
    description: 'Full-stack calculator supporting Basic, Scientific, Programmer, and Financial modes backed by a DRF REST API with safe mathematical expression evaluation.',
    problem: 'Standard browser calculators lack server-side safe expression evaluation and financial calculation API backing.',
    solution: 'Built a clean mobile-first React + Vite frontend communicating with a Django REST Framework API for complex formula parsing and zero-downtime deployment on Render.',
    features: [
      'Basic, Scientific, Programmer, and Financial modes',
      'DRF REST API backing for safe mathematical expression evaluation',
      'Mobile-first responsive UI built with Vite tooling',
      'Deployed to Render with zero-downtime configuration'
    ],
    challenges: [
      'Safely evaluating user mathematical expressions without arbitrary code execution risks'
    ],
    futureImprovements: [
      'Add currency and unit conversion REST API endpoints'
    ],
    role: 'Full-Stack Developer',
    client: 'Personal Project',
    company: 'Open Source',
    duration: '1 Month',
    teamSize: 1,
    responsibilities: [
      'Built DRF calculation API and mathematical evaluation engine',
      'Designed mobile-first React UI'
    ],
    techStack: ['Django REST Framework', 'JavaScript', 'React.js', 'Vite', 'Tailwind CSS'],
    programmingLanguages: ['Python', 'JavaScript (ES6+)'],
    frameworks: ['Django REST Framework', 'React.js'],
    databases: ['SQLite3'],
    apis: ['DRF REST API'],
    authentication: 'None (Public Utility)',
    deployment: 'Render',
    githubUrl: 'https://github.com/manojkc1dev',
    liveDemoUrl: 'https://manojkc1.com.np',
    status: 'Published',
    isPrivate: false,
    featured: true,
    pinned: false,
    order: 3,
    viewsCount: 1900,
    likesCount: 145,
    sharesCount: 40,
    seoTitle: 'CalcPro Multi-Functional Calculator App - MANOJ K.C.',
    seoDescription: 'Full-stack calculator application backed by DRF REST API and React.',
    createdAt: '2026-01-20T14:00:00Z',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'proj_004',
    title: 'Marketplace App | Multi-Vendor Marketplace API',
    slug: 'marketplace-app-multi-vendor-marketplace-api',
    category: 'Multi-Vendor API',
    thumbnail: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1600&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1556742049-0a670fc8078a?w=1200&auto=format&fit=crop&q=80'
    ],
    description: 'Modular multi-vendor marketplace backend with buyer, seller, and admin roles, custom app slicing, and environment-driven security configuration using Django and MySQL.',
    problem: 'Multi-vendor platforms require clean app slicing to keep buyer storefronts, seller inventory management, and admin oversight decoupled.',
    solution: 'Designed a production-ready Django API with RBAC roles, user-to-user messaging, product catalog discount logic, and environment-based security settings.',
    features: [
      'Buyer, seller, and admin role-based authorization',
      'Custom app slicing separating core domains',
      'Contextual user-to-user messaging system',
      'Product listings with dynamic discount calculations'
    ],
    challenges: [
      'Managing seller payout calculations and product discount validation'
    ],
    futureImprovements: [
      'Integrate automated payout API webhooks'
    ],
    role: 'Backend Developer',
    client: 'Personal Project',
    company: 'Open Source',
    duration: '2 Months',
    teamSize: 1,
    responsibilities: [
      'Designed MySQL database schemas and Django models',
      'Implemented buyer, seller, and admin API endpoints'
    ],
    techStack: ['Python', 'Django', 'MySQL', 'REST API'],
    programmingLanguages: ['Python 3.12', 'SQL'],
    frameworks: ['Django'],
    databases: ['MySQL'],
    apis: ['REST API'],
    authentication: 'Session & Token Auth',
    deployment: 'PythonAnywhere / Render',
    githubUrl: 'https://github.com/manojkc1dev',
    liveDemoUrl: 'https://manojkc1.com.np',
    status: 'Published',
    isPrivate: false,
    featured: true,
    pinned: false,
    order: 4,
    viewsCount: 2100,
    likesCount: 160,
    sharesCount: 50,
    seoTitle: 'Multi-Vendor Marketplace Backend API - MANOJ K.C.',
    seoDescription: 'Production-ready Django & MySQL multi-vendor marketplace API with RBAC roles.',
    createdAt: '2025-12-10T11:00:00Z',
    updatedAt: new Date().toISOString(),
  }
];

export const INITIAL_BLOGS: BlogPost[] = [
  {
    id: 'blog_001',
    title: 'Building Production REST APIs with Django REST Framework & PostgreSQL',
    slug: 'building-production-rest-apis-drf-postgresql',
    category: 'Backend Engineering',
    excerpt: 'Key strategies for designing clean DRF serializers, optimizing PostgreSQL querysets, and securing endpoints with JWT auth and RBAC.',
    content: `# Building Production REST APIs with Django REST Framework

Django REST Framework (DRF) provides powerful abstractions for building RESTful APIs. When paired with PostgreSQL, careful queryset optimization and serializer design ensure low latencies.

## 1. Queryset Optimization with select_related & prefetch_related
Avoid N+1 queries by prefetching foreign key and many-to-many relationships in DRF views:

\`\`\`python
class ProductViewSet(viewsets.ModelViewSet):
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return Product.objects.select_related('category', 'seller')\\
                              .prefetch_related('images')\\
                              .filter(is_active=True)
\`\`\`

## 2. JWT Authentication & Custom Permission Classes
Role-Based Access Control (RBAC) ensures farmers, buyers, and admins have precise permissions:

\`\`\`python
class IsFarmerOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_authenticated and request.user.role == 'FARMER'
\`\`\`

## 3. Conclusion
Combining DRF's DefaultRouter with custom permissions and PostgreSQL query optimization delivers clean, maintainable backend services.`,
    tags: ['Django', 'DRF', 'Python', 'PostgreSQL', 'JWT', 'REST API'],
    readingTimeMinutes: 6,
    featuredImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80',
    status: 'Published',
    publishedAt: '2026-03-05T00:00:00Z',
    seoTitle: 'Production REST APIs with DRF & PostgreSQL - MANOJ K.C.',
    seoDescription: 'Guide to building scalable Django REST Framework APIs with query optimization and JWT auth.',
    viewsCount: 1450,
    likesCount: 120,
    authorName: 'MANOJ K.C.',
  }
];

export const INITIAL_CERTIFICATIONS: Certification[] = [
  {
    id: 'cert_01',
    title: "CS50's Web Programming with Python and JavaScript",
    issuer: 'Harvard University / edX',
    credentialId: 'CS50-WEB-2025',
    verificationUrl: 'https://edx.org',
    issueDate: '2025-06-15',
    logoUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=200&auto=format&fit=crop&q=80',
    status: 'Active',
  },
  {
    id: 'cert_02',
    title: 'Django REST Framework (DRF) Masterclass',
    issuer: 'Udemy / freeCodeCamp',
    credentialId: 'DRF-MASTERY-2025',
    verificationUrl: 'https://freecodecamp.org',
    issueDate: '2025-09-10',
    logoUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=200&auto=format&fit=crop&q=80',
    status: 'Active',
  },
  {
    id: 'cert_03',
    title: 'Git & GitHub for Developers',
    issuer: 'Self-Paced / Open Source',
    credentialId: 'GIT-GH-DEV-2026',
    verificationUrl: 'https://github.com/manojkc1dev',
    issueDate: '2026-01-10',
    logoUrl: 'https://images.unsplash.com/photo-1618401471353-b98aedd04e11?w=200&auto=format&fit=crop&q=80',
    status: 'Active',
  }
];

export const INITIAL_EXPERIENCES: Experience[] = [
  {
    id: 'exp_01',
    company: 'Sajha Infotech PVT. LTD.',
    position: 'Backend Development Trainee',
    employmentType: 'Full-Time',
    location: 'Kathmandu, Nepal',
    duration: 'Feb 2026 - Jul 2026',
    isCurrent: false,
    description: 'Completed hands-on training in Python, Django, and Django REST Framework, building REST API modules for a student management system covering attendance, grading, and user management.',
    technologiesUsed: ['Python', 'Django', 'Django REST Framework', 'PostgreSQL', 'Postman', 'Git / GitHub'],
    achievements: [
      'Wrote and optimized PostgreSQL queries as part of curriculum, achieving ~30% reduction in average API response time under load',
      'Collaborated with trainees and mentors through GitHub pull requests and code reviews, maintaining clean Git history',
      'Documented API endpoints via Postman collections for developer handoff workflows'
    ],
    order: 1,
  }
];

export const INITIAL_EDUCATIONS: Education[] = [
  {
    id: 'edu_01',
    institute: 'Mahendra Multiple Campus, Nepalgunj, Banke, Nepal',
    degree: 'Bachelor of Information Technology (BIT)',
    major: 'Information Technology & Software Engineering',
    duration: '2021 - 2025',
    cgpa: 'Graduated 2025',
    description: 'Relevant coursework: Data Structures, DBMS, Web Technologies, Software Engineering, OOP. Final Year Project: "AcadFlow" Student Management System built solo with role-based auth, attendance tracking, grade management, and server-side PDF export.',
  }
];

export const INITIAL_SERVICES: Service[] = [
  {
    id: 'srv_01',
    title: 'Python / Django REST API Development',
    description: 'Custom Django REST Framework (DRF) backend engineering, clean MVT architecture, JWT auth, RBAC permissions, and PostgreSQL database query optimization.',
    iconName: 'Server',
    features: ['Django REST Framework & Serializers', 'JWT Auth & Role Permissions (RBAC)', 'PostgreSQL Database & ORM Tuning', 'Clean API Documentation via Postman'],
    deliverables: ['Production Backend Codebase', 'Documented REST API Endpoints', 'Docker-Ready Deployment Setup', 'Database Migration Scripts'],
    startingPrice: 'Available for Hire'
  },
  {
    id: 'srv_02',
    title: 'Nepali Payment Gateway Integrations (Khalti & eSewa)',
    description: 'Integrating secure digital payment gateways (Khalti API and eSewa API) with KYC verification workflows into e-commerce, marketplace, and SaaS web apps.',
    iconName: 'Zap',
    features: ['Khalti Payment Gateway API', 'eSewa Payment Gateway API', 'Secure Callback & Webhook Verification', 'KYC Verification Pipelines'],
    deliverables: ['Payment Verification Endpoints', 'Transaction Status Logger', 'Integration Test Suite'],
    startingPrice: 'Custom Scope'
  },
  {
    id: 'srv_03',
    title: 'Full-Stack Web MVP Engineering',
    description: 'Building SaaS MVPs and custom marketplace platforms from ground up with Django REST backend, React.js / Tailwind CSS frontend, and Docker deployment.',
    iconName: 'Code2',
    features: ['End-to-End MVP Architecture', 'React.js + Tailwind CSS UI', 'Gunicorn + WhiteNoise CDN Handling', 'Deployment on Render / Vercel'],
    deliverables: ['Fully Functional Live Web App', 'GitHub Repository & CI Setup', 'Deployment Documentation'],
    startingPrice: 'Custom Scope'
  }
];

export const INITIAL_CLIENTS: Client[] = [
  { id: 'cli_01', name: 'Sajha Infotech PVT. LTD.', logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200&auto=format&fit=crop&q=80', website: 'https://manojkc1.com.np', industry: 'Software Training', review: 'Manoj demonstrated exceptional dedication in Django REST API optimization.' },
  { id: 'cli_02', name: 'Agritech Platform', logo: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=200&auto=format&fit=crop&q=80', website: 'https://manojkc1.com.np', industry: 'AgriTech Marketplace', review: 'Solid JWT auth and payment gateway integration.' }
];

export const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: 'test_01',
    clientName: 'Sajha Infotech Technical Mentor',
    designation: 'Lead Developer & Trainer',
    company: 'Sajha Infotech PVT. LTD.',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    review: 'Manoj is a disciplined backend developer. His ability to optimize PostgreSQL queries and structure clean Django REST endpoints was outstanding during the traineeship.',
    rating: 5,
    featured: true,
  }
];

export const INITIAL_SOCIALS: SocialLink[] = [
  { id: 'soc_01', platform: 'GitHub', url: 'https://github.com/manojkc1dev', iconName: 'Github', enabled: true },
  { id: 'soc_02', platform: 'LinkedIn', url: 'https://linkedin.com/in/manojkc1dev', iconName: 'Linkedin', enabled: true },
  { id: 'soc_03', platform: 'Email', url: 'mailto:contactmanojkhatri@gmail.com', iconName: 'Mail', enabled: true },
  { id: 'soc_04', platform: 'WhatsApp', url: 'https://wa.me/9779809807760', iconName: 'WhatsApp', enabled: true },
  { id: 'soc_05', platform: 'Website', url: 'https://manojkc1.com.np', iconName: 'Globe', enabled: false },
  { id: 'soc_06', platform: 'Instagram', url: 'https://instagram.com/manojkc1dev', iconName: 'Instagram', enabled: false },
  { id: 'soc_07', platform: 'Facebook', url: 'https://facebook.com/manojkc1dev', iconName: 'Facebook', enabled: false },
  { id: 'soc_08', platform: 'Twitter', url: 'https://twitter.com/manojkc1dev', iconName: 'Twitter', enabled: false },
  { id: 'soc_09', platform: 'YouTube', url: 'https://youtube.com/@manojkc1dev', iconName: 'Youtube', enabled: false },
  { id: 'soc_10', platform: 'Spotify', url: 'https://open.spotify.com/user/manojkc1dev', iconName: 'Spotify', enabled: false },
];

export const INITIAL_RESUME: ResumeData = {
  id: 'res_001',
  pdfUrl: '/media/resume/manoj_kc_backend_developer_resume.pdf',
  docxUrl: '/media/resume/manoj_kc_backend_developer_resume.docx',
  version: 'Manoj K.C. CV 2026',
  lastUpdated: '2026-08-01',
  downloadsCount: 197,
};

export const INITIAL_MESSAGES: ContactMessage[] = [
  {
    id: 'msg_001',
    name: 'Recruiter / Hiring Manager',
    email: 'hiring@techcorp.com',
    phone: '+977 9800000000',
    subject: 'Backend Engineering Opportunity (Django / DRF)',
    message: 'Hi Manoj, We reviewed your Agritech marketplace project and PostgreSQL query optimization achievements. We are looking for a Python/Django developer for our team in Kathmandu or Remote.',
    ip: '202.70.88.10',
    country: 'Nepal 🇳🇵',
    browser: 'Chrome 128 / macOS',
    device: 'Desktop',
    status: 'Unread',
    starred: true,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  }
];

export const INITIAL_NEWSLETTER: NewsletterSubscriber[] = [
  { id: 'nl_01', email: 'dev.recruiter@tech.np', subscribedAt: '2026-07-20T11:20:00Z', status: 'Active', source: 'Portfolio Footer' },
];

export const INITIAL_MEDIA_FILES: MediaFile[] = [
  { id: 'med_01', name: 'manoj_kc_passport.jpg', url: manojPassportPhoto, folder: 'avatars', fileType: 'image', sizeBytes: 245000, dimensions: '800x800', altText: 'MANOJ K.C. Passport Photo', uploadedAt: '2026-08-03T10:00:00Z' },
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  { id: 'aud_01', userEmail: 'manojkc1dev@gmail.com', userRole: 'Super Admin', action: 'LOGIN', module: 'JWT Auth', details: 'Successful Admin JWT Authentication', ipAddress: '127.0.0.1', timestamp: new Date(Date.now() - 3600000).toISOString() },
];

export const INITIAL_ANALYTICS: SiteAnalytics = {
  totalVisitors: 1240,
  pageViews: 4890,
  contactRequests: 18,
  resumeDownloads: 197,
  visitorCountries: [
    { country: 'Nepal', code: 'NP', count: 890 },
    { country: 'United States', code: 'US', count: 180 },
    { country: 'India', code: 'IN', count: 90 },
  ],
  deviceBreakdown: [
    { name: 'Desktop', count: 850 },
    { name: 'Mobile', count: 350 },
  ],
  viewsOverTime: [
    { date: 'Mon', views: 320, uniqueVisitors: 140 },
    { date: 'Tue', views: 410, uniqueVisitors: 190 },
    { date: 'Wed', views: 530, uniqueVisitors: 240 },
    { date: 'Thu', views: 480, uniqueVisitors: 210 },
    { date: 'Fri', views: 620, uniqueVisitors: 280 },
    { date: 'Sat', views: 390, uniqueVisitors: 160 },
    { date: 'Sun', views: 440, uniqueVisitors: 190 }
  ]
};

export const INITIAL_SEO: SeoConfig = {
  siteTitle: 'MANOJ K.C. | Python & Django Backend Developer',
  metaDescription: 'Official Portfolio of MANOJ K.C. - Python & Django Backend Developer specializing in Django REST Framework (DRF), PostgreSQL, JWT Auth, and Nepali Payment Gateways (Khalti, eSewa).',
  ogImage: manojPassportPhoto,
  twitterCard: 'summary_large_image',
  canonicalUrl: 'https://manojkc1.com.np',
  robots: 'index, follow',
  authorName: 'MANOJ K.C.',
  schemaType: 'Person',
};
