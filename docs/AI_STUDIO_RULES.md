# AI Studio Rules — PortfolioCMS Constitution

**Read this before generating or modifying ANY code.**

## Project Identity

This is an existing production-oriented **PortfolioCMS**:
- Django + DRF + PostgreSQL + Redis + Celery backend
- Two React frontends: Public Portfolio + Admin CMS
- Single-owner portfolio with admin panel

**This is NOT a greenfield project. Do not rebuild anything.**

---

## Hard Constraints (Violating These Breaks the App)

### DO NOT
- Rebuild the application from scratch
- Replace Django/DRF with Firebase, Supabase, Node, or any other stack
- Replace PostgreSQL with SQLite, MySQL, or MongoDB
- Remove or rename existing backend apps
- Remove existing REST API endpoints
- Create duplicate apps, components, services, or routers
- Delete files unless proven unused
- Introduce mock data (mock data was removed in Phase 2C)
- Use `localStorage` as source of truth for CMS data
- Invent API endpoints that don't exist in `apps/*/urls.py`
- Add new top-level apps without explicit approval
- Merge existing Django apps without a dedicated refactor sprint

### MUST
- Treat the **GitHub repository as the single source of truth**
- Treat the **Django backend as authoritative** for:
  - business logic
  - authentication
  - authorization (RBAC)
  - CMS data persistence
  - audit logging
- The React frontends **consume** the existing Django REST API
- Both frontend surfaces must remain functional:
  1. Public Portfolio (`frontend/`)
  2. Admin CMS (`admin-frontend/`)
- Enforce RBAC on the **backend**, not by hiding buttons in React
- Follow existing patterns (see `INSTALLED_APPS_INVENTORY.md`)

---

## Architecture (Do Not Change Without Approval)


---

## Stack (Locked)

**Backend:**
- Django 5.2
- Django REST Framework 3.18
- djangorestframework-simplejwt 5.5
- PostgreSQL (via `DATABASE_URL`)
- Redis (via `REDIS_URL`)
- Celery + django-celery-beat + django-celery-results
- drf-spectacular (OpenAPI)
- django-cors-headers
- whitenoise (static files)
- cloudinary (media storage)

**Frontend:**
- React 18
- TypeScript 5
- Vite 6
- Tailwind CSS
- Axios
- React Router

---

## Authentication

- JWT via `djangorestframework-simplejwt`
- Custom user model: `apps.accounts.User`
- Roles: `super_admin`, `admin`, `editor`, `content_manager`, `viewer`
- Login: `POST /api/v1/auth/login/`
- Refresh: `POST /api/v1/auth/refresh/`
- Register: `POST /api/v1/auth/register/`
- Logout: `POST /api/v1/auth/logout/`
- Password reset + email verification: via Celery + SMTP

**JWT storage:** ⚠️ Currently `localStorage`. Must move to httpOnly cookies (Phase 2B fix, pending).

---

## API Structure

- **Public API:** `/api/v1/*`
- **Admin API:** `/api/v1/admin/*`
- **Swagger:** `/api/docs/`
- **ReDoc:** `/api/redoc/`
- **Schema:** `/api/schema/`
- **Django admin:** `/dj-admin-cc/` (obscured path)

⚠️ Known issue: `/api/v1/admin/*` currently re-includes the same views as `/api/v1/*`. Fix is pending.

---

## Content Model Conventions

- All content models extend `core.BaseModel` (adds `created_at`, `updated_at`)
- Publishing uses `core.StatusModel` → `status` field (`draft` | `published`)
- Ordering uses `core.OrderableModel` → `order` field
- SEO uses `core.SEOModel` → `meta_title`, `meta_description`, etc.
- Soft delete uses `core.SoftDeleteModel` → `is_deleted` field
- **Public API MUST filter `status='published'` and `is_deleted=False`**

---

## Async Tasks (Celery)

- Email sending (verification, password reset, contact reply)
- Dashboard daily snapshot
- Any task > 500ms must be a Celery task

Do not call external APIs synchronously in request handlers.

---

## Code Style

**Backend:**
- Black (line length 100)
- isort
- flake8
- Type hints on function signatures
- Docstrings on public methods

**Frontend:**
- Prettier
- ESLint
- Functional components + hooks
- No class components
- No `any` without justification

---

## Before Generating Code

Ask yourself:
1. Does this file already exist?
2. Does this endpoint already exist in `apps/*/urls.py`?
3. Does this model already exist in `apps/*/models.py`?
4. Am I following the existing pattern, or inventing a new one?
5. Will this break the public frontend, admin frontend, or both?

If unsure, **ASK** before generating.

---

## When in Doubt

- Read `docs/architecture/INSTALLED_APPS_INVENTORY.md`
- Read `docs/architecture/API_ENDPOINT_MAP.md`
- Inspect the existing file before creating a new one
- Match the surrounding code style

---

## Phase Status

| Phase | Status |
|---|---|
| Phase 1A — Contact Reply Email | ✅ Done |
| Phase 1B — Auth & Account Security | ✅ Done |
| Phase 2A — CMS Data Flow Migration | ✅ Done |
| Phase 2B — CMS/Security Verification Audit | ✅ Done (3 fixes pending) |
| Phase 2C — Cleanup & Hardening | 🟡 In progress |
| Phase 3 — New Features | ⏸ Not started |

**Do not jump to Phase 3 until Phase 2C is merged.**
