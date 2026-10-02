"""
Tests for Core API & Health endpoints.
"""
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient


class HealthCheckTests(TestCase):
    """Test suite for the system health-check endpoint."""

    def setUp(self):
        self.client = APIClient()

    def test_health_check_endpoint_returns_ok_status(self):
        """Verify GET /api/v1/health/ returns status 200 and exact JSON payload."""
        url = reverse('v1_core:health-check')
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json(), {"status": "ok"})

    def test_health_check_direct_path(self):
        """Verify direct path access /api/v1/health/."""
        response = self.client.get('/api/v1/health/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json(), {"status": "ok"})

    def test_health_check_cors_headers_configured(self):
        """Verify CORS headers respond to standard requests."""
        response = self.client.get('/api/v1/health/', HTTP_ORIGIN='http://localhost:3000')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.headers.get('Access-Control-Allow-Origin'), 'http://localhost:3000')
