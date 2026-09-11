"""
Tests for contact app services.
"""
from django.test import TestCase
from django.contrib.auth import get_user_model
from ..models import Contact
from ..services import ContactService

User = get_user_model()


class ContactServiceTest(TestCase):
    """Test Contact service."""
    
    def setUp(self):
        """Set up test data."""
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
    
    def test_create_contact(self):
        """Test creating a contact."""
        data = {
            'name': 'Jane Doe',
            'email': 'jane@example.com',
            'subject': 'Test',
            'message': 'Test message'
        }
        contact = ContactService.create_contact(data)
        self.assertEqual(contact.name, 'Jane Doe')
    
    def test_mark_as_replied(self):
        """Test marking contact as replied."""
        contact = Contact.objects.create(
            name='John Doe',
            email='john@example.com',
            subject='Test',
            message='Test message'
        )
        replied_contact = ContactService.mark_as_replied(
            contact.id, 'Thank you for your message.', self.user
        )
        self.assertEqual(replied_contact.contact_status, 'replied')
        self.assertEqual(replied_contact.replied_by, self.user)
    
    def test_toggle_starred(self):
        """Test toggling starred status."""
        contact = Contact.objects.create(
            name='John Doe',
            email='john@example.com',
            subject='Test',
            message='Test message'
        )
        starred_contact = ContactService.toggle_starred(contact.id, self.user)
        self.assertTrue(starred_contact.is_starred)
