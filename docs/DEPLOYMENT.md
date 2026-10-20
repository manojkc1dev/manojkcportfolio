# Production Deployment Guide — Manoj KC Portfolio Django REST Backend

## 1. Architecture Overview

The Manoj K.C. portfolio follows a decoupled architecture:

* **Frontend**: React + TypeScript + Vite SPA deployed to **Vercel** or **Cloudflare Pages** at `https://manojkc1.com.np`.
* **Backend API**: Python 3.12 + Django REST Framework deployed to **Render**, **DigitalOcean App Platform**, or **Cloud VPS** at `https://api.manojkc1.com.np`.
* **Database**: Managed **PostgreSQL 16**.
* **Cache / Broker**: Managed **Redis 7** (for caching and asynchronous background tasks).
* **WSGI Process**: **Gunicorn** (`gthread` / `sync`) serving behind a reverse proxy (Render, Nginx, Cloudflare) with TLS termination.
* **Static Assets**: **WhiteNoise** serving compressed, hashed static files (`staticfiles/`).
* **Media Assets**: Uploaded ATS PDF resumes served securely via Django `FileResponse` and persistent storage.

```text
┌──────────────────────────────────────┐
│  React Frontend (Vercel / Cloudflare)│
│  https://manojkc1.com.np             │
└──────────────────┬───────────────────┘
                   │ HTTPS API (CORS / JWT)
                   ▼
┌──────────────────────────────────────┐
│  TLS Termination / Reverse Proxy     │
│  (Render / Cloudflare / Nginx)       │
└──────────────────┬───────────────────┘
                   │ X-Forwarded-Proto: https
                   ▼
┌──────────────────────────────────────┐
│  Gunicorn WSGI Server (:8000)        │
│  gunicorn --config gunicorn.conf.py  │
│  core.wsgi:application               │
├──────────────────────────────────────┤
│  Django 5.1 REST API Backend         │
│  ├─ WhiteNoise (staticfiles)         │
│  ├─ Apps (Portfolio, Auth, Inquiries)│
│  └─ Health checks (/health/, /healthz)│
└──────────┬───────────────────┬───────┘
           │                   │
           ▼                   ▼
┌─────────────────────┐ ┌──────────────┐
│ Managed PostgreSQL  │ │ Managed Redis│
└─────────────────────┘ └──────────────┘
```

---

## 2. Process Startup & WSGI Execution

The backend includes a production-tuned Gunicorn configuration in [`backend/gunicorn.conf.py`](file:///Users/manojk.c./Desktop/workspace/my-portfolio/manojkcportfolio/backend/gunicorn.conf.py).

### Command-Line Execution

```bash
cd backend
gunicorn --config gunicorn.conf.py core.wsgi:application
```

### PaaS Procfile

For platforms supporting Procfiles (Render, Railway, Heroku, DigitalOcean):

```procfile
web: gunicorn --config gunicorn.conf.py core.wsgi:application
```

### Configuration Variables

| Variable | Default | Purpose |
| :--- | :--- | :--- |
| `PORT` | `8000` | Port passed by PaaS orchestrators (Render, Heroku) |
| `GUNICORN_HOST` | `0.0.0.0` | Bind IP address |
| `GUNICORN_WORKERS` | `3` (or 2×CPU) | Number of worker processes |
| `GUNICORN_THREADS` | `2` | Number of threads per worker (`gthread` worker class) |
| `GUNICORN_TIMEOUT` | `60` | Worker timeout in seconds |
| `GUNICORN_MAX_REQUESTS` | `1000` | Automatic worker recycling to prevent memory leaks |
| `GUNICORN_LOGLEVEL` | `info` | Gunicorn logging verbosity |

---

## 3. Static & Media Asset Strategy

### Static Files (WhiteNoise)

Static assets (Django Admin CSS/JS, REST framework assets) are collected and served via WhiteNoise:

```bash
python manage.py collectstatic --noinput --settings=core.settings.production
```

* **Storage**: `whitenoise.storage.CompressedManifestStaticFilesStorage` via Django 5.1 `STORAGES['staticfiles']`.
* **Caching**: Far-future (`Cache-Control: max-age=31536000, public, immutable`) headers for manifest-hashed files.
* **Non-hashed Assets**: Configured via `WHITENOISE_MAX_AGE` (default `3600` seconds).

### Media Files (Resumes & Uploads)

* **Resume Serving**: PDF resumes are stored in `MEDIA_ROOT` (`backend/media/resumes/`) and streamed via the authenticated/public endpoint [`ResumeDownloadView`](file:///Users/manojk.c./Desktop/workspace/my-portfolio/manojkcportfolio/backend/apps/resume/views.py) at `/api/v1/resume/download/`. They are never treated as immutable static assets.
* **Local / VPS / Container Deployments**: Mount a persistent volume to `/app/media`.
* **Stateless Cloud Deployments**: If deployed to ephemeral containers without persistent disks, configure S3-compatible storage (e.g. Cloudflare R2, AWS S3, MinIO) by setting custom `STORAGES['default']`.
* **Development Serving**: In `DEBUG=True` mode, `backend/core/urls.py` automatically routes `MEDIA_URL` (`/media/`) to `MEDIA_ROOT`.

---

## 4. Container Deployment (Docker)

A hardened, multi-arch compatible Dockerfile is provided in [`backend/Dockerfile`](file:///Users/manojk.c./Desktop/workspace/my-portfolio/manojkcportfolio/backend/Dockerfile).

### Security & Operational Highlights

* **Base**: `python:3.12-slim` (minimal attack surface).
* **Non-Root Execution**: Runs as unprivileged `appuser:appgroup` (UID `1000`).
* **Health Check**: Automated Docker health probe checking `/health/` every 30 seconds.
* **Pre-created Directories**: `/app/staticfiles` and `/app/media` with correct permissions.
* **Caching**: Layer-cached dependency installation before copying application code.

### Build and Run

```bash
# Build the production image
docker build -t manojkc-backend:latest -f backend/Dockerfile backend

# Run the container with environment variables
docker run -d \
  -p 8000:8000 \
  -e DJANGO_SECRET_KEY="<strong-random-key>" \
  -e DJANGO_SETTINGS_MODULE="core.settings.production" \
  -e DATABASE_URL="postgres://user:pass@host:5432/db" \
  -e DJANGO_ALLOWED_HOSTS="api.manojkc1.com.np" \
  -e CORS_ALLOWED_ORIGINS="https://manojkc1.com.np" \
  -v manojkc_media:/app/media \
  --name manojkc-api \
  manojkc-backend:latest
```

---

## 5. Security & Origin Validation

All production security hardening from Phase 6A and 6B is active when `DJANGO_SETTINGS_MODULE=core.settings.production`:

1. **SECRET_KEY Validation**:
   * Startup fails fast (`ImproperlyConfigured`) if `DJANGO_SECRET_KEY` is missing, empty, or uses the insecure placeholder.
2. **CORS Hardening**:
   * Production defaults strictly to `https://manojkc1.com.np`.
   * Wildcard origin (`*`) is strictly rejected with `ImproperlyConfigured` when credentials are enabled.
3. **CSRF Protection**:
   * `CSRF_TRUSTED_ORIGINS` defaults to `https://manojkc1.com.np,https://*.manojkc1.com.np`.
   * `CSRF_COOKIE_SECURE = True` unconditionally in production.
4. **Session Security**:
   * `SESSION_COOKIE_SECURE = True` and `SESSION_COOKIE_HTTPONLY = True` unconditionally in production.
5. **HSTS (HTTP Strict Transport Security)**:
   * `SECURE_HSTS_SECONDS = 31536000` (1 year).
   * `SECURE_HSTS_INCLUDE_SUBDOMAINS = True`.
   * Preload is intentionally not enabled until the domain is manually submitted to the HSTS preload list.
6. **Reverse Proxy SSL Termination**:
   * `SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')` configured so Django recognizes HTTPS requests behind Render, Nginx, or Cloudflare.

---

## 6. Health Checks & Monitoring

The following endpoints are available for infrastructure and container probes:

* `GET /health/` — Top-level health check for reverse proxies, Docker, and load balancers. Returns `{"status": "ok"}` (HTTP 200).
* `GET /healthz/` — Top-level Kubernetes/orchestrator liveness probe. Returns `{"status": "ok"}` (HTTP 200).
* `GET /api/v1/health/` — Canonical versioned API health check. Returns `{"status": "ok"}` (HTTP 200).

---

## 7. Release Lifecycle Steps

When deploying a new release to production:

```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Collect static files for WhiteNoise
python manage.py collectstatic --noinput --settings=core.settings.production

# 3. Apply database migrations
python manage.py migrate --noinput --settings=core.settings.production

# 4. Start Gunicorn WSGI process
gunicorn --config gunicorn.conf.py core.wsgi:application
```

---

## 8. Render + Neon Deployment Architecture

### Architecture Summary

* **Frontend:** Render Static Site built from root repository via `npm install && npm run build` (publish dir: `dist`).
* **Backend:** Render Web Service built from `backend/` directory using Python runtime (or Docker) with `gunicorn.conf.py`.
* **Database:** External Neon PostgreSQL (Free Tier) connected via `DATABASE_URL` with SSL mode `require`.

### Render Blueprint Deployment (`render.yaml`)

The repository root contains [`render.yaml`](file:///Users/manojk.c./Desktop/workspace/my-portfolio/manojkcportfolio/render.yaml) preconfigured to launch both services simultaneously:

1. **New Render Account:** Log into the target Render account.
2. **Blueprints:** Click **New +** -> **Blueprint**.
3. **Connect Repository:** Select `manojkc1dev/manojkcportfolio` (branch: `feature/render-neon-deployment` or `main` after merge).
4. **Environment Parameters:**
   * `DATABASE_URL`: Paste the Neon connection string (`postgresql://USER:PASSWORD@HOST/neondb?sslmode=require`).
   * `VITE_DJANGO_API_URL`: Set to the deployed backend URL (e.g. `https://manojkc-portfolio-api.onrender.com` or custom domain).
   * `CORS_ALLOWED_ORIGINS`: Set to your frontend URLs (`https://manojkc-portfolio-frontend.onrender.com,https://manojkc1.com.np`).
   * `CSRF_TRUSTED_ORIGINS`: Set to `https://*.onrender.com,https://manojkc1.com.np`.
   * `FRONTEND_URL`: Set to the frontend static site URL.

### Manual Render Dashboard Setup (Alternative)

If setting up services individually through the Render Web UI:

#### Service 1: Django Backend Web Service
* **Type:** Web Service
* **Root Directory:** `backend`
* **Environment:** Python 3
* **Build Command:** `pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate`
* **Start Command:** `gunicorn --config gunicorn.conf.py core.wsgi:application`
* **Health Check Path:** `/health/`
* **Required Environment Variables:**
  * `DJANGO_SETTINGS_MODULE`: `core.settings.production`
  * `DJANGO_SECRET_KEY`: *(Generate a secure random string)*
  * `DJANGO_ALLOWED_HOSTS`: `api.manojkc1.com.np,.onrender.com`
  * `DATABASE_URL`: Neon PostgreSQL connection string (`?sslmode=require`)
  * `DATABASE_CONN_MAX_AGE`: `600` (or `0` for pooled endpoint)
  * `CORS_ALLOWED_ORIGINS`: Frontend URL(s)
  * `CSRF_TRUSTED_ORIGINS`: Frontend URL(s)
  * `SECURE_PROXY_SSL_HEADER`: `True`

#### Service 2: React Frontend Static Site
* **Type:** Static Site
* **Root Directory:** `.` (repository root)
* **Build Command:** `npm install && npm run build`
* **Publish Directory:** `dist`
* **Redirects / Rewrites:**
  * **Source:** `/*`
  * **Destination:** `/index.html`
  * **Action:** `Rewrite`
* **Environment Variables:**
  * `VITE_DJANGO_API_URL`: Your Render backend URL (e.g. `https://manojkc-portfolio-api.onrender.com`)
  * `VITE_SITE_URL`: Your Render frontend URL (e.g. `https://manojkc-portfolio-frontend.onrender.com`)

### Neon PostgreSQL Considerations

1. **SSL Mode:** Neon requires SSL connection (`sslmode=require`). Handled automatically by `dj-database-url`.
2. **Direct vs. Pooled Connection:**
   * Direct connection string: recommended for migrations and initial schema provisioning.
   * Pooled connection string (`-pooler` in host name): recommended for production if concurrency exceeds limits. When using the pooler, set `DATABASE_CONN_MAX_AGE=0`.
3. **Compute Suspension & Wake-Up:** Neon compute suspends when idle. Django's `conn_health_checks=True` automatically detects and re-establishes dropped connections when compute resumes.

### Media File Persistence on Render

* On Render Web Services, the root container filesystem is ephemeral and resets upon each deployment or container restart.
* The portfolio serves downloadable ATS PDF resumes via Django's streaming view (`/api/v1/resume/download/`).
* **Options for Media Persistence:**
  1. **Render Persistent Disk (Paid):** Attach a persistent disk mounted at `/app/media` (costs $0.25/GB/mo on Render paid instance types).
  2. **Free Cloud Storage:** Configure S3-compatible storage (e.g. Cloudflare R2 has a 10 GB free tier with $0 egress) via `django-storages`.
  3. **Fallback Static Resume:** When no uploaded media exists in the database, the portfolio cleanly falls back to `/public/resume.pdf` bundled into the frontend.
