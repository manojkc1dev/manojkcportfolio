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

    def test_public_inquiry_get_returns_405(self):
        """
        GET /api/v1/inquiries/ must NOT be publicly accessible.
        CreateAPIView only registers POST; GET returns 405 Method Not Allowed.
        """
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 405)

    def test_second_honeypot_field_rejection(self):
        payload = {
            'name': 'Sneaky Bot',
            'email': 'sneaky@spam.net',
            'message': 'Free cryptocurrency investments guaranteed returns forever!',
            '_hp': 'also-filled-by-bot',
        }
        response = self.client.post(self.url, payload, format='json')
        self.assertEqual(response.status_code, 400)
