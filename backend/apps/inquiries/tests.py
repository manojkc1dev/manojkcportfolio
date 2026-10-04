import io
from django.test import TestCase
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.test import APIClient
from apps.inquiries.models import Inquiry


# ──────────────────────────────────────────────────────────────────────────────
# Model Tests
# ──────────────────────────────────────────────────────────────────────────────

class InquiryModelTests(TestCase):
    def test_inquiry_creation_and_defaults(self):
        inq = Inquiry.objects.create(
            name='Test Inquirer',
            email='inquirer@example.com',
            message='Need a Django API consultation for our fintech app.',
            scope_title='API Consultation'
        )
        self.assertEqual(inq.status, 'New')
        self.assertFalse(inq.read)
        self.assertFalse(inq.replied)
        self.assertIn('Test Inquirer <inquirer@example.com>', str(inq))


# ──────────────────────────────────────────────────────────────────────────────
# Serializer Tests
# ──────────────────────────────────────────────────────────────────────────────

class InquirySerializerTests(TestCase):
    def test_valid_inquiry_creation_and_field_mapping(self):
        from apps.inquiries.serializers import InquiryCreateSerializer
        payload = {
            'name': '  Maya Sharma  ',
            'email': '  maya@example.com  ',
            'message': 'We need a robust payment integration for our marketplace.',
            'projectId': 'agritech',
            'projectTitle': 'AgriTech Marketplace',
            'sourcePage': 'https://manojkc1.com.np/projects/agritech'
        }
        serializer = InquiryCreateSerializer(data=payload)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        inquiry = serializer.save()

        self.assertEqual(inquiry.name, 'Maya Sharma')
        self.assertEqual(inquiry.email, 'maya@example.com')
        self.assertEqual(inquiry.project_id, 'agritech')
        self.assertEqual(inquiry.project_title, 'AgriTech Marketplace')
        self.assertEqual(inquiry.source_page, 'https://manojkc1.com.np/projects/agritech')
        self.assertEqual(inquiry.scope_title, 'Inquiry regarding AgriTech Marketplace')
        self.assertEqual(inquiry.status, 'New')

    def test_honeypot_detection_rejects_spam(self):
        from apps.inquiries.serializers import InquiryCreateSerializer
        payload = {
            'name': 'Spam Bot',
            'email': 'bot@spam.com',
            'message': 'Buy cheap crypto right now with 100x leverage!',
            'hp_field': 'http://spam-link.com'
        }
        serializer = InquiryCreateSerializer(data=payload)
        self.assertFalse(serializer.is_valid())
        self.assertIn('detail', serializer.errors)
        self.assertEqual(str(serializer.errors['detail'][0]), 'Spam submission detected.')

    def test_short_message_validation(self):
        from apps.inquiries.serializers import InquiryCreateSerializer
        payload = {
            'name': 'John Doe',
            'email': 'john@example.com',
            'message': 'Too short'
        }
        serializer = InquiryCreateSerializer(data=payload)
        self.assertFalse(serializer.is_valid())
        self.assertIn('message', serializer.errors)


# ──────────────────────────────────────────────────────────────────────────────
# API Endpoint Tests (Phase 4C)
# ──────────────────────────────────────────────────────────────────────────────

class InquiryAPITests(TestCase):
    """Phase 4C: POST /api/v1/inquiries/ public inquiry ingestion."""

    def setUp(self):
        self.client = APIClient()
        self.url = '/api/v1/inquiries/'

    def test_valid_inquiry_returns_201(self):
        payload = {
            'name': 'Priya Rao',
            'email': 'priya@example.com',
            'message': 'I would like to discuss a backend project for our startup.',
        }
        response = self.client.post(self.url, payload, format='json')
        self.assertEqual(response.status_code, 201)
        data = response.json()
        self.assertEqual(data['status'], 'ok')
        self.assertIn('message', data)
        self.assertIn('id', data)

    def test_invalid_inquiry_missing_required_fields_returns_400(self):
        payload = {'name': 'No Email'}
        response = self.client.post(self.url, payload, format='json')
        self.assertEqual(response.status_code, 400)

    def test_short_message_returns_400(self):
        payload = {
            'name': 'Brief',
            'email': 'brief@example.com',
            'message': 'Hi',
        }
        response = self.client.post(self.url, payload, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertIn('message', response.json())

    def test_honeypot_rejection_returns_400(self):
        payload = {
            'name': 'Bot',
            'email': 'bot@spam.net',
            'message': 'Click here for free money and prizes for your business!',
            'hp_field': 'filled-by-bot',
        }
        response = self.client.post(self.url, payload, format='json')
        self.assertEqual(response.status_code, 400)

    def test_valid_inquiry_persists_to_database(self):
        initial_count = Inquiry.objects.count()
        payload = {
            'name': 'Persistent User',
            'email': 'persist@example.com',
            'message': 'This inquiry should be saved in the database permanently.',
        }
        response = self.client.post(self.url, payload, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Inquiry.objects.count(), initial_count + 1)
        saved = Inquiry.objects.filter(email='persist@example.com').first()
        self.assertIsNotNone(saved)
        self.assertEqual(saved.name, 'Persistent User')
        self.assertEqual(saved.status, 'New')

    def test_public_inquiry_get_unauthenticated_returns_401(self):
        """
        GET /api/v1/inquiries/ requires authentication.
        Unauthenticated GET returns 401 Unauthorized.
        """
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 401)

    def test_second_honeypot_field_rejection(self):
        payload = {
            'name': 'Sneaky Bot',
            'email': 'sneaky@spam.net',
            'message': 'Free cryptocurrency investments guaranteed returns forever!',
            '_hp': 'also-filled-by-bot',
        }
        response = self.client.post(self.url, payload, format='json')
        self.assertEqual(response.status_code, 400)

    def test_inquiry_throttle_class_configured(self):
        """Verify that AnonRateThrottle is configured for public POST inquiries."""
        from rest_framework.throttling import AnonRateThrottle
        from apps.inquiries.views import InquiryListCreateView
        view = InquiryListCreateView()
        # Create request mock for POST
        from django.test.client import RequestFactory
        req = RequestFactory().post('/api/v1/inquiries/')
        view.request = req
        throttles = [type(t) for t in view.get_throttles()]
        self.assertIn(AnonRateThrottle, throttles)

    def test_inquiry_rate_limit_exceeded_returns_429(self):
        """Verify 429 Too Many Requests is returned when anon rate limit is hit."""
        from rest_framework.throttling import AnonRateThrottle
        from unittest.mock import patch
        from django.core.cache import cache
        cache.clear()
        with patch.object(AnonRateThrottle, 'get_rate', return_value='2/hour'):
            payload = {
                'name': 'Rate Limit Test',
                'email': 'rate@example.com',
                'message': 'Testing rate limit threshold for submissions.',
            }
            resp1 = self.client.post(self.url, payload, format='json')
            self.assertEqual(resp1.status_code, 201)
            resp2 = self.client.post(self.url, payload, format='json')
            self.assertEqual(resp2.status_code, 201)
            resp3 = self.client.post(self.url, payload, format='json')
            self.assertEqual(resp3.status_code, 429)
        cache.clear()


# ──────────────────────────────────────────────────────────────────────────────
# Admin Inquiries API Tests (Phase 5C)
# ──────────────────────────────────────────────────────────────────────────────

class AdminInquiryAPITests(TestCase):
    """Phase 5C: Authenticated Admin Inquiries DRF Endpoints."""

    def setUp(self):
        from django.contrib.auth import get_user_model
        User = get_user_model()
        self.admin_user = User.objects.create_user(
            username='admin_test',
            email='admin@manojkc1.com.np',
            password='Password123!',
            is_staff=True
        )
        self.client = APIClient()
        self.inquiry1 = Inquiry.objects.create(
            name='Elena Rostova',
            email='elena@example.com',
            company='Vertex AI',
            phone='+977 9851011111',
            message='We want to discuss microservice scaling in Django.',
            scope_title='Full-Stack Microservices',
            budget_range='US$2,500–5,000',
            status='New',
            read=False,
            replied=False,
        )
        self.inquiry2 = Inquiry.objects.create(
            name='Devendra Shrestha',
            email='devendra@example.com',
            company='FinTech Nepal',
            phone='+977 9851022222',
            message='Looking for PostgreSQL audit and query optimization.',
            scope_title='PostgreSQL Audit',
            budget_range='NPR 200,000–400,000',
            status='In Progress',
            read=True,
            replied=True,
        )

    def test_authenticated_admin_can_list_inquiries(self):
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get('/api/v1/inquiries/')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIsInstance(data, list)
        self.assertEqual(len(data), 2)
        names = [item['name'] for item in data]
        self.assertIn('Elena Rostova', names)
        self.assertIn('Devendra Shrestha', names)
        # Verify serialized fields
        first = data[0]
        self.assertIn('submittedAt', first)
        self.assertIn('hasWhatsApp', first)
        self.assertIn('status', first)

    def test_authenticated_admin_can_retrieve_single_inquiry(self):
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get(f'/api/v1/inquiries/{self.inquiry1.id}/')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['id'], str(self.inquiry1.id))
        self.assertEqual(data['name'], 'Elena Rostova')
        self.assertEqual(data['scopeTitle'], 'Full-Stack Microservices')

    def test_authenticated_admin_can_update_status_and_read_replied(self):
        self.client.force_authenticate(user=self.admin_user)
        payload = {
            'status': 'Won',
            'read': True,
            'replied': True,
        }
        response = self.client.patch(f'/api/v1/inquiries/{self.inquiry1.id}/', payload, format='json')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['status'], 'Won')
        self.assertTrue(data['read'])
        self.assertTrue(data['replied'])

        self.inquiry1.refresh_from_db()
        self.assertEqual(self.inquiry1.status, 'Won')
        self.assertTrue(self.inquiry1.read)
        self.assertTrue(self.inquiry1.replied)

    def test_authenticated_admin_can_delete_inquiry(self):
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.delete(f'/api/v1/inquiries/{self.inquiry1.id}/')
        self.assertEqual(response.status_code, 204)
        self.assertFalse(Inquiry.objects.filter(id=self.inquiry1.id).exists())

    def test_unauthenticated_delete_returns_401(self):
        response = self.client.delete(f'/api/v1/inquiries/{self.inquiry1.id}/')
        self.assertEqual(response.status_code, 401)
        self.assertTrue(Inquiry.objects.filter(id=self.inquiry1.id).exists())

    def test_unauthenticated_patch_returns_401(self):
        response = self.client.patch(
            f'/api/v1/inquiries/{self.inquiry1.id}/',
            {'status': 'Closed'},
            format='json'
        )
        self.assertEqual(response.status_code, 401)

