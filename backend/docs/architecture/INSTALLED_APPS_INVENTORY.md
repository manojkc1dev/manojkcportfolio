# Backend INSTALLED_APPS Inventory

**Last updated:** Phase 2C cleanup
**Total local apps:** 36
**Status:** Active — apps/authentication removed as orphaned

## Foundation Apps (KEEP)

| App | Purpose | Models | Notes |
|---|---|---|---|
| `core` | Base classes, middleware, permissions, AuditLog | `BaseModel`, `SoftDeleteModel`, `StatusModel`, `OrderableModel`, `SEOModel`, `AuditLog` | Every other app depends on `core` |
| `accounts` | Custom User, RBAC, JWT auth flows | `User` (extends AbstractUser) | Authoritative for auth |
| `api` | URL routers only (no models) | — | Contains `api/v1/` and `api/admin/` |

## Content — Profile Sections (KEEP)

| App | Purpose |
|---|---|
| `hero` | Homepage hero (singleton) |
| `about` | About section (singleton) |
| `resume` | Resume file + metadata (singleton) |
| `skills` | Skills list |
| `techstack` | Tech stack items |
| `experience` | Work experience |
| `education` | Education history |
| `certifications` | Certifications |
| `achievements` | Awards/achievements |
| `timeline` | Career timeline |

## Projects Domain (KEEP, consolidation candidate)

| App | Purpose |
|---|---|
| `projects` | Main Project model |
| `project_categories` | Project categories |
| `project_images` | Project images |
| `project_gallery` | Project galleries |
| `project_videos` | Project videos |
| `project_features` | Project feature lists |
| `project_technologies` | Project → tech mappings |

## Blog & Publishing (KEEP)

| App | Purpose |
|---|---|
| `blogs` | Blog posts |
| `faqs` | FAQ entries |
| `testimonials` | Testimonials |
| `clients` | Client records |
| `services` | Services offered |

## Communication (KEEP)

| App | Purpose |
|---|---|
| `contact` | Contact form submissions |
| `newsletter` | Newsletter subscribers |
| `notifications` | System notifications |

## Meta & Ops (KEEP)

| App | Purpose |
|---|---|
| `analytics` | Site analytics data |
| `dashboard` | Dashboard aggregate endpoints |
| `seo` | Site-wide SEO config (singleton) |
| `search` | Full-text search endpoints |
| `audit_logs` | Audit log views (wraps `core.AuditLog`) |

## Utilities (KEEP)

| App | Purpose |
|---|---|
| `media` | Media file records |
| `settings` | Site settings (singleton) |
| `socials` | Social links |
| `github` | GitHub integration |

## Removed

| App | Reason |
|---|---|
| `authentication` | Orphaned — URLs never mounted; all auth handled by `accounts` |

## Consolidation Targets (FUTURE, not this sprint)

If consolidating to ~8 apps later:

- `accounts` ← accounts + audit_logs
- `content` ← hero + about + skills + techstack + experience + education + certifications + achievements + timeline + resume
- `projects` ← projects + project_* (7 apps)
- `blog` ← blogs + faqs + testimonials + clients + services
- `inbox` ← contact + newsletter + notifications
- `analytics` ← analytics + dashboard + seo + search
- `core` ← media + settings + socials + github + core
- `api` ← routers only

**DO NOT execute this consolidation without a dedicated sprint and test coverage.**
