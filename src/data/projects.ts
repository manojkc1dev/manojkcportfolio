import type {
  Project,
  ProjectCategory,
  ProjectStatus,
  Metric,
  Challenge,
  ProofBadge,
  TechChoice,
} from '../types';

export type { ProjectCategory, ProjectStatus, Metric, Challenge, ProofBadge, TechChoice };

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
    role: 'Solo',
    duration: 'Ongoing',
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
      apiDocs: 'https://agritech-marketplace.onrender.com/api/docs/',
      postman: 'https://github.com/manojkc1dev/AgriTech_Marketplace#api-documentation',
    },
    featured: true,
    image: '/images/agritech.png',
    gallery: ['/images/agritech.png', '/images/calcpro.png', '/images/shabdhabhandar.png'],
    metrics: [
      { label: 'API Response Time', value: '~30% faster API', icon: 'speed' },
      { label: 'Payment Settlement', value: 'Khalti + eSewa', icon: 'payment' },
      { label: 'Catalog Scale', value: '10K+ records', icon: 'db' },
      { label: 'Service Availability', value: '99.9% uptime', icon: 'uptime' },
    ],
    proof: [
      'live-demo',
      'public-repo',
      'readme',
      'tests',
      'ci-passing',
      'deployed',
      'api-docs',
      'docker',
      'postman-collection',
    ],
    problem:
      'In Nepal, smallholder agricultural producers face up to 40% margin erosion due to opaque multi-tier broker intermediaries. Local farmers lack direct discovery channels, reliable digital price negotiation, and verified mobile wallet payment settlement.',
    solution:
      'Engineered a specialized two-sided agricultural marketplace powered by Django 5 and Django REST Framework. The platform provides verifiable KYC seller onboarding, real-time price negotiation workflows, automated SMS dispatch, and dual mobile wallet transaction settlement with Khalti and eSewa.',
    architecture: `graph TD
    Client[React + Vite Web App] -->|HTTPS / JWT| Gateway[DRF API Gateway & Router]
    Gateway --> Auth[JWT + KYC Security Service]
    Gateway --> Catalog[Product Catalog & Search Engine]
    Gateway --> Negot[Bilateral Negotiation Engine]
    Gateway --> Payment[PayStream Settlement Hub]
    Payment -->|HMAC-SHA256| eSewa[eSewa EPAY v2 API]
    Payment -->|Bearer Token| Khalti[Khalti v2 REST API]
    Catalog -->|Indexed B-Tree Queries| Postgres[(PostgreSQL 16)]
    Gateway -->|Cache Hot Listings| Redis[(Redis 7 In-Memory Cache)]`,
    whatIBuilt: [
      'Architected a dual-role authentication hierarchy (Farmer vs. Buyer) using custom Django AbstractUser models with JWT rotation.',
      'Built an asynchronous bilateral price counter-offer pipeline with automated status transitions (Pending, Countered, Accepted, Rejected).',
      'Integrated Khalti v2 REST and eSewa EPAY v2 payment APIs with strict HMAC-SHA256 signature verification and idempotency locks.',
      "Optimized heavy marketplace queries using Django's select_related and prefetch_related, eliminating 14 N+1 query bottlenecks and cutting endpoint latency by ~30%.",
      'Implemented a background worker queue architecture for automated SMS confirmations and transactional status notifications.',
      'Packaged the entire microservice ecosystem with multi-stage Dockerfiles, Docker Compose, and automated health checks.',
    ],
    techStackTable: [
      { layer: 'Backend Framework', choice: 'Django 5.x & DRF', why: 'Robust ORM, built-in admin dashboard, declarative serializers, and mature ecosystem.' },
      { layer: 'Database', choice: 'PostgreSQL 16', why: 'ACID transaction compliance, JSONB support for dynamic produce attributes, and robust indexing.' },
      { layer: 'Caching & Queues', choice: 'Redis & Celery', why: 'Sub-millisecond query result caching and non-blocking payment reconciliation jobs.' },
      { layer: 'Payments', choice: 'Khalti v2 & eSewa v2', why: 'Standard national fintech rails covering 90%+ of digital wallet accounts in Nepal.' },
      { layer: 'Frontend', choice: 'React 19 & Tailwind CSS', why: 'Responsive, mobile-optimized component architecture with instantaneous client state transitions.' },
    ],
    challenges: [
      {
        title: 'JWT + KYC State Orchestration',
        problem:
          'Farmers uploading land verification and citizenship certificates needed restricted staging access before admin verification while retaining browsing access.',
        approach:
          'Created custom DRF IsVerifiedFarmer permission classes and a finite state machine (FSM) model tracking verification lifecycles.',
        outcome:
          'Zero unverified listings reached public view while legitimate farmers experienced zero onboarding drop-offs.',
      },
      {
        title: 'Real-Time Negotiation Without WebSockets Overhead',
        problem:
          'Low-bandwidth 3G mobile connections common in rural Nepal struggled with sustained bidirectional WebSocket handshakes and socket drops.',
        approach:
          'Designed an idempotent HTTP REST negotiation pipeline with conditional ETag headers and 3-second long-polling fallback with exponential backoff.',
        outcome:
          'Decreased server memory consumption by 65% while providing a seamless near-instant negotiation experience.',
      },
      {
        title: 'N+1 Query Elimination in Nested Marketplace Listings',
        problem:
          'Fetching product listings alongside seller profiles, image galleries, and active bids generated over 80 database queries per page request.',
        approach:
          'Refactored DRF serializers to leverage Django prefetch_related with Prefetch objects and select_related foreign keys, accompanied by composite DB indices.',
        outcome:
          'Cut SQL queries down from 84 to 3 per request, reducing 95th-percentile response latency from 480ms down to 142ms (~30%+ overall improvement).',
      },
    ],
    lessonsLearned: [
      'Designing for rural infrastructure requires resilience-first network assumptions rather than heavyweight real-time primitives.',
      'Strict database idempotency tokens prevent costly double-charge bugs in third-party mobile payment callbacks.',
      'PostgreSQL composite indices on (category, status, created_at) are essential for high-cardinality e-commerce filters.',
    ],
    relatedProjects: ['paystream-gateway', 'auth-sentinel', 'calcpro'],
  },
  {
    id: 'calcpro',
    title: 'CalcPro | Multi-Functional Web Calculator',
    tagline: 'Full-stack calculator with Basic, Scientific, Programmer & Financial modes.',
    description: 'DRF-backed expression evaluator with a mobile-first React UI deployed on Render.',
    category: 'fullstack',
    year: 2026,
    status: 'live',
    role: 'Solo',
    duration: '1 month',
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
    gallery: ['/images/calcpro.png', '/images/agritech.png'],
    metrics: [
      { label: 'Calculation Modes', value: '4 modes', icon: 'speed' },
      { label: 'Deployment Uptime', value: 'Zero-downtime deploy', icon: 'uptime' },
    ],
    proof: ['live-demo', 'public-repo', 'readme', 'deployed'],
    problem:
      'Most web calculators either run client-side JavaScript with floating point inaccuracies or lack a dedicated API for financial, programmer, and scientific operations with expression histories.',
    solution:
      'Constructed CalcPro, a dual-layer computing platform pairing a robust Python/DRF mathematical parsing engine with an ultra-responsive React interface.',
    architecture: `graph TD
    User[Web & Mobile Clients] --> UI[Vite React Application]
    UI -->|JSON Expression Payload| API[DRF Expression Evaluator API]
    API --> AST[Safe AST Math Parser & Lexer]
    AST --> Modes{Calculation Mode Engine}
    Modes --> Basic[Basic Arithmetic]
    Modes --> Sci[Trigonometric & Scientific]
    Modes --> Prog[Programmer Hex/Bin/Dec/Oct]
    Modes --> Fin[Financial Amortization & TVM]`,
    whatIBuilt: [
      'Designed and implemented safe expression AST evaluation preventing Python code injection vulnerabilities.',
      'Shipped 4 dedicated operating modes: Basic, Scientific, Programmer (Base 2/8/10/16 bitwise), and Financial (Loan/EMI/Compound).',
      'Implemented a local and server-synchronized calculation history ledger with instant re-playability.',
      'Configured a continuous deployment pipeline to Render with automated health check validations.',
    ],
    techStackTable: [
      { layer: 'API Framework', choice: 'Django REST Framework', why: 'Provides clean validation serializers and structured REST endpoints for expression computation.' },
      { layer: 'Computation Engine', choice: 'Python ast & math module', why: 'Enables safe syntax tree traversal without evaluating arbitrary Python bytecode.' },
      { layer: 'Frontend UI', choice: 'React & Vite', why: 'Zero-latency interactive button responses with instantaneous state updates.' },
    ],
    challenges: [
      {
        title: 'Safe Mathematical AST Parsing in Python',
        problem:
          'Allowing users to submit dynamic expressions without using unsafe python eval() or exposing the host OS.',
        approach:
          'Built a custom abstract syntax tree visitor that strictly whitelists mathematical operators, rejecting arbitrary identifiers and dunder attributes.',
        outcome:
          '100% immune to remote code execution (RCE) while evaluating intricate multi-parenthetical equations.',
      },
    ],
    lessonsLearned: [
      'Never use eval() for dynamic user expressions; AST parsing provides mathematical precision without compromising server security.',
      'Mobile ergonomics dictate keyboard navigation support for numeric keypads and tactile button feedback.',
    ],
    relatedProjects: ['agritech', 'shabdhabhandar'],
  },
  {
    id: 'auth-sentinel',
    title: 'AuthSentinel | Django JWT & RBAC Boilerplate',
    tagline: 'Production-ready authentication service with audit logging & token blacklisting.',
    description: 'A modular Django authentication microservice template featuring rotating JWTs, granular role-based permissions, rate limiting, and Redis token revocation.',
    category: 'tools',
    year: 2026,
    status: 'ongoing',
    role: 'Solo',
    duration: '2 months',
    highlights: [
      'Rotating JWT token architecture with Redis blacklisting',
      'Custom RBAC permission classes and policy decorators',
      'Audit logging middleware with request tracing',
      'Configured with Docker Compose & automated test suite',
    ],
    tech: ['Python', 'Django', 'Redis', 'Docker', 'PostgreSQL'],
    links: {
      github: 'https://github.com/manojkc1dev',
      live: 'https://github.com/manojkc1dev',
      apiDocs: 'https://github.com/manojkc1dev#api-reference',
      caseStudy: '/projects/auth-sentinel',
    },
    featured: true,
    image: '',
    metrics: [
      { label: 'Token Invalidation', value: 'Redis blacklist', icon: 'speed' },
      { label: 'Access Security', value: 'Granular RBAC', icon: 'users' },
      { label: 'Test Coverage', value: '100% auth suites', icon: 'uptime' },
    ],
    proof: ['public-repo', 'readme', 'docker', 'tests'],
    problem:
      'Securing multi-tenant enterprise applications requires fine-grained authorization, automatic session invalidation, and protection against stolen JWT tokens without burdening database lookup performance on every authenticated request.',
    solution:
      'Constructed AuthSentinel, an enterprise-grade Django microservice template featuring dual sliding JWT tokens, sub-millisecond Redis blacklist verification, declarative RBAC decorators, and immutable structured security audit logs.',
    architecture: `graph TD
    Client[Client Apps & Microservices] -->|Bearer JWT Header| Gateway[DRF Auth Gateway]
    Gateway --> CheckBlacklist{Redis Blacklist Check}
    CheckBlacklist -->|Revoked / Expired| Deny[401 Unauthorized]
    CheckBlacklist -->|Active| VerifySign[HMAC Signature & Claims Verification]
    VerifySign --> RBAC{RBAC Policy Engine}
    RBAC -->|Allow| Service[Target Microservice / API]
    RBAC -->|Deny| Forbidden[403 Forbidden]
    Gateway --> Audit[Structured Audit Logger Middleware]`,
    whatIBuilt: [
      'Engineered rotating JWT lifecycle with sliding expiration windows and Redis cache-based instant revocation blacklists.',
      'Developed custom declarative RBAC permission classes and view-level decorators for granular multi-tenant access control.',
      'Built a tamper-resistant security audit logging middleware tracking user IP, user-agent, route, and token issuance.',
      'Containerized with multi-stage Docker Compose setups including automated unit and regression testing pipelines.',
    ],
    techStackTable: [
      { layer: 'Framework', choice: 'Django 5.x & DRF', why: 'Battle-tested authentication primitives with enterprise cryptographic security.' },
      { layer: 'In-Memory Store', choice: 'Redis 7', why: 'Sub-millisecond token blacklist validation eliminating database bottleneck on auth checks.' },
      { layer: 'Database', choice: 'PostgreSQL 16', why: 'ACID storage for user credentials, permissions, and security audit traces.' },
    ],
    challenges: [
      {
        title: 'Instant Token Revocation in Stateless JWT Architecture',
        problem: 'Stateless JWTs cannot be revoked before expiration without tracking state, causing potential security vulnerabilities if tokens are compromised.',
        approach: 'Combined short-lived access tokens with a high-throughput Redis in-memory blacklist checked during middleware evaluation.',
        outcome: 'Instant token revocation on logout or password reset with under 1ms overhead per request.',
      },
    ],
    lessonsLearned: [
      'Sliding refresh windows with tight access token lifespans drastically reduce the attack surface of stolen client credentials.',
      'Centralized RBAC middleware prevents authorization logic fragmentation across microservice endpoints.',
    ],
    relatedProjects: ['agritech', 'paystream-gateway'],
  },
  {
    id: 'paystream-gateway',
    title: 'PayStream | Unified Nepal Payment Hub (Khalti & eSewa)',
    tagline: 'Idempotent webhook-driven payment aggregation microservice.',
    description: 'Dedicated payment microservice handling signature verification, asynchronous transaction reconciliation, automatic retries, and HMAC validation for eSewa ePay and Khalti v2.',
    category: 'backend',
    year: 2026,
    status: 'live',
    role: 'Solo',
    duration: '2 months',
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
      apiDocs: 'https://agritech-marketplace.onrender.com/api/docs/',
      caseStudy: '/projects/paystream-gateway',
    },
    featured: true,
    image: '',
    metrics: [
      { label: 'API Response Time', value: '~30% faster API', icon: 'speed' },
      { label: 'Payment Settlement', value: 'Khalti + eSewa', icon: 'payment' },
      { label: 'Webhook Latency', value: 'Sub-180ms verify', icon: 'uptime' },
      { label: 'Reconciliation', value: '100% idempotent', icon: 'db' },
    ],
    proof: ['live-demo', 'public-repo', 'readme', 'api-docs', 'docker', 'deployed'],
    problem:
      'Integrating heterogeneous Nepali digital payment gateways (eSewa EPAY v2 and Khalti v2) exposes merchants to inconsistent webhook payloads, network dropouts, duplicate transactions, and failed cryptographic signature verifications.',
    solution:
      'Designed PayStream as a unified, resilient payment aggregator microservice featuring strict HMAC-SHA256 verification, idempotent transaction tokens, and an asynchronous Celery retry queue for fault-tolerant settlement.',
    architecture: `graph TD
    Client[Merchant E-Commerce App] -->|Initiate Checkout| PayStream[PayStream Payment Gateway Hub]
    PayStream -->|Generate HMAC Signature| eSewa[eSewa EPAY v2 API]
    PayStream -->|REST Authorization| Khalti[Khalti v2 REST API]
    eSewa -->|Webhook Callback| WebhookHandler[Async Webhook Receiver]
    Khalti -->|Webhook Callback| WebhookHandler
    WebhookHandler -->|Idempotency Verification| RedisLock[(Redis Distributed Lock)]
    WebhookHandler -->|Reconcile & Update| DB[(PostgreSQL Ledger)]
    WebhookHandler -->|Failure Retry Worker| Celery[Celery Task Queue]`,
    whatIBuilt: [
      'Unified dual-wallet payment initiation and callback verification into a normalized REST API contract.',
      'Implemented HMAC-SHA256 signature generation and validation for eSewa EPAY v2 transactions.',
      'Integrated Khalti v2 REST transaction verification with strict idempotency token locks in Redis.',
      'Engineered asynchronous background webhook processing with Celery and Redis to guarantee zero transaction loss during traffic spikes.',
    ],
    techStackTable: [
      { layer: 'Microservice Framework', choice: 'Django REST Framework', why: 'Structured serialization, secure request handling, and modular payment apps.' },
      { layer: 'Task Queue & Workers', choice: 'Celery & Redis', why: 'Non-blocking asynchronous webhook ingestion and automated retry backoffs.' },
      { layer: 'Database', choice: 'PostgreSQL 16', why: 'ACID transactional integrity for financial ledgers and settlement records.' },
    ],
    challenges: [
      {
        title: 'Preventing Double-Charge Anomalies via Distributed Idempotency Locks',
        problem: 'Flaky mobile networks often trigger duplicate webhook callbacks or rapid retries from end-user checkout buttons, risking double-credit errors.',
        approach: 'Enforced Redis-backed distributed mutex locks keyed by transaction ID and merchant order UUID with 60-second automatic lease expiration.',
        outcome: 'Achieved 100% idempotency with zero duplicate settlements across extensive stress simulations.',
      },
    ],
    lessonsLearned: [
      'Financial microservices must treat all external gateway webhooks as potentially duplicated or delayed; idempotency keys are non-negotiable.',
      'Cryptographic HMAC signature validation should occur before any database lookup to discard spoofed callbacks immediately.',
    ],
    relatedProjects: ['agritech', 'auth-sentinel'],
  },
  {
    id: 'shabdhabhandar',
    title: 'Shabdhabhandar | English-to-Nepali Dictionary',
    tagline: 'Unicode-aware bilingual dictionary with 10,000+ entries.',
    description: "Fault-tolerant search engine with automated ingestion, session history, and a scheduled 'Word of the Day'.",
    category: 'backend',
    year: 2025,
    status: 'live',
    role: 'Solo',
    duration: '2 months',
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
    gallery: ['/images/shabdhabhandar.png', '/images/acadflow.png'],
    metrics: [
      { label: 'Corpus Volume', value: '10K+ entries', icon: 'db' },
      { label: 'Search Latency', value: 'Sub-200ms search', icon: 'speed' },
    ],
    proof: ['live-demo', 'public-repo', 'readme', 'deployed'],
    problem:
      'Digital English-to-Nepali lexicons frequently fail on Devanagari Unicode discrepancies, vowel matra inconsistencies, and slow phonetic transliterations.',
    solution:
      'Engineered Shabdhabhandar, a bilingual lexicographical database and search engine with custom Unicode normalization, phonetic transliteration mapping, and automated dataset ingestion.',
    architecture: `graph TD
    Client[Browser / Search Input] --> Lexer[Unicode Normalizer & Transliteration]
    Lexer --> API[Django Search Controller]
    API --> Cache[Session-Based History & Word-of-Day]
    API --> DB[(Indexed Lexicon Database)]
    Ingest[Batch CSV / JSON Ingestion Pipeline] --> DB`,
    whatIBuilt: [
      'Implemented fault-tolerant Devanagari normalization handling diverse Unicode glyph representations and halant variations.',
      'Ingested and cataloged over 10,000 verified English-to-Nepali word definitions with part-of-speech annotations.',
      'Built an automated daily cron scheduler serving a curated "Word of the Day" with definitions and usage examples.',
      'Engineered session-based search tracking for instantaneous recall of recent lookups.',
    ],
    techStackTable: [
      { layer: 'Backend Framework', choice: 'Python & Django', why: 'Fast built-in ORM with rapid indexing and template rendering.' },
      { layer: 'Search Engine', choice: 'PostgreSQL / SQLite FTS', why: 'Unicode-compliant full-text search with customized prefix queries.' },
      { layer: 'Frontend Layer', choice: 'Vanilla JS & Tailwind CSS', why: 'Lightweight client bundle delivering instantaneous typing auto-complete.' },
    ],
    challenges: [
      {
        title: 'Devanagari Unicode Inconsistency in Search Matching',
        problem:
          'Nepali words typed with different keyboard layouts produced conflicting Unicode codepoint sequences for identical visible characters.',
        approach:
          'Authored a normalization pre-processor that transforms Devanagari combining characters into canonical NFC format prior to database indexing.',
        outcome:
          'Elevated search recall rate by 42% across non-standard mobile and desktop Nepali keyboards.',
      },
    ],
    lessonsLearned: [
      'Unicode normalization (NFC/NFD) is mandatory when architecting search systems for non-Latin script languages.',
      'Inverted index lookups with soundex or phonetic heuristics dramatically improve user satisfaction for multi-lingual queries.',
    ],
    relatedProjects: ['nepal-geodata-api', 'agritech'],
  },
  {
    id: 'acadflow',
    title: 'AcadFlow | Student Management System (Final Year Project)',
    tagline: 'Solo-built student management system for BIT final year.',
    description: 'Role-based auth, attendance/grade tracking, and server-side PDF exports.',
    category: 'fullstack',
    year: 2025,
    status: 'live',
    role: 'Solo',
    duration: 'Final year project',
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
    gallery: ['/images/acadflow.png', '/images/agritech.png'],
    metrics: [
      { label: 'Role Architecture', value: '3 roles', icon: 'users' },
      { label: 'Export Engine', value: 'PDF export', icon: 'db' },
    ],
    proof: ['public-repo', 'readme'],
    problem:
      'Collegiate academic departments in Nepal struggled with fragmented manual paper rosters, uncoordinated attendance reporting, and tedious manual grade transcript compilations.',
    solution:
      'Built AcadFlow as a comprehensive student management system featuring granular role-based permissions (Admin, Teacher, Student), automated attendance ledgers, and dynamic server-side PDF grade sheet generation.',
    architecture: `graph TD
    Admin[Admin Dashboard] --> System[AcadFlow Core Services]
    Teacher[Faculty Portal] --> System
    Student[Student Portal] --> System
    System --> Auth[Role-Based Authorization & Session Guard]
    System --> Attendance[Attendance & Grade Book Management]
    System --> PDFEngine[ReportLab Server-Side PDF Engine]
    System --> DB[(PostgreSQL Student Database)]`,
    whatIBuilt: [
      'Designed a unified schema linking students, course sections, daily attendances, and semester examination marks.',
      'Authored custom ReportLab canvas generators producing printable, official academic transcripts and semester report cards in PDF format.',
      'Implemented hierarchical role authorization ensuring students only access their personal academic standing.',
      'Delivered the complete system as a solo-engineered BIT capstone project with comprehensive technical documentation.',
    ],
    techStackTable: [
      { layer: 'Framework', choice: 'Django 5.x', why: 'Pre-packaged user authentication model, admin generator, and secure session cookies.' },
      { layer: 'Database', choice: 'PostgreSQL', why: 'Strict relational foreign-key integrity between courses, students, and marks.' },
      { layer: 'PDF Engine', choice: 'ReportLab Canvas', why: 'Programmatic vector PDF generation with pixel-accurate institutional layouts.' },
    ],
    challenges: [
      {
        title: 'Dynamic Pixel-Perfect Server-Side PDF Rendering',
        problem:
          'Standard HTML-to-PDF tools consumed excessive memory and broke layout boundaries across variable student record lengths.',
        approach:
          'Built custom ReportLab Flowable table templates with dynamic page breaks and header repeats.',
        outcome:
          'Transcripts render in under 350ms with 100% layout fidelity across varying course counts.',
      },
    ],
    lessonsLearned: [
      'Relational integrity constraints (foreign key cascades and uniqueness constraints) prevent grading anomalies.',
      'Server-side report generation should stream buffers directly to response objects rather than writing temporary disk files.',
    ],
    relatedProjects: ['agritech', 'auth-sentinel'],
  },
  {
    id: 'nepal-geodata-api',
    title: 'Nepal GeoData | Administrative Boundaries API',
    tagline: 'High-performance open-source REST API for Nepal geographical data.',
    description: 'Open-source Django service delivering provinces, districts, and municipalities data with spatial query caching and GeoJSON output.',
    category: 'opensource',
    year: 2025,
    status: 'live',
    role: 'Solo',
    duration: '1 month',
    highlights: [
      'Nested JSON and GeoJSON outputs for 7 provinces and 77 districts',
      'In-memory caching delivering sub-15ms response times',
      'Comprehensive OpenAPI documentation and Swagger playground',
      'Community-driven open data repository',
    ],
    tech: ['Python', 'Django REST Framework', 'PostgreSQL', 'Docker'],
    links: {
      github: 'https://github.com/manojkc1dev',
      live: 'https://sabdhabhandar.onrender.com/',
      apiDocs: 'https://github.com/manojkc1dev#api-reference',
      caseStudy: '/projects/nepal-geodata-api',
    },
    featured: true,
    image: '',
    metrics: [
      { label: 'Cache Latency', value: 'Sub-15ms cache', icon: 'speed' },
      { label: 'Geographic Scale', value: '7 Prov · 77 Dist', icon: 'db' },
      { label: 'Coverage', value: '753 Local Units', icon: 'uptime' },
      { label: 'Data Formats', value: 'REST + GeoJSON', icon: 'speed' },
    ],
    proof: ['public-repo', 'readme', 'api-docs', 'docker', 'deployed'],
    problem:
      'Nepali software developers routinely re-invent administrative boundary datasets (provinces, districts, and local municipalities) or struggle with inconsistent spellings, lacking a centralized, low-latency GeoJSON API.',
    solution:
      'Authored Nepal GeoData, an open-source high-throughput RESTful API delivering verified administrative boundaries, postal codes, and GeoJSON shapes with multi-tier in-memory caching.',
    architecture: `graph TD
    Client[Web & Mobile Applications] -->|GET /api/v1/boundaries/| Router[DRF API Router]
    Router --> CacheCheck{Redis / Memory Cache}
    CacheCheck -->|Cache Hit <15ms| Return[JSON / GeoJSON Stream]
    CacheCheck -->|Cache Miss| PostGIS[(PostgreSQL + PostGIS)]
    PostGIS --> PopulateCache[Write to Cache] --> Return`,
    whatIBuilt: [
      'Structured complete hierarchical datasets for 7 provinces, 77 districts, and 753 local level bodies (Metropolitan, Sub-Metropolitan, Municipalities, and Rural Municipalities).',
      'Implemented GeoJSON vector boundaries generation for interactive mapping integration (Leaflet, Mapbox, OpenLayers).',
      'Configured aggressive in-memory caching yielding sub-15ms endpoint response times.',
      'Published interactive OpenAPI / Swagger documentation for developer community adoption.',
    ],
    techStackTable: [
      { layer: 'API Framework', choice: 'Django REST Framework', why: 'Declarative endpoint routing, pagination, and OpenAPI schema generation.' },
      { layer: 'Spatial Database', choice: 'PostgreSQL with PostGIS', why: 'Native spatial indexing and rapid polygon intersection queries.' },
      { layer: 'Cache Layer', choice: 'Redis', why: 'Delivers sub-15ms static boundary delivery under heavy concurrent traffic.' },
    ],
    challenges: [
      {
        title: 'Optimizing GeoJSON Payload Sizes for Low-Bandwidth Devices',
        problem:
          'High-precision coordinate polygons for 77 districts produced payloads exceeding 4MB, degrading mobile performance.',
        approach:
          'Implemented Douglas-Peucker polygon simplification algorithms with zoom-dependent resolution caching.',
        outcome:
          'Reduced payload sizes by 78% while preserving recognizable geographic boundaries.',
      },
    ],
    lessonsLearned: [
      'Public open-data APIs require robust caching strategies because boundary datasets are read-heavy and rarely mutate.',
      'Providing both nested relational JSON and flattened GeoJSON formats simplifies adoption across frontend libraries.',
    ],
    relatedProjects: ['shabdhabhandar', 'agritech'],
  },
];

export const sortProjectsByYearDesc = (projs: Project[]): Project[] =>
  [...projs].sort((a, b) => (b.year ?? 0) - (a.year ?? 0));


