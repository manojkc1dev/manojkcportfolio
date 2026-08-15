"""
Tests for contact app selectors.
"""
from django.test import TestCase
from ..models import Contact
from ..selectors import ContactSelector


class ContactSelectorTest(TestCase):
    """Test Contact selector."""
    
    def setUp(self):
        """Set up test data."""
        self.contact = Contact.objects.create(
            name='John Doe',
            email='john@example.com',
            subject='Test Subject',
            message='This is a test message'
        )
    
    def test_get_all_contacts(self):
        """Test getting all contacts."""
        contacts = ContactSelector.get_all_contacts()
        self.assertEqual(contacts.count(), 1)
    
    def test_get_pending_contacts(self):
        """Test getting pending contacts."""
        self.contact.contact_status = 'pending'
        self.contact.save()
        contacts = ContactSelector.get_pending_contacts()
        self.assertEqual(contacts.count(), 1)
    
    def test_get_starred_contacts(self):
        """Test getting starred contacts."""
        self.contact.is_starred = True
        self.contact.save()
        contacts = ContactSelector.get_starred_contacts()
        self.assertEqual(contacts.count(), 1)
