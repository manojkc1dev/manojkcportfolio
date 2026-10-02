# Portfolio Migration Implementation Plan: React Frontend to Django REST Backend

## 1. Current Architecture

### 1.1 Overview
The current system is a production single-page application (SPA) built with **React 19, TypeScript, and Vite**, styled using Tailwind CSS, and animated with `motion/react`. The application showcases software engineering case studies, interactive ATS resume tools, technical skills, and experience milestones.

```mermaid
graph TD
    Client[Browser Client - React 19 / Vite]
    Client -->|Local State & Mock Defaults| LocalStore[(LocalStorage / In-Memory Mock)]
    Client -->|Optional Direct Calls| ViteDevAPI[Vite Dev Middleware /api/*]
    Client -->|Optional Legacy Auth & DB| Firebase[Firebase Auth / Firestore]
```

### 1.2 Routing Catalog
The application exposes 10 public routes and 10 administrative aliases:

| Route Path | View / Component | Purpose / Access |
|---|---|---|
| `/` | `HomePage` | Hero, stats, featured projects, skills preview, contact |
| `/projects` | `ProjectsPage` | Searchable, categorised portfolio projects catalog |
| `/projects/:slug` | `ProjectCaseStudyPage` | Deep-dive case studies with Mermaid diagrams & metrics |
| `/skills` | `SkillsPage` | Grouped proficiency matrices and current tech focus |
| `/experience` | `ExperiencePage` | Career timeline, achievements, and tech stacks |
| `/uses` | `UsesPage` | Hardware, software, backend tools, and workstation spec |
| `/writing` | `WritingPage` | Technical blog index with tags and search |
| `/writing/:slug` | `WritingPostPage` | Markdown article reader with reading time estimation |
| `/resume` | `ResumePublicPage (type="resume")` | ATS resume preview, export, and download |
| `/cv` | `ResumePublicPage (type="cv")` | Full curriculum vitae view |
| `/admin`, `/admin/login`, `/admin/console`, `/admin/portal`, `/admin/resume`, `/mk-admin`, `/mkc-admin`, `/mk-zadmin-cc`, `/mkc-zadmin-cc`, `/lc-zadmin-cc` | `AdminPortal` | Back-office CMS: Projects, Skills, Experience, Inquiries, Services, Blog, Resume ATS Studio, Site Settings, Security |

### 1.3 Current Data & Authentication Sources
1. **Mock Data Layer**: Hardcoded in `src/data/*` (`projects.ts`, `skills.ts`, `experience.ts`, `profile.ts`, `uses.ts`, `writing.ts`, `currentlyBuilding.ts`) and `src/pages/admin/mockData.ts`.
2. **Vite Local Middleware**: In-memory and `.data/messages.json` file handler for `/api/contact`, `/api/messages`, `/api/upload-resume`, and `/api/active-resume`.
3. **Firebase Client SDK (`src/firebase.ts`)**: Optional fallback for authentication and Firestore persistence.
4. **Client-side LocalStorage**: Keys `portfolio_django_access_token`, `portfolio_inquiries`, `admin_cms_inquiries`, `portfolio_theme`, `active_resume_data`.

---

## 2. Target Architecture

The target architecture decouples presentation from data persistence via a clean, production-ready Django REST Framework backend deployed with PostgreSQL 16, Redis 7, Celery, and SimpleJWT.

```mermaid
graph TD
    ReactSPA[React 19 + TypeScript Frontend]
    Nginx[Reverse Proxy / SSL / Nginx / Cloudflare]
    DjangoWSGI[Django 5.x REST Framework API]
    PG[(PostgreSQL 16 Database)]
    Redis[(Redis 7 Cache / Broker)]
    CeleryWorkers[Celery Worker Cluster]
    SMTP[Transactional Email / SMTP Service]

    ReactSPA -->|HTTPS / JSON API Requests| Nginx
    Nginx -->|Proxy Pass /api/*| DjangoWSGI
    DjangoWSGI -->|ORM Queries & Constraints| PG
    DjangoWSGI -->|Token Blacklist / Response Cache| Redis
    DjangoWSGI -->|Enqueue Async Jobs| Redis
    Redis -->|Consume Task Queues| CeleryWorkers
    CeleryWorkers -->|Send Notification Emails| SMTP
```

### 2.1 Backend Technology Stack
* **Language & Runtime**: Python 3.12
* **Framework**: Django 5.x + Django REST Framework (DRF) 3.15+
* **Authentication**: DRF SimpleJWT (JSON Web Tokens with refresh token rotation and blacklisting)
* **Primary Database**: PostgreSQL 16 (with relational constraints, foreign keys, and indexes)
* **Caching & Message Broker**: Redis 7.x
* **Background Worker**: Celery 5.4+ (for asynchronous email dispatch, sitemap pinging, and audit logging)
* **WSGI / ASGI Server**: Gunicorn + Uvicorn workers
* **Static / Media Storage**: WhiteNoise / Local Storage / S3-compatible storage for resume PDFs

---

## 3. Firebase/Mock/Local-Data → Django REST Migration Map

| Current Source | Current Target Key / Path | Target Django REST Endpoint | Target App / Model | HTTP Method |
|---|---|---|---|---|
| `src/data/projects.ts` & Mock CMS | In-Memory / `initialProjects` | `/api/v1/projects/` | `portfolio.Project` | `GET` (Public) |
| `src/data/projects.ts` | Slug lookup | `/api/v1/projects/{slug}/` | `portfolio.Project` | `GET` (Public) |
| `src/pages/admin/views/ProjectsView.tsx` | Local State / Firestore | `/api/v1/admin/projects/` | `portfolio.Project` | `GET, POST` (Admin) |
| `src/pages/admin/views/ProjectsView.tsx` | Local State / Firestore | `/api/v1/admin/projects/{id}/` | `portfolio.Project` | `PUT, PATCH, DELETE` (Admin) |
| `src/data/skills.ts` | In-Memory / `skills` | `/api/v1/skills/` | `skills.SkillCategory` | `GET` (Public) |
| `src/pages/admin/views/SkillsView.tsx` | Local State | `/api/v1/admin/skills/` | `skills.SkillItem` | `GET, POST, PUT, DELETE` (Admin) |
| `src/data/experience.ts` | In-Memory / `experience` | `/api/v1/experience/` | `experience.Experience` | `GET` (Public) |
| `src/pages/admin/views/ExperienceView.tsx` | Local State | `/api/v1/admin/experience/` | `experience.Experience` | `GET, POST, PUT, DELETE` (Admin) |
| `src/data/profile.ts` & Mock CMS | `profile` & `initialSiteContent` | `/api/v1/site/profile/` | `siteconfig.SiteProfile` | `GET` (Public) |
| `src/pages/admin/views/AboutView.tsx` | Local State | `/api/v1/admin/site/profile/` | `siteconfig.SiteProfile` | `PUT, PATCH` (Admin) |
| `src/components/Contact.tsx` | Vite `/api/contact` | `/api/v1/contact/` | `inquiries.Inquiry` | `POST` (Public) |
| `src/pages/admin/views/InquiriesView.tsx` | Vite `/api/messages` | `/api/v1/admin/inquiries/` | `inquiries.Inquiry` | `GET, POST` (Admin) |
| `src/pages/admin/views/InquiriesView.tsx` | Vite `/api/messages` | `/api/v1/admin/inquiries/{id}/` | `inquiries.Inquiry` | `PATCH, DELETE` (Admin) |
| `src/data/writing.ts` | `posts` | `/api/v1/articles/` | `blog.Article` | `GET` (Public) |
| `src/pages/admin/views/BlogView.tsx` | Local State | `/api/v1/admin/articles/` | `blog.Article` | `GET, POST, PUT, DELETE` (Admin) |
| `src/pages/admin/views/ServicesView.tsx` | Local State | `/api/v1/services/` | `services.Service` | `GET` (Public) |
| `src/pages/admin/views/ServicesView.tsx` | Local State | `/api/v1/admin/services/` | `services.Service` | `GET, POST, PUT, DELETE` (Admin) |
| `src/pages/admin/resume/*` | Vite `/api/upload-resume` | `/api/v1/admin/resume/upload/` | `resume.ResumeDocument` | `POST, DELETE` (Admin) |
| `src/pages/ResumePublicPage.tsx` | Vite `/api/active-resume` | `/api/v1/resume/active/` | `resume.ResumeDocument` | `GET` (Public stream) |
| `src/pages/admin/resume/*` | `localStorage: active_resume_data` | `/api/v1/resume/data/` | `resume.ResumeDataRecord` | `GET, PUT` (Public/Admin) |
| `src/firebase.ts` (Auth) | Firebase Auth SDK | `/api/v1/auth/token/` | `django.contrib.auth` (JWT) | `POST` (Public Auth) |
| `src/firebase.ts` (Token Refresh) | Firebase Refresh | `/api/v1/auth/token/refresh/` | `rest_framework_simplejwt` | `POST` (Public Auth) |
| `src/firebase.ts` (Password Change) | Firebase Reauth/Update | `/api/v1/auth/change-password/` | `authentication.User` | `POST` (Auth Required) |

---

## 4. Entity & Data Model Map

### 4.1 Django Apps Breakdown
The Django project will be structured into modular applications following single-responsibility principles:
1. `authentication` — Custom user model, token claims, security auditing, password change.
2. `portfolio` — Projects, metrics, challenges, tech choices, proof badges.
3. `skills` — Skill categories, skill items, proficiency levels.
4. `experience` — Professional experiences, milestones, education.
5. `inquiries` — Contact submissions, status workflows, honeypot detection, project tagging.
6. `blog` — Technical articles, tags, markdown storage.
7. `services` — Service catalog, offerings, deliverables.
8. `resume` — Resume metadata, sections, items, ATS customizations, active PDF streaming.
9. `siteconfig` — Site profile, stats, social links, uses items, currently building items.

### 4.2 Entity Relational Schema

```mermaid
erDiagram
    User ||--o{ SecurityLog : "triggers"
    Project ||--o{ ProjectMetric : "has"
    Project ||--o{ ProjectChallenge : "has"
    Project ||--o{ TechChoice : "has"
    Project ||--o{ Inquiry : "tagged in"
    SkillCategory ||--o{ SkillItem : "contains"
    ResumeDataRecord ||--o{ ResumeSection : "contains"
    ResumeSection ||--o{ ResumeItem : "contains"
    Article }|--|{ ArticleTag : "tagged with"
    SiteProfile ||--o{ ProfileStat : "has"
    SiteProfile ||--o{ SocialLink : "has"
    UseCategory ||--o{ UseItem : "contains"
```

---

## 5. API Dependency Graph

```mermaid
graph LR
    subgraph Public Endpoints
        E1[POST /api/v1/contact/]
        E2[GET /api/v1/projects/]
        E3[GET /api/v1/projects/:slug/]
        E4[GET /api/v1/skills/]
        E5[GET /api/v1/experience/]
        E6[GET /api/v1/articles/]
        E7[GET /api/v1/articles/:slug/]
        E8[GET /api/v1/resume/active/]
        E9[GET /api/v1/resume/data/]
        E10[GET /api/v1/site/profile/]
        E11[GET /api/v1/site/uses/]
    end

    subgraph Auth Endpoints
        A1[POST /api/v1/auth/token/]
        A2[POST /api/v1/auth/token/refresh/]
        A3[POST /api/v1/auth/change-password/]
    end

    subgraph Admin Endpoints (IsAdminUser)
        M1[CRUD /api/v1/admin/projects/]
        M2[CRUD /api/v1/admin/skills/]
        M3[CRUD /api/v1/admin/experience/]
        M4[CRUD /api/v1/admin/inquiries/]
        M5[CRUD /api/v1/admin/articles/]
        M6[CRUD /api/v1/admin/services/]
        M7[PUT /api/v1/admin/site/profile/]
        M8[POST /api/v1/admin/resume/upload/]
    end

    E1 -->|Enqueues Task| CeleryEmail[Celery Task: notify_admin_inquiry]
    A1 -->|Issues JWT| ReactState[React Auth State]
    ReactState -->|Bearer Token Header| M1 & M2 & M3 & M4 & M5 & M6 & M7 & M8 & A3
```

---

## 6. Authentication Architecture

### 6.1 Token Lifecycle & Security
1. **Access Token**: Short-lived (15 minutes), HMAC-SHA256 signed JWT containing `user_id`, `username`, `email`, `is_staff`, `is_superuser`.
2. **Refresh Token**: Long-lived (7 days), stored securely, rotating on each refresh request with old tokens blacklisted in Redis / DB.
3. **Authorization**:
   - `AllowAny`: Public read-only endpoints and contact form submission.
   - `IsAuthenticated & IsAdminUser`: Administrative CMS CRUD operations, inquiry management, and password updates.
4. **Password Reset / Change**:
   - Requires verified old password re-authentication.
   - Enforces minimum 8 characters, complex character rules, and validation via Django `django.contrib.auth.password_validation`.

---

## 7. PostgreSQL Architecture

### 7.1 Key Table Specifications
* `portfolio_project`:
  - `id`: Slug / UUID primary key, `title`, `tagline`, `description`, `category`, `status`, `visibility`, `featured`, `year`, `image`, `architecture` (Mermaid text), `role`, `duration`, `problem`, `solution`, `live_url`, `github_url`, `case_study_url`, `api_docs_url`, `created_at`, `updated_at`.
  - Indexes: `db_index=True` on `slug`, `category`, `status`, `visibility`, `featured`.
* `inquiries_inquiry`:
  - `id`: UUID primary key, `name`, `email`, `message`, `company`, `phone`, `has_whatsapp`, `scope_title`, `budget_range`, `timeline`, `status` (`New`, `In Progress`, `Closed`, `Won`), `read`, `replied`, `project_id` (ForeignKey to `Project`, nullable), `created_at`.
  - Indexes: `db_index=True` on `created_at`, `status`, `read`.
* `skills_skillcategory` & `skills_skillitem`:
  - Relational grouping with order weights and proficiency levels (`learning`, `intermediate`, `advanced`, `expert`).
* `resume_resumedata` & `resume_resumedocument`:
  - Binary file storage reference for PDF resumes, with MIME type and active flags; JSONB / structured tables for ATS section builder.

---

## 8. Redis Architecture

1. **Caching Tier**:
   - Cache key format: `portfolio:cache:v1:<model_name>:<identifier>`
   - Public listing endpoints (Projects, Skills, Experience, Articles) cached with 1-hour TTL.
   - Automatic cache invalidation on Django `post_save` and `post_delete` signals.
2. **SimpleJWT Blacklist**:
   - Redis token store for fast revocation checks during request authentication.
3. **Celery Broker & Result Backend**:
   - Dedicated Redis DB `redis://127.0.0.1:6379/1` for task broker, `redis://127.0.0.1:6379/2` for task results.

---

## 9. Celery Architecture

### 9.1 Background Tasks
1. `inquiries.tasks.send_inquiry_notification_email`:
   - Enqueued on new contact submission.
   - Sends transactional alert to site administrator (`manojkc1dev@gmail.com`) and confirmation email to inquirer.
   - Retry policy: Exponential backoff (max 3 retries: 30s, 120s, 600s).
2. `siteconfig.tasks.ping_search_engines_sitemap`:
   - Pings IndexNow / Google Search Console when new case studies or articles are published.
3. `authentication.tasks.log_security_audit_event`:
   - Asynchronously logs failed login attempts, admin password modifications, and security anomalies.

---

## 10. Frontend Integration Strategy

### 10.1 Preserving UI/UX & Fallback Safety
1. **Zero Breaking Changes**: All DRF serializers will output camelCase responses matching exact TypeScript interfaces in `src/types.ts` and `src/pages/admin/types.ts`.
2. **API Client Layer**:
   - Centralize network requests in `src/lib/djangoApi.ts` and `src/lib/apiClient.ts`.
   - Implement transparent JWT refresh interceptor for 401 Unauthorized responses.
3. **Dual-Mode Offline Fallback**:
   - If `VITE_DJANGO_API_URL` is unavailable or returns network error, gracefully fall back to local mock data and `localStorage` so the portfolio remains 100% operational offline.

---

## 11. Environment Configuration

### Frontend (`.env`)
```env
VITE_DJANGO_API_URL=http://127.0.0.1:8000
VITE_SITE_URL=http://localhost:3000
VITE_ENABLE_ANALYTICS=false
```

### Backend (`backend/.env`)
```env
DJANGO_SECRET_KEY=production-crypto-random-secret
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=api.manojkc1.com.np,localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=https://manojkc1.com.np,http://localhost:3000,http://127.0.0.1:3000

DATABASE_URL=postgres://portfolio_user:password@localhost:5432/portfolio_db
REDIS_URL=redis://localhost:6379/0
CELERY_BROKER_URL=redis://localhost:6379/1
CELERY_RESULT_BACKEND=redis://localhost:6379/2

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=manojkc1dev@gmail.com
EMAIL_HOST_PASSWORD=app-specific-secure-password
DEFAULT_FROM_EMAIL="Manoj KC Portfolio <manojkc1dev@gmail.com>"
ADMIN_EMAIL=manojkc1dev@gmail.com
```

---

## 12. CORS Strategy

Configured via `django-cors-headers`:
- Explicit whitelist matching production domain (`https://manojkc1.com.np`) and local dev servers (`http://localhost:3000`, `http://127.0.0.1:3000`).
- Strict headers allowed: `Authorization`, `Content-Type`, `Accept`, `X-CSRFToken`.
- `CORS_ALLOW_CREDENTIALS = True`.
- `CORS_ALLOW_ALL_ORIGINS = False` (Wildcards prohibited in production).

---

## 13. Development Environment

- **Python Virtual Environment**: Dedicated `.venv` inside `backend/`.
- **Package Management**: `requirements.txt` with locked versions.
- **Local Services**: PostgreSQL and Redis running locally or via lightweight Docker Compose for testing.
- **Concurrent Dev Execution**: Vite frontend running on port `3000`, Django running on port `8000`.

---

## 14. Testing Strategy

1. **Frontend Vitest Suite**: Maintain all 57 existing automated tests passing (`npm test`).
2. **Django Backend Test Suite**:
   - Unit tests for models, managers, and constraints using `django.test.TestCase` / `pytest-django`.
   - API contract tests for all public & admin endpoints using DRF `APIClient`.
   - Authentication tests: Token issuance, invalid credentials, token refresh, password validation, blacklisting.
   - Inquiry pipeline tests: Honeypot rejection, valid submissions, database persistence, Celery task invocation.
3. **Target Test Coverage**: Minimum 90% coverage across Django services and serializers.

---

## 15. Deployment Strategy

```mermaid
graph TD
    subgraph Cloud Infrastructure
        Vercel[Vercel / Cloudflare Pages: React Frontend manojkc1.com.np]
        Render[Render / DigitalOcean / Cloud VPS: Django API api.manojkc1.com.np]
        ManagedPG[Managed PostgreSQL 16 Instance]
        ManagedRedis[Managed Redis 7 Cache & Broker]
    end

    Vercel -->|HTTPS API Requests| Render
    Render --> ManagedPG
    Render --> ManagedRedis
```

1. **Frontend**: Static production build deployed to Vercel / Cloudflare Pages pointing to `VITE_DJANGO_API_URL=https://api.manojkc1.com.np`.
2. **Backend**: Gunicorn WSGI application with WhiteNoise or Nginx static serving, reverse proxied with SSL termination.
3. **Worker**: Standalone Celery worker process `celery -A core worker -l info`.

---

## 16. Migration Risk Register

| Risk ID | Severity | Description | Mitigation Strategy |
|---|---|---|---|
| **RSK-01** | CRITICAL | CORS Policy Mismatches | Whitelist exact origins with `django-cors-headers`; test preflight `OPTIONS` requests. |
| **RSK-02** | HIGH | Token Expiry during Admin Editing | Implement Axios/Fetch 401 interceptor performing silent token refresh before failing. |
| **RSK-03** | HIGH | Contact Form Message Drop | Save inquiries synchronously to PostgreSQL before triggering async email dispatch; keep localStorage dual-write fallback. |
| **RSK-04** | MEDIUM | Schema Casing Discrepancies | Enforce camelCase serialization in DRF so React TypeScript types need zero refactoring. |
| **RSK-05** | MEDIUM | Resume PDF Binary Delivery | Stream active resume using Django `FileResponse` with explicit `Content-Disposition` and `application/pdf` MIME headers. |
| **RSK-06** | LOW | Celery Task Queue Latency | Synchronous DB save guarantees inquiries are never lost even if Redis/Celery is restarting. |

---

## 17. Ordered Development Phases

- **Phase 0 — Analysis, Planning & Extraction** (Completed)
- **Phase 1 — Django Foundation & Environment Setup** (Scaffold `backend/`, dependencies, settings, Redis, Celery init)
- **Phase 2 — Core Database Models & Migrations** (PostgreSQL models for Projects, Skills, Experience, Inquiries, Resume, SiteConfig)
- **Phase 3 — Authentication & Security Subsystem** (SimpleJWT endpoints, permissions, password change, audit logging)
- **Phase 4 — Public REST API Layer** (Read-only endpoints for showcase, contact form ingestion, resume streaming)
- **Phase 5 — Administrative CMS API Layer** (Protected CRUD ViewSets, inquiry management, ATS resume updates)
- **Phase 6 — React Frontend Integration** (Connect API client, JWT auth provider, offline mock fallback)
- **Phase 7 — Asynchronous Tasks & Caching** (Celery email alerts, Redis query cache, invalidation signals)
- **Phase 8 — End-to-End Testing & Verification** (Automated Django tests + 57 Vitest tests passing)
- **Phase 9 — Production Deployment & Release** (Deploy API, configure DNS, perform final sanity check)

---
