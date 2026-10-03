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
