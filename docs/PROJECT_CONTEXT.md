# PortfolioCMS — Project Context

## What This Project Is

A single-owner portfolio website + content management system.

**Three surfaces:**
1. **Public Portfolio** (`frontend/`) — What visitors see
2. **Admin CMS** (`admin-frontend/`) — Owner's dashboard
3. **Backend API** (`backend/`) — Django REST Framework

## Who Uses It

- **Public visitor** — reads portfolio, submits contact form
- **Owner (super_admin)** — manages all content via admin frontend
- **Editor/Viewer** — future roles with limited access

## Core Features

### Public
- Hero, About, Projects, Skills, Tech Stack
- Experience, Education, Certifications
- Blog, Testimonials, Services, FAQs
- Contact form + Newsletter subscribe
- Resume download

### Admin
- Dashboard with analytics
- CRUD for every content type
- Contact inbox + reply via email
- Media library
- SEO configuration
- User management
- Audit logs
- Site settings

## Tech Stack

See `AI_STUDIO_RULES.md`.

## Repository Layout


## Development Workflow


## Deployment

- **Backend:** Gunicorn + WhiteNoise behind Nginx
- **Database:** PostgreSQL
- **Cache:** Redis
- **Background jobs:** Celery worker + Celery beat
- **Media:** Cloudinary
- **Frontend:** Static build (Vite)

## Environment Variables

Backend `.env`:

Frontend `.env`:

## Current Phase

**Phase 2C — Cleanup & Hardening** (in progress)

Completed:
- Frontend mock data removed
- Single Axios client per frontend
- CMSContext fully API-driven
- Orphaned `apps/authentication` deleted
- Docs folder restructured

Remaining (before Phase 3):
- Fix `api/admin/` duplicate router
- Fix draft content exposure
- Move JWT off localStorage
- Full regression test pass
- Tag `phase-2c-baseline`
