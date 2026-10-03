from django.test import TestCase
from apps.inquiries.models import Inquiry


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


class InquiryAccessTests(TestCase):
    def test_inquiries_list_not_exposed_publicly(self):
        from rest_framework.test import APIClient
        client = APIClient()
        response = client.get('/api/v1/inquiries/')
        # Should return 404 since no public inquiries list route exists in Phase 4B
        self.assertEqual(response.status_code, 404)


