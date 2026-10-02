"""
Development settings for Manoj KC Portfolio Django REST backend.
Enables debugging tools, verbose errors, and browsable API renderers.
"""
from .base import *  # noqa: F403

DEBUG = True

# In development, also enable DRF browsable API renderer for easy testing in browser
REST_FRAMEWORK['DEFAULT_RENDERER_CLASSES'] = [  # noqa: F405
    'rest_framework.renderers.JSONRenderer',
    'rest_framework.renderers.BrowsableAPIRenderer',
]

# Development allowed hosts
ALLOWED_HOSTS = [
    'localhost',
    '127.0.0.1',
    '0.0.0.0',
    '[::1]',
]

# CORS in development allows standard local frontends
CORS_ALLOW_ALL_ORIGINS = False
