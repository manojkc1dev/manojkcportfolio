"""
Security settings test suite for Manoj KC Portfolio Django REST backend.

Verifies the four production-security hardening changes from Phase 6A:

  C1 — SECRET_KEY: production must reject absent / placeholder keys.
  H1 — HSTS: production must configure Strict-Transport-Security.
  H2 — Secure cookies: SESSION_COOKIE_SECURE and CSRF_COOKIE_SECURE must be True.
  H3 — HttpOnly cookie: SESSION_COOKIE_HTTPONLY must be explicitly True.

Tests run in full isolation:
  - They never read from a real .env file.
  - They never use a real production credential.
  - They patch os.environ for each scenario and reimport the settings module
    so that module-level validation code re-executes.

Development-settings tests confirm that the normal local-development workflow
is not broken by the production guards.
"""
import importlib
import os
import sys
import unittest
from unittest.mock import patch

from django.test import SimpleTestCase


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _load_settings(module_path: str, env_overrides: dict) -> object:
    """
    Reimport a settings module with a clean environment overlay.

    Removes the cached module from sys.modules so module-level code
    (including the SECRET_KEY guard) re-executes on each call.
    Returns the freshly-imported module object.
    """
    for key in list(sys.modules.keys()):
        if 'core.settings' in key:
            del sys.modules[key]

    # Overlay the test environment variables
    test_env = {
        # Minimal safe env so unrelated settings do not crash
        'DJANGO_DEBUG': 'False',
        'DJANGO_ALLOWED_HOSTS': 'api.manojkc1.com.np',
        'CORS_ALLOWED_ORIGINS': 'https://manojkc1.com.np',
        'CSRF_TRUSTED_ORIGINS': 'https://manojkc1.com.np',
    }
    test_env.update(env_overrides)

    # Patch os.environ for the duration of the import
    with patch.dict(os.environ, test_env, clear=True):
        # Prevent load_dotenv from overwriting our injected values
        with patch('dotenv.load_dotenv', return_value=None):
            return importlib.import_module(module_path)


# ---------------------------------------------------------------------------
# C1 — SECRET_KEY validation
# ---------------------------------------------------------------------------

class SecretKeyProductionGuardTests(SimpleTestCase):
    """
    C1: Production settings must raise ImproperlyConfigured when
    DJANGO_SECRET_KEY is absent, empty, or a known insecure placeholder.
    """

    def _import_production_with_key(self, key_value: str | None):
        """Helper — attempt to load production settings with the given key."""
        overrides = {'DJANGO_DEBUG': 'False'}
        if key_value is not None:
            overrides['DJANGO_SECRET_KEY'] = key_value
        return _load_settings('core.settings.production', overrides)

    def test_production_raises_on_missing_secret_key(self):
        """C1: Missing DJANGO_SECRET_KEY must raise ImproperlyConfigured."""
        from django.core.exceptions import ImproperlyConfigured
        with self.assertRaises(ImproperlyConfigured):
            self._import_production_with_key(None)

    def test_production_raises_on_empty_secret_key(self):
        """C1: Empty DJANGO_SECRET_KEY must raise ImproperlyConfigured."""
        from django.core.exceptions import ImproperlyConfigured
        with self.assertRaises(ImproperlyConfigured):
            self._import_production_with_key('')

    def test_production_raises_on_insecure_placeholder(self):
        """C1: The known insecure placeholder must be rejected in production."""
        from django.core.exceptions import ImproperlyConfigured
        with self.assertRaises(ImproperlyConfigured):
            self._import_production_with_key(
                'django-insecure-dev-key-change-in-production-f3a7c8b2d1e4e6f9a0b1c2d3'
            )

    def test_production_raises_on_any_django_insecure_prefix(self):
        """C1: Any key starting with 'django-insecure' must be rejected."""
        from django.core.exceptions import ImproperlyConfigured
        with self.assertRaises(ImproperlyConfigured):
            self._import_production_with_key('django-insecure-something-custom')

    def test_production_accepts_valid_secret_key(self):
        """C1: A sufficiently random key must load without error."""
        settings = self._import_production_with_key(
            'v3ry-s3cur3-t3st-k3y-that-is-not-insecure-0xDEADBEEF!#2026'
        )
        self.assertIsNotNone(settings.SECRET_KEY)
        # Must not expose the key value in any assertion output
        self.assertFalse(settings.SECRET_KEY.startswith('django-insecure'))

    def test_simplejwt_signing_key_matches_secret_key(self):
        """C1: SIMPLE_JWT.SIGNING_KEY must equal the validated SECRET_KEY."""
        settings = self._import_production_with_key(
            'v3ry-s3cur3-t3st-k3y-that-is-not-insecure-0xDEADBEEF!#2026'
        )
        self.assertEqual(settings.SIMPLE_JWT['SIGNING_KEY'], settings.SECRET_KEY)


# ---------------------------------------------------------------------------
# H1 — HSTS
# ---------------------------------------------------------------------------

class HSTSProductionConfigTests(SimpleTestCase):
    """H1: Production settings must configure Strict-Transport-Security."""

    _SAFE_KEY = 'v3ry-s3cur3-t3st-k3y-that-is-not-insecure-0xDEADBEEF!#2026'

    def _load_prod(self, extra_env: dict | None = None):
        overrides = {'DJANGO_SECRET_KEY': self._SAFE_KEY}
        if extra_env:
            overrides.update(extra_env)
        return _load_settings('core.settings.production', overrides)

    def test_hsts_seconds_is_set_and_positive(self):
        """H1: SECURE_HSTS_SECONDS must be a positive integer."""
        settings = self._load_prod()
        self.assertGreater(settings.SECURE_HSTS_SECONDS, 0)

    def test_hsts_default_is_one_year(self):
        """H1: Default HSTS duration must be 31536000 seconds (1 year)."""
        settings = self._load_prod()
        self.assertEqual(settings.SECURE_HSTS_SECONDS, 31536000)

    def test_hsts_includes_subdomains(self):
        """H1: api.manojkc1.com.np is HTTPS-only; subdomains must be covered."""
        settings = self._load_prod()
        self.assertTrue(settings.SECURE_HSTS_INCLUDE_SUBDOMAINS)

    def test_hsts_preload_is_not_enabled_by_default(self):
        """H1: PRELOAD requires an explicit opt-in; must not be set automatically."""
        settings = self._load_prod()
        self.assertFalse(settings.SECURE_HSTS_PRELOAD)

    def test_hsts_duration_overridable_via_env(self):
        """H1: A deployment operator can reduce HSTS during a migration window."""
        settings = self._load_prod({'SECURE_HSTS_SECONDS': '3600'})
        self.assertEqual(settings.SECURE_HSTS_SECONDS, 3600)


# ---------------------------------------------------------------------------
# H2 / H3 — Cookie security
# ---------------------------------------------------------------------------

class ProductionCookieSecurityTests(SimpleTestCase):
    """H2 and H3: Production cookie settings must be unconditionally secure."""

    _SAFE_KEY = 'v3ry-s3cur3-t3st-k3y-that-is-not-insecure-0xDEADBEEF!#2026'

    def _load_prod(self, extra_env: dict | None = None):
        overrides = {'DJANGO_SECRET_KEY': self._SAFE_KEY}
        if extra_env:
            overrides.update(extra_env)
        return _load_settings('core.settings.production', overrides)

    def test_session_cookie_secure_is_true_unconditionally(self):
        """H2: SESSION_COOKIE_SECURE must be True regardless of env vars."""
        settings = self._load_prod({'SESSION_COOKIE_SECURE': 'False'})
        self.assertTrue(settings.SESSION_COOKIE_SECURE)

    def test_session_cookie_httponly_is_true_explicitly(self):
        """H3: SESSION_COOKIE_HTTPONLY must be explicitly set to True."""
        settings = self._load_prod()
        self.assertTrue(settings.SESSION_COOKIE_HTTPONLY)

    def test_csrf_cookie_secure_is_true_unconditionally(self):
        """H2: CSRF_COOKIE_SECURE must be True regardless of env vars."""
        settings = self._load_prod({'CSRF_COOKIE_SECURE': 'False'})
        self.assertTrue(settings.CSRF_COOKIE_SECURE)

    def test_session_cookie_secure_cannot_be_disabled_by_env(self):
        """H2: An env var of 'False' must NOT disable SESSION_COOKIE_SECURE."""
        settings = self._load_prod({'SESSION_COOKIE_SECURE': '0'})
        self.assertTrue(settings.SESSION_COOKIE_SECURE)

    def test_csrf_cookie_secure_cannot_be_disabled_by_env(self):
        """H2: An env var of 'False' must NOT disable CSRF_COOKIE_SECURE."""
        settings = self._load_prod({'CSRF_COOKIE_SECURE': '0'})
        self.assertTrue(settings.CSRF_COOKIE_SECURE)


# ---------------------------------------------------------------------------
# Development-settings smoke tests
# ---------------------------------------------------------------------------

class DevelopmentSettingsSmokeTests(SimpleTestCase):
    """
    Confirm that the development workflow is not broken by the production guards.
    In development mode (DJANGO_DEBUG=True) the insecure placeholder is permitted.
    """

    def _load_dev(self, extra_env: dict | None = None):
        overrides = {'DJANGO_DEBUG': 'True'}
        if extra_env:
            overrides.update(extra_env)
        return _load_settings('core.settings.development', overrides)

    def test_development_loads_without_secret_key_env_var(self):
        """Dev: settings must load successfully with no DJANGO_SECRET_KEY set."""
        settings = self._load_dev()
        self.assertIsNotNone(settings.SECRET_KEY)
        self.assertTrue(settings.DEBUG)

    def test_development_loads_with_insecure_placeholder(self):
        """Dev: insecure placeholder is explicitly permitted in DEBUG=True mode."""
        settings = self._load_dev({
            'DJANGO_SECRET_KEY': 'django-insecure-dev-key-change-in-production-f3a7c8b2d1e4e6f9a0b1c2d3'
        })
        self.assertIsNotNone(settings.SECRET_KEY)

    def test_development_session_cookie_secure_is_not_forced(self):
        """Dev: SESSION_COOKIE_SECURE must NOT be forced True in development."""
        settings = self._load_dev()
        # Django's default is False; development.py must not override this
        session_cookie_secure = getattr(settings, 'SESSION_COOKIE_SECURE', False)
        self.assertFalse(session_cookie_secure)

    def test_development_debug_is_true(self):
        """Dev: DEBUG must be True in development settings."""
        settings = self._load_dev()
        self.assertTrue(settings.DEBUG)


# ---------------------------------------------------------------------------
# Phase 6B — Production CORS & CSRF Origin Hardening Tests
# ---------------------------------------------------------------------------

class ProductionCorsCsrfSecurityTests(SimpleTestCase):
    """Verify production CORS and CSRF configuration and wildcard rejection."""

    _SAFE_KEY = 'v3ry-s3cur3-t3st-k3y-that-is-not-insecure-0xDEADBEEF!#2026'

    def _load_prod(self, extra_env: dict | None = None):
        overrides = {'DJANGO_SECRET_KEY': self._SAFE_KEY}
        if extra_env:
            overrides.update(extra_env)
        return _load_settings('core.settings.production', overrides)

    def test_production_cors_defaults_to_production_frontend_only(self):
        """Production CORS origins must not include localhost by default."""
        settings = self._load_prod()
        self.assertIn('https://manojkc1.com.np', settings.CORS_ALLOWED_ORIGINS)
        self.assertNotIn('http://localhost:3000', settings.CORS_ALLOWED_ORIGINS)
        self.assertNotIn('http://127.0.0.1:3000', settings.CORS_ALLOWED_ORIGINS)

    def test_production_cors_rejects_wildcard_origin(self):
        """Production must raise ImproperlyConfigured if wildcard '*' is supplied."""
        from django.core.exceptions import ImproperlyConfigured
        with self.assertRaises(ImproperlyConfigured):
            self._load_prod({'CORS_ALLOWED_ORIGINS': '*'})

    def test_production_cors_allow_all_origins_is_false(self):
        """CORS_ALLOW_ALL_ORIGINS must be explicitly False in production."""
        settings = self._load_prod()
        self.assertFalse(settings.CORS_ALLOW_ALL_ORIGINS)

    def test_production_csrf_defaults_to_production_domain(self):
        """Production CSRF trusted origins must include the production domain."""
        settings = self._load_prod()
        self.assertIn('https://manojkc1.com.np', settings.CSRF_TRUSTED_ORIGINS)
        self.assertNotIn('http://localhost:3000', settings.CSRF_TRUSTED_ORIGINS)

    def test_production_reverse_proxy_ssl_header_configured(self):
        """Production must trust X-Forwarded-Proto for TLS termination."""
        settings = self._load_prod()
        self.assertEqual(settings.SECURE_PROXY_SSL_HEADER, ('HTTP_X_FORWARDED_PROTO', 'https'))


# ---------------------------------------------------------------------------
# Phase 6B — Static Storage & WhiteNoise Tests
# ---------------------------------------------------------------------------

class StaticMediaStorageSettingsTests(SimpleTestCase):
    """Verify static asset and WhiteNoise storage configuration."""

    _SAFE_KEY = 'v3ry-s3cur3-t3st-k3y-that-is-not-insecure-0xDEADBEEF!#2026'

    def test_whitenoise_configured_in_storages(self):
        """STORAGES['staticfiles'] must use WhiteNoise manifest storage."""
        settings = _load_settings('core.settings.production', {'DJANGO_SECRET_KEY': self._SAFE_KEY})
        self.assertIn('staticfiles', settings.STORAGES)
        self.assertEqual(
            settings.STORAGES['staticfiles']['BACKEND'],
            'whitenoise.storage.CompressedManifestStaticFilesStorage'
        )

    def test_whitenoise_middleware_present(self):
        """WhiteNoiseMiddleware must be present in MIDDLEWARE."""
        settings = _load_settings('core.settings.production', {'DJANGO_SECRET_KEY': self._SAFE_KEY})
        self.assertIn('whitenoise.middleware.WhiteNoiseMiddleware', settings.MIDDLEWARE)


# ---------------------------------------------------------------------------
# Phase 6B — Health Check Endpoints Tests
# ---------------------------------------------------------------------------

class HealthCheckEndpointsTests(SimpleTestCase):
    """Verify health check routes for load balancers and orchestrators."""

    def test_root_health_returns_ok(self):
        """GET /health/ must return 200 {"status": "ok"}."""
        response = self.client.get('/health/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"status": "ok"})

    def test_root_healthz_returns_ok(self):
        """GET /healthz/ must return 200 {"status": "ok"}."""
        response = self.client.get('/healthz/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"status": "ok"})

    def test_versioned_health_returns_ok(self):
        """GET /api/v1/health/ must continue to return 200 {"status": "ok"}."""
        response = self.client.get('/api/v1/health/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"status": "ok"})


# ---------------------------------------------------------------------------
# Phase 6B — Gunicorn Configuration Smoke Tests
# ---------------------------------------------------------------------------

class GunicornConfigurationSmokeTests(SimpleTestCase):
    """Verify gunicorn.conf.py parses valid configuration without errors."""

    def test_gunicorn_conf_evaluates_cleanly(self):
        """Import gunicorn.conf.py in a dedicated namespace and verify defaults."""
        import runpy
        from pathlib import Path

        conf_path = Path(__file__).resolve().parent.parent / 'gunicorn.conf.py'
        self.assertTrue(conf_path.exists(), "gunicorn.conf.py must exist")

        conf_globals = runpy.run_path(str(conf_path))
        self.assertIn('bind', conf_globals)
        self.assertIn('workers', conf_globals)
        self.assertIn('threads', conf_globals)
        self.assertIn('timeout', conf_globals)
        self.assertIn('max_requests', conf_globals)
        self.assertGreater(conf_globals['workers'], 0)
        self.assertGreater(conf_globals['threads'], 0)
