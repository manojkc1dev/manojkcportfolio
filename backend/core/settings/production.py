"""
Production settings foundation for Manoj KC Portfolio Django REST backend.
Enforces strict security headers, SSL policies, and disabled debugging.
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

# Security Headers & SSL Settings
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'

# Enable SSL redirect and secure cookies if configured in environment
if os.getenv('SECURE_SSL_REDIRECT', 'True').lower() in ('true', '1', 'yes'):
    SECURE_SSL_REDIRECT = True
    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

if os.getenv('SESSION_COOKIE_SECURE', 'True').lower() in ('true', '1', 'yes'):
    SESSION_COOKIE_SECURE = True

if os.getenv('CSRF_COOKIE_SECURE', 'True').lower() in ('true', '1', 'yes'):
    CSRF_COOKIE_SECURE = True
