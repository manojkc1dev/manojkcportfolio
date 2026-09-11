"""
Tests for contact app models.
"""
from django.test import TestCase
from ..models import Contact


class ContactModelTest(TestCase):
    """Test Contact model."""
    
    def setUp(self):
        """Set up test data."""
        self.contact = Contact.objects.create(
            name='John Doe',
            email='john@example.com',
            subject='Test Subject',
            message='This is a test message'
        )
    
    def test_contact_creation(self):
        """Test contact creation."""
        self.assertEqual(self.contact.name, 'John Doe')
        self.assertEqual(self.contact.email, 'john@example.com')
        self.assertEqual(self.contact.contact_status, 'new')
    
    def test_contact_str(self):
        """Test contact string representation."""
        self.assertEqual(str(self.contact), 'John Doe - Test Subject')
