"""
Production settings foundation for Manoj KC Portfolio Django REST backend.
Enforces strict security headers, SSL policies, HSTS, and disabled debugging.
"""
import os
from .base import *  # noqa: F403

DEBUG = False

# Strict production allowed hosts
ALLOWED_HOSTS = [
    host.strip()
    for host in os.getenv(
        'DJANGO_ALLOWED_HOSTS',
        'api.manojkc1.com.np'
    ).split(',')
    if host.strip()
]

# Production only outputs clean JSON
REST_FRAMEWORK['DEFAULT_RENDERER_CLASSES'] = [  # noqa: F405
    'rest_framework.renderers.JSONRenderer',
]

# ---------------------------------------------------------------------------
# Security Headers
# ---------------------------------------------------------------------------
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'

# ---------------------------------------------------------------------------
# HSTS (H1) — HTTP Strict Transport Security
# ---------------------------------------------------------------------------
# Conservative initial value: 1 year (31536000 seconds).
# Deployment context: manojkc1.com.np and api.manojkc1.com.np both serve
# HTTPS exclusively via the hosting platform's TLS termination layer.
# PRELOAD is intentionally NOT enabled — it requires a separate deliberate
# submission to the HSTS preload list and cannot be reverted easily.
# To disable HSTS entirely for a subdomain migration, set SECURE_HSTS_SECONDS=0
# in the environment before deploying (overrides this default).
_hsts_seconds = int(os.getenv('SECURE_HSTS_SECONDS', '31536000'))
SECURE_HSTS_SECONDS = _hsts_seconds
SECURE_HSTS_INCLUDE_SUBDOMAINS = True  # api.manojkc1.com.np is HTTPS-only
SECURE_HSTS_PRELOAD = False            # Requires deliberate preload-list submission

# ---------------------------------------------------------------------------
# SSL redirect — enabled by default; can be disabled behind a proxy that
# handles HTTPS termination and emits X-Forwarded-Proto itself.
# ---------------------------------------------------------------------------
if os.getenv('SECURE_SSL_REDIRECT', 'True').lower() in ('true', '1', 'yes'):
    SECURE_SSL_REDIRECT = True
    # Trust the reverse proxy's X-Forwarded-Proto header to identify HTTPS.
    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

# ---------------------------------------------------------------------------
# Session and CSRF cookies (H2, H3)
# ---------------------------------------------------------------------------
# These are unconditional in production — they must never be disabled by
# an environment variable.  Dev-mode equivalent is implicitly False via
# Django's own defaults when SESSION_COOKIE_SECURE is not set.
SESSION_COOKIE_SECURE = True      # H2: cookie sent only over HTTPS
SESSION_COOKIE_HTTPONLY = True    # H3: cookie inaccessible to JavaScript
CSRF_COOKIE_SECURE = True         # H2: CSRF token sent only over HTTPS

# ---------------------------------------------------------------------------
# Production Email: enforce real SMTP / transactional delivery
# ---------------------------------------------------------------------------
if not os.getenv('EMAIL_BACKEND'):
    EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
