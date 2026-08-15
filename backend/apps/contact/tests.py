"""
Tests for contact app.
"""
from django.test import TestCase
from django.contrib.auth import get_user_model
from .models import Contact
from .selectors import ContactSelector
from .services import ContactService
from .validators import validate_contact_email, validate_contact_message

User = get_user_model()


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
        self.assertEqual(self.contact.contact_status, 'pending')
    
    def test_contact_str(self):
        """Test contact string representation."""
        self.assertEqual(str(self.contact), 'John Doe - Test Subject')


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
        contacts = ContactSelector.get_pending_contacts()
        self.assertEqual(contacts.count(), 1)
    
    def test_get_starred_contacts(self):
        """Test getting starred contacts."""
        self.contact.is_starred = True
        self.contact.save()
        contacts = ContactSelector.get_starred_contacts()
        self.assertEqual(contacts.count(), 1)


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


class ContactValidatorTest(TestCase):
    """Test Contact validators."""
    
    def test_validate_contact_email(self):
        """Test validating contact email."""
        # Valid email
        validate_contact_email('test@example.com')
        
        # Missing email
        from django.core.exceptions import ValidationError
        with self.assertRaises(ValidationError):
            validate_contact_email('')
    
    def test_validate_contact_message(self):
        """Test validating contact message."""
        # Short message
        from django.core.exceptions import ValidationError
        with self.assertRaises(ValidationError):
            validate_contact_message('short')
        
        # Valid message
        result = validate_contact_message('This is a valid message')
        self.assertEqual(result, 'This is a valid message')
