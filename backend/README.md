# Manoj KC Portfolio — Django REST Framework Backend

Production-ready backend API service for Manoj Khatri's engineering portfolio.

## Technology Stack

* **Language / Runtime**: Python 3.12+
* **Framework**: Django 5.1+ & Django REST Framework 3.15+
* **Database**: PostgreSQL 16 (with SQLite3 fallback for local testing)
* **CORS**: `django-cors-headers` with strict origin whitelisting
* **Static Assets**: WhiteNoise (Compressed & Manifest caching)
* **Testing**: `pytest` & `pytest-django`
* **WSGI Server**: Gunicorn

---

## Getting Started

### 1. Prerequisites

Ensure Python 3.12+ is installed on your system:
```bash
python3.12 --version
```

### 2. Environment Setup

Create and activate a virtual environment:
```bash
cd backend
python3.12 -m venv .venv
source .venv/bin/activate
```

Install locked project dependencies:
```bash
pip install -r requirements.txt
```

### 3. Environment Configuration

Copy the sample environment configuration:
```bash
cp .env.example .env
```

Key environment variables:
| Variable | Description | Default |
|---|---|---|
| `DJANGO_SETTINGS_MODULE` | Active settings module | `core.settings.development` |
| `DJANGO_SECRET_KEY` | Cryptographic secret key | Auto-configured for dev |
| `DJANGO_DEBUG` | Debug mode | `True` (dev) / `False` (prod) |
| `DATABASE_URL` | PostgreSQL connection URL | `sqlite:///db.sqlite3` fallback |
| `CORS_ALLOWED_ORIGINS` | Comma-separated frontend origins | `http://localhost:3000,http://127.0.0.1:3000,https://manojkc1.com.np` |

---

## Database & Migrations

Apply database schema migrations:
```bash
python manage.py migrate
```

Create a superuser for admin access:
```bash
python manage.py createsuperuser
```

---

## Running the Development Server

Start the local Django REST API server on port 8000:
```bash
python manage.py runserver 0.0.0.0:8000
```

Verify the health check endpoint:
```bash
curl http://127.0.0.1:8000/api/v1/health/
# Response: {"status": "ok"}
```

---

## Running Automated Tests

Run test suites using `pytest`:
```bash
pytest
```

Or using Django's native test runner:
```bash
python manage.py test apps.core_api
```

---

## Settings Structure

```text
backend/core/settings/
├── __init__.py
├── base.py          # Shared baseline settings, apps, middleware, CORS, DRF
├── development.py   # Development-specific overrides (DEBUG=True, Browsable API)
└── production.py    # Production-specific overrides (DEBUG=False, Security Headers, SSL)
```

To switch to production settings:
```bash
export DJANGO_SETTINGS_MODULE=core.settings.production
```

---

## API Versioning

All API routes follow the `/api/v1/` prefix convention.

* **Health Check**: `GET /api/v1/health/`
* **Admin Portal**: `/admin/`
