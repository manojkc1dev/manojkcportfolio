"""
Tests for contact app validators.
"""
from django.test import TestCase
from ..validators import validate_contact_email, validate_contact_message


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
