"""
Deterministic, idempotent management command to seed initial portfolio data.

Usage:
    python backend/manage.py seed_initial_data
"""
from django.core.management.base import BaseCommand
from django.db import transaction

from apps.portfolio.models import Project, ProjectMetric, ProjectChallenge, TechChoice
from apps.skills.models import SkillCategory, SkillItem
from apps.experience.models import Experience
from apps.inquiries.models import Inquiry
from apps.blog.models import Article, ArticleTag
from apps.services.models import Service
from apps.resume.models import ResumeDocument, ResumeDataRecord
from apps.siteconfig.models import (
    SiteProfile,
    ProfileStat,
    SocialLink,
    UseCategory,
    UseItem,
    CurrentItem,
)


class Command(BaseCommand):
    help = "Seed initial production data from the existing portfolio frontend contract."

    @transaction.atomic
    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE("Seeding initial portfolio domain data..."))

        self.seed_site_profile()
        self.seed_projects()
        self.seed_skills()
        self.seed_experience()
        self.seed_uses()
        self.seed_currently_building()
        self.seed_services()
        self.seed_blog()
        self.seed_resume()
        self.seed_inquiries()

        self.stdout.write(self.style.SUCCESS("✓ Successfully seeded all portfolio data idempotently!"))

    def seed_site_profile(self):
        profile, _ = SiteProfile.objects.update_or_create(
            id='main',
            defaults={
                'name': 'Manoj Khatri',
                'title': 'Backend Software Engineer',
                'tagline': 'Backend systems engineered for scale, security, and long-term reliability.',
                'bio': [
                    "I'm a Python/Django backend developer based in Kathmandu, Nepal, focused on building secure server-side systems that power real products. My work centers on Django REST Framework, PostgreSQL, JWT authentication, role-based access control, and payment gateway integrations like Khalti and eSewa.",
                    "I've shipped REST APIs for marketplace platforms and data-driven apps, designing schemas, optimizing queries, and documenting endpoints for clean handoff. At Sajha Infotech, I cut average API response times by ~30% through query optimization on a student management system.",
                    "I hold a BIT from Tribhuvan University (2025) and completed CS50's Web Programming with Python and JavaScript. Currently deepening Celery, Docker, and API architecture for larger systems.",
                ],
                'photo': '/images/manoj.jpg',
                'location': 'Kathmandu, Nepal',
                'email': 'manojkc1dev@gmail.com',
                'phone': '+977 9842203976',
                'availability': 'Open to remote freelance & junior backend roles',
                'resume_url': '/resume.pdf',
                'hero_badge': 'Available for Backend Roles',
                'hero_title': 'Engineering Scalable & Secure Backend Systems',
                'hero_subtitle': 'Specialized in Python, Django REST Framework, PostgreSQL query optimization, and distributed asynchronous task queues.',
                'primary_cta': 'View Case Studies',
                'secondary_cta': 'Contact Me',
                'pillars': [
                    {
                        'title': 'Scalable API Architecture',
                        'description': 'Modular Django REST APIs with predictable serialization, pagination, and strict error structures.',
                        'focus': 'DRF & Microservices'
                    },
                    {
                        'title': 'Database Optimization',
                        'description': 'Schema normalization, composite indexing, and query execution plan auditing.',
                        'focus': 'PostgreSQL 16'
                    },
                    {
                        'title': 'Zero-Trust Security',
                        'description': 'Granular JWT rotation, RBAC authorization, honeypot protection, and security audit logs.',
                        'focus': 'Auth & Security'
                    }
                ]
            }
        )

        stats_data = [
            {'stat_id': 'projects', 'label': 'Production Projects', 'value': '3+', 'subtext': 'Django, DRF & PostgreSQL', 'icon_name': 'Code2', 'order': 1},
            {'stat_id': 'speedup', 'label': 'Avg. API Speedup', 'value': '30%', 'subtext': 'Query & DB optimization', 'icon_name': 'Activity', 'order': 2},
            {'stat_id': 'records', 'label': 'Records Handled', 'value': '10K+', 'subtext': 'PostgreSQL data pipelines', 'icon_name': 'Clock', 'order': 3},
            {'stat_id': 'education', 'label': 'BIT Graduate', 'value': '2025', 'subtext': 'Tribhuvan University', 'icon_name': 'Users', 'order': 4},
        ]
        for s in stats_data:
            ProfileStat.objects.update_or_create(
                profile=profile,
                stat_id=s['stat_id'],
                defaults=s
            )

        socials_data = [
            {'name': 'GitHub', 'url': 'https://github.com/manojkc1dev', 'icon': 'Github', 'handle': '@manojkc1dev', 'order': 1, 'visible': True},
            {'name': 'LinkedIn', 'url': 'https://linkedin.com/in/manojkc1dev', 'icon': 'Linkedin', 'handle': '@manojkc1dev', 'order': 2, 'visible': True},
            {'name': 'X (Twitter)', 'url': 'https://twitter.com/manojkc1dev', 'icon': 'Twitter', 'handle': '@manojkc1dev', 'order': 3, 'visible': True},
            {'name': 'Instagram', 'url': 'https://instagram.com/manojkc1dev', 'icon': 'Instagram', 'handle': '@manojkc1dev', 'order': 4, 'visible': True},
            {'name': 'Facebook', 'url': 'https://facebook.com/manojkc1dev', 'icon': 'Facebook', 'handle': '@manojkc1dev', 'order': 5, 'visible': True},
            {'name': 'TikTok', 'url': 'https://tiktok.com/@manojkc1dev', 'icon': 'Music2', 'handle': '@manojkc1dev', 'order': 6, 'visible': True},
        ]
        for soc in socials_data:
            SocialLink.objects.update_or_create(
                profile=profile,
                name=soc['name'],
                defaults=soc
            )

    def seed_projects(self):
        projects_data = [
            {
                'id': 'agritech',
                'title': 'Agritech | Agriculture Marketplace Platform',
                'tagline': 'Full-stack multi-vendor marketplace with live negotiation & dual payment integrations.',
                'description': 'Multi-vendor agricultural marketplace connecting farmers directly with institutional buyers, featuring automated KYC, real-time negotiation, and Khalti/eSewa payment processing.',
                'category': 'fullstack',
                'year': 2026,
                'status': 'live',
                'visibility': 'Published',
                'featured': True,
                'image': '/images/agritech.png',
                'thumbnail': '/images/agritech.png',
                'highlights': [
                    'Architected REST API with Django REST Framework and PostgreSQL for 10K+ inventory items.',
                    'Implemented JWT authentication with role-based access control (Farmer vs Buyer).',
                    'Engineered real-time price negotiation workflow with instant alert triggers.',
                    'Integrated Khalti & eSewa payment gateways with server-side webhook verification.',
                ],
                'tech': ['Python', 'Django', 'Django REST Framework', 'PostgreSQL', 'React', 'Tailwind CSS', 'Docker'],
                'languages': ['Python', 'TypeScript', 'SQL'],
                'links': {
                    'live': 'https://agritech-marketplace.onrender.com/',
                    'github': 'https://github.com/manojkc1dev/AgriTech_Marketplace',
                    'caseStudy': '/projects/agritech',
                },
                'role': 'Full-Stack Developer (Solo)',
                'duration': '3 months',
                'client': 'AgriTech Nepal (Farmers & Buyers)',
                'industry': 'Agriculture & E-Commerce',
                'year_duration': '2026 · 3 Months',
                'live_url': 'https://agritech-marketplace.onrender.com/',
                'github_url': 'https://github.com/manojkc1dev/AgriTech_Marketplace',
                'case_study_url': '/projects/agritech',
                'problem': 'Agricultural supply chains in Nepal suffer from excessive intermediary margins and lack of transparent price discovery.',
                'solution': 'A centralized platform offering direct farmer-to-buyer negotiation pipelines, escrow-like transaction verification, and instant digital payments.',
                'architecture': 'graph TD\n    Client[React + Tailwind] -->|JWT Auth| API[Django REST Framework]\n    API --> DB[(PostgreSQL)]\n    API --> Payment[Khalti / eSewa Webhooks]',
                'proof': ['live-demo', 'public-repo', 'readme', 'tests', 'ci-passing', 'deployed', 'api-docs', 'docker', 'postman-collection'],
                'order': 1,
                'metrics': [
                    {'label': 'API Response Time', 'value': '~30% faster API', 'icon': 'speed', 'order': 1},
                    {'label': 'Payment Settlement', 'value': 'Khalti + eSewa', 'icon': 'payment', 'order': 2},
                    {'label': 'Catalog Scale', 'value': '10K+ records', 'icon': 'db', 'order': 3},
                    {'label': 'Service Availability', 'value': '99.9% uptime', 'icon': 'uptime', 'order': 4},
                ],
                'challenges': [
                    {
                        'title': 'Handling High Concurrency in Live Price Negotiation',
                        'problem': 'Simultaneous counter-offers from multiple buyers caused race conditions in transaction state.',
                        'approach': 'Implemented PostgreSQL select_for_update() row locking and database transaction atomic blocks.',
                        'outcome': 'Zero state inconsistencies across 5,000+ simulated concurrent negotiation operations.',
                        'order': 1
                    }
                ],
                'tech_choices': [
                    {'layer': 'Backend Framework', 'choice': 'Django REST Framework', 'why': 'Rapid serialization, built-in ORM security against SQL injections, and granular permission classes.', 'order': 1},
                    {'layer': 'Database', 'choice': 'PostgreSQL 16', 'why': 'Robust transactional ACID guarantees and composite indexing support.', 'order': 2},
                ]
            },
            {
                'id': 'calcpro',
                'title': 'CalcPro | Multi-Functional Web Calculator',
                'tagline': 'High-precision mathematical parser and calculation engine.',
                'description': 'Full-stack calculator with Basic, Scientific, Programmer & Financial modes powered by a DRF expression evaluator.',
                'category': 'tools',
                'year': 2025,
                'status': 'live',
                'visibility': 'Published',
                'featured': True,
                'image': '/images/calcpro.png',
                'thumbnail': '/images/calcpro.png',
                'highlights': [
                    'Built mathematical AST evaluator in Python ensuring high float precision.',
                    'Zero-downtime automated deployment pipeline on Render.',
                    'Engineered responsive mobile-friendly touch interface in React.',
                ],
                'tech': ['Django REST Framework', 'React', 'Vite', 'JavaScript', 'Render'],
                'languages': ['Python', 'JavaScript'],
                'links': {
                    'live': 'https://calcpro-calculator.onrender.com/',
                    'github': 'https://github.com/manojkc1dev/calcpro-calculator/',
                    'caseStudy': '/projects/calcpro',
                },
                'role': 'Full-Stack Developer',
                'duration': '1 month',
                'client': 'Personal Project',
                'industry': 'Developer Tools & Mathematics',
                'year_duration': '2025 · 1 Month',
                'live_url': 'https://calcpro-calculator.onrender.com/',
                'github_url': 'https://github.com/manojkc1dev/calcpro-calculator/',
                'case_study_url': '/projects/calcpro',
                'proof': ['live-demo', 'public-repo', 'readme', 'deployed'],
                'order': 2,
                'metrics': [
                    {'label': 'Calculation Modes', 'value': '4 modes', 'icon': 'speed', 'order': 1},
                    {'label': 'Deployment Uptime', 'value': 'Zero-downtime deploy', 'icon': 'uptime', 'order': 2},
                ]
            },
            {
                'id': 'auth-sentinel',
                'title': 'AuthSentinel | Django JWT & RBAC Boilerplate',
                'tagline': 'Production authentication microservice with rotating JWTs and granular permissions.',
                'description': 'Modular Django authentication microservice template featuring rotating JWTs, granular role-based permissions, and Redis token blacklisting.',
                'category': 'backend',
                'year': 2026,
                'status': 'ongoing',
                'visibility': 'Published',
                'featured': True,
                'image': '',
                'thumbnail': '',
                'highlights': [
                    'Built rotating JWT access/refresh token pair issuance with configurable lifespans.',
                    'Implemented token revocation and blacklisting using Redis cache backend.',
                    'Designed audit logging middleware capturing IP address, user-agent, and failure counts.',
                ],
                'tech': ['Python', 'Django 5', 'SimpleJWT', 'Redis', 'PostgreSQL', 'Docker'],
                'languages': ['Python'],
                'links': {
                    'github': 'https://github.com/manojkc1dev',
                    'caseStudy': '/projects/auth-sentinel',
                },
                'role': 'Backend Engineer',
                'duration': 'Ongoing',
                'client': 'Open Source / Internal Tooling',
                'industry': 'Cybersecurity & Auth Systems',
                'year_duration': '2026 · Ongoing',
                'live_url': 'https://github.com/manojkc1dev',
                'github_url': 'https://github.com/manojkc1dev',
                'case_study_url': '/projects/auth-sentinel',
                'proof': ['public-repo', 'readme', 'tests', 'docker', 'api-docs'],
                'order': 3,
                'metrics': [
                    {'label': 'Token Verification', 'value': '< 2ms', 'icon': 'speed', 'order': 1},
                    {'label': 'Security Rating', 'value': 'A+ OWASP', 'icon': 'users', 'order': 2},
                ]
            }
        ]

        for p_data in projects_data:
            metrics = p_data.pop('metrics', [])
            challenges = p_data.pop('challenges', [])
            tech_choices = p_data.pop('tech_choices', [])

            proj, _ = Project.objects.update_or_create(
                id=p_data['id'],
                defaults=p_data
            )

            # Metrics
            for m in metrics:
                ProjectMetric.objects.update_or_create(
                    project=proj,
                    label=m['label'],
                    defaults=m
                )

            # Challenges
            for c in challenges:
                ProjectChallenge.objects.update_or_create(
                    project=proj,
                    title=c['title'],
                    defaults=c
                )

            # Tech Choices
            for tc in tech_choices:
                TechChoice.objects.update_or_create(
                    project=proj,
                    layer=tc['layer'],
                    defaults=tc
                )

    def seed_skills(self):
        categories = [
            {
                'id': 'backend',
                'title': 'Backend & APIs',
                'description': 'Building secure, scalable server-side systems and RESTful APIs.',
                'order': 1,
                'skills': [
                    {'name': 'Python', 'proficiency': 'Advanced', 'level': 'advanced', 'highlight': True, 'years': 3.0, 'order': 1},
                    {'name': 'Django', 'proficiency': 'Advanced', 'level': 'advanced', 'highlight': True, 'years': 2.5, 'order': 2},
                    {'name': 'Django REST Framework', 'proficiency': 'Advanced', 'level': 'advanced', 'highlight': True, 'years': 2.5, 'order': 3},
                    {'name': 'JWT & Auth', 'proficiency': 'Advanced', 'level': 'advanced', 'highlight': True, 'years': 2.0, 'order': 4},
                    {'name': 'Celery & Redis', 'proficiency': 'Intermediate', 'level': 'intermediate', 'highlight': False, 'years': 1.0, 'order': 5},
                ]
            },
            {
                'id': 'databases',
                'title': 'Databases & Storage',
                'description': 'Relational design, query optimization, and transaction safety.',
                'order': 2,
                'skills': [
                    {'name': 'PostgreSQL', 'proficiency': 'Advanced', 'level': 'advanced', 'highlight': True, 'years': 2.5, 'order': 1},
                    {'name': 'SQLite', 'proficiency': 'Advanced', 'level': 'advanced', 'highlight': False, 'years': 3.0, 'order': 2},
                    {'name': 'Database Indexing & Query Tuning', 'proficiency': 'Advanced', 'level': 'advanced', 'highlight': True, 'years': 2.0, 'order': 3},
                ]
            },
            {
                'id': 'frontend',
                'title': 'Frontend & UI',
                'description': 'Modern web interfaces with typed components and clean styling.',
                'order': 3,
                'skills': [
                    {'name': 'React 19', 'proficiency': 'Advanced', 'level': 'advanced', 'highlight': True, 'years': 2.0, 'order': 1},
                    {'name': 'TypeScript', 'proficiency': 'Advanced', 'level': 'advanced', 'highlight': True, 'years': 2.0, 'order': 2},
                    {'name': 'Tailwind CSS', 'proficiency': 'Advanced', 'level': 'advanced', 'highlight': True, 'years': 2.0, 'order': 3},
                    {'name': 'HTML5 & CSS3', 'proficiency': 'Advanced', 'level': 'advanced', 'highlight': False, 'years': 3.5, 'order': 4},
                ]
            },
            {
                'id': 'devops',
                'title': 'DevOps & Tooling',
                'description': 'Containerization, version control, and cloud deployments.',
                'order': 4,
                'skills': [
                    {'name': 'Docker & Docker Compose', 'proficiency': 'Intermediate', 'level': 'intermediate', 'highlight': True, 'years': 1.5, 'order': 1},
                    {'name': 'Git & GitHub', 'proficiency': 'Advanced', 'level': 'advanced', 'highlight': False, 'years': 3.0, 'order': 2},
                    {'name': 'Render / Cloud Deployment', 'proficiency': 'Advanced', 'level': 'advanced', 'highlight': False, 'years': 2.0, 'order': 3},
                    {'name': 'Postman & API Testing', 'proficiency': 'Advanced', 'level': 'advanced', 'highlight': False, 'years': 2.5, 'order': 4},
                ]
            }
        ]

        for cat_data in categories:
            skills_list = cat_data.pop('skills', [])
            cat, _ = SkillCategory.objects.update_or_create(
                id=cat_data['id'],
                defaults=cat_data
            )
            for skill in skills_list:
                SkillItem.objects.update_or_create(
                    category=cat,
                    name=skill['name'],
                    defaults=skill
                )

    def seed_experience(self):
        experiences = [
            {
                'id': 'sajha-infotech',
                'role': 'Backend Developer Intern',
                'company': 'Sajha Infotech',
                'company_url': '',
                'period': 'Jul 2024 – Dec 2024',
                'start': 'Jul 2024',
                'end': 'Dec 2024',
                'location': 'Kathmandu, Nepal',
                'type': 'internship',
                'description': 'Engineered REST APIs and optimized SQL database queries for education management systems.',
                'bullets': [
                    'Built and documented REST API endpoints in Django REST Framework for student grading, attendance, and fee management.',
                    'Optimized PostgreSQL queries by adding composite B-Tree indexes and removing N+1 query patterns, reducing response times by ~30%.',
                    'Collaborated with senior engineers on schema design and migration management across development and staging environments.',
                ],
                'tech': ['Python', 'Django', 'Django REST Framework', 'PostgreSQL', 'Git', 'Postman'],
                'order': 1
            },
            {
                'id': 'tu-bit',
                'role': 'Bachelor in Information Technology (BIT)',
                'company': 'Tribhuvan University',
                'company_url': '',
                'period': '2021 – 2025',
                'start': '2021',
                'end': '2025',
                'location': 'Kathmandu, Nepal',
                'type': 'education',
                'description': 'Rigorous 4-year degree focusing on Data Structures, Database Systems, Computer Networks, and Software Engineering.',
                'bullets': [
                    'Core coursework: DBMS, Data Structures & Algorithms, Network Security, Operating Systems, Web Technologies.',
                    'Final Year Project: Full-stack Marketplace application with real-time negotiation and payment gateway integration.',
                ],
                'tech': ['Python', 'C/C++', 'SQL', 'Computer Networks', 'Operating Systems'],
                'order': 2
            }
        ]

        for exp in experiences:
            Experience.objects.update_or_create(
                id=exp['id'],
                defaults=exp
            )

    def seed_uses(self):
        uses_categories = [
            {
                'title': 'Hardware',
                'description': 'Physical equipment driving everyday development.',
                'order': 1,
                'items': [
                    {'name': 'Linux Development Workstation', 'why': 'Native Linux kernel for running Docker, PostgreSQL, and Celery without virtualization overhead.', 'tag': 'Pop!_OS / Ubuntu', 'order': 1},
                    {'name': 'Keychron Mechanical Keyboard', 'why': 'Tactile tactile switches for long engineering sprints.', 'tag': 'Gateron Brown', 'order': 2},
                    {'name': 'Dell 27" 4K IPS Monitor', 'why': 'Screen real estate for terminal, IDE, and database profiling.', 'tag': 'UltraSharp', 'order': 3},
                ]
            },
            {
                'title': 'Backend Tools',
                'description': 'Core tools powering API development.',
                'order': 2,
                'items': [
                    {'name': 'Python 3.12 & uv', 'why': 'Fast virtual environment management and modern syntax.', 'link': 'https://astral.sh/uv', 'tag': 'Runtime', 'order': 1},
                    {'name': 'Django 5.x & DRF', 'why': 'Declarative serializers, battle-tested security, and ORM migrations.', 'link': 'https://djangoproject.com/', 'tag': 'Web Framework', 'order': 2},
                    {'name': 'PostgreSQL 16 & DBeaver', 'why': 'Robust ACID guarantees and EXPLAIN ANALYZE query inspection.', 'link': 'https://postgresql.org/', 'tag': 'Database', 'order': 3},
                    {'name': 'Redis 7 & Celery', 'why': 'Sub-millisecond token blacklisting and background task queues.', 'link': 'https://redis.io/', 'tag': 'Cache / Broker', 'order': 4},
                ]
            }
        ]

        for u_cat in uses_categories:
            items = u_cat.pop('items', [])
            cat, _ = UseCategory.objects.update_or_create(
                title=u_cat['title'],
                defaults=u_cat
            )
            for item in items:
                UseItem.objects.update_or_create(
                    category=cat,
                    name=item['name'],
                    defaults=item
                )

    def seed_currently_building(self):
        items = [
            {
                'id': 'ats-resume-builder',
                'title': 'ATS Resume Builder & Visual Studio',
                'description': 'Pixel-accurate A4/Letter resume previewer with automated multi-format export engines (PDF, DOCX, TXT).',
                'status': 'active',
                'progress': 70,
                'since': 'Feb 2026',
                'order': 1
            },
            {
                'id': 'portfolio-drf-backend',
                'title': 'Porting Portfolio Backend to Django REST',
                'description': 'Decoupling static endpoints into a production-grade Django 5 + PostgreSQL backend with automated OpenAPI schema.',
                'status': 'active',
                'progress': 40,
                'related_project_id': 'agritech',
                'since': 'Jan 2026',
                'order': 2
            },
            {
                'id': 'celery-redis-workers',
                'title': 'Celery + Redis Distributed Task Queues',
                'description': 'Asynchronous webhook reconciliation, exponential retry policies, distributed locks, and worker monitoring.',
                'status': 'active',
                'progress': 50,
                'since': 'Mar 2026',
                'order': 3
            }
        ]
        for item in items:
            CurrentItem.objects.update_or_create(
                id=item['id'],
                defaults=item
            )

    def seed_services(self):
        services_data = [
            {
                'id': 'backend-api-development',
                'order': 1,
                'title': 'Backend API Engineering',
                'slug': 'backend-api-development',
                'icon': 'Server',
                'short_summary': 'Designing and implementing scalable RESTful APIs with Django REST Framework, JWT auth, and PostgreSQL.',
                'detailed_scope': 'End-to-end API design from database schema modeling to endpoint documentation and automated test suites.',
                'features': ['JWT Authentication & RBAC', 'Database Query Optimization', 'Postman API Documentation', 'Docker Containerization'],
                'deliverables': ['Clean DRF source code', 'Interactive API docs', 'Database migration scripts', 'Unit & Integration tests'],
                'technologies': ['Python', 'Django', 'DRF', 'PostgreSQL', 'Docker'],
                'visibility': 'Published',
                'featured': True,
            },
            {
                'id': 'database-optimization',
                'order': 2,
                'title': 'PostgreSQL Query & Schema Optimization',
                'slug': 'database-optimization',
                'icon': 'Database',
                'short_summary': 'Profiling slow queries, auditing index utilization, and restructuring relational schemas for high concurrency.',
                'detailed_scope': 'Deep inspection of EXPLAIN ANALYZE outputs, eliminating N+1 query bottlenecks, and configuring connection pooling.',
                'features': ['EXPLAIN ANALYZE query audits', 'Composite B-Tree indexing', 'ORM query refactoring', 'Connection pooling tuning'],
                'deliverables': ['Audit report with performance benchmarks', 'Optimized migration scripts', 'Index creation scripts'],
                'technologies': ['PostgreSQL', 'Django ORM', 'SQL', 'pg_stat_statements'],
                'visibility': 'Published',
                'featured': True,
            }
        ]

        for s in services_data:
            Service.objects.update_or_create(
                id=s['id'],
                defaults=s
            )

    def seed_blog(self):
        tag_django, _ = ArticleTag.objects.update_or_create(name='Django', defaults={'slug': 'django'})
        tag_postgres, _ = ArticleTag.objects.update_or_create(name='PostgreSQL', defaults={'slug': 'postgresql'})
        tag_performance, _ = ArticleTag.objects.update_or_create(name='Performance', defaults={'slug': 'performance'})

        article, _ = Article.objects.update_or_create(
            id='django-query-optimization-guide',
            defaults={
                'title': 'Optimizing PostgreSQL Queries in Django REST Framework',
                'slug': 'django-query-optimization-guide',
                'category': 'Backend Architecture',
                'date': 'Mar 2026',
                'visibility': 'Published',
                'featured': True,
                'excerpt': 'A practical guide to diagnosing N+1 queries, leveraging select_related and prefetch_related, and adding composite indexes in PostgreSQL.',
                'content': """# Optimizing PostgreSQL Queries in Django REST Framework

When building high-throughput APIs in Django, database query performance is almost always the primary bottleneck.

## 1. Diagnosing N+1 Queries
Using `django-debug-toolbar` or `connection.queries`, identify serializer fields causing secondary queries per row.

## 2. Leverage select_related & prefetch_related
- `select_related()` for `ForeignKey` and `OneToOne` relationships (performs SQL `JOIN`).
- `prefetch_related()` for `ManyToMany` and reverse foreign keys (executes separate batched `IN` queries).

## 3. Adding Composite B-Tree Indexes
Create composite indexes on columns filtered or sorted together:

```python
class Meta:
    indexes = [
        models.Index(fields=['status', 'created_at']),
    ]
```
""",
                'author_name': 'Manoj Khatri',
                'author_role': 'Backend Software Engineer',
                'read_time_minutes': 6,
                'tags_list': ['Django', 'PostgreSQL', 'Performance']
            }
        )
        article.tags.set([tag_django, tag_postgres, tag_performance])

    def seed_resume(self):
        ResumeDataRecord.objects.update_or_create(
            id='00000000-0000-0000-0000-000000000001',
            defaults={
                'version_tag': 'Production-2026',
                'target_headline': 'Backend Software Engineer (Python / Django / PostgreSQL)',
                'summary_text': 'Backend Software Engineer specializing in Python, Django REST Framework, PostgreSQL optimization, and secure API architectures.',
                'resume_url': '/resume.pdf',
                'file_name': 'Manoj_KC_Backend_Resume.pdf',
                'customization': {
                    'templateStyle': 'modern-tech',
                    'fontFamily': 'sans',
                    'accentColor': 'indigo',
                    'spacingDensity': 'standard',
                    'paperFormat': 'a4',
                    'pageLayout': 'single-page',
                },
                'sections_data': [
                    {
                        'id': 'sec-exp',
                        'title': 'Experience',
                        'category': 'experience',
                        'items': [
                            {
                                'id': 'item-sajha',
                                'title': 'Backend Developer Intern',
                                'subtitle': 'Sajha Infotech · Kathmandu, Nepal',
                                'period': 'Jul 2024 – Dec 2024',
                                'bullets': [
                                    'Built Django REST Framework APIs for student management.',
                                    'Optimized PostgreSQL queries, improving average response time by ~30%.'
                                ]
                            }
                        ]
                    }
                ],
                'is_active': True
            }
        )

    def seed_inquiries(self):
        Inquiry.objects.update_or_create(
            id='00000000-0000-0000-0000-000000000010',
            defaults={
                'name': 'Aarav Sharma',
                'email': 'aarav.sharma@techfin.np',
                'company': 'TechFin Nepal',
                'phone': '+977 9801234567',
                'has_whatsapp': True,
                'scope_title': 'Senior Django Backend Engineer Role',
                'budget_range': 'Full-time / Hybrid',
                'timeline': 'Immediate',
                'message': 'Hi Manoj, I reviewed your Django REST API and Agritech portfolio project. We are looking for a Senior Django Backend Engineer for our fintech team in Kathmandu. Would you be open for an introductory call this week?',
                'status': 'New',
                'read': False,
                'replied': False,
                'project_id': 'agritech',
                'project_title': 'Agritech | Agriculture Marketplace Platform',
                'source_page': 'https://manojkc1.com.np/projects/agritech',
            }
        )
