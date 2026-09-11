"""
Tests for services app validators.
"""
from django.test import TestCase
from django.contrib.auth import get_user_model
from ..models import Service
from ..validators import validate_service_slug, validate_price_type

User = get_user_model()


class ServiceValidatorTest(TestCase):
    """Test Service validators."""
    
    def test_validate_service_slug(self):
        """Test validating service slug."""
        # Unique slug
        validate_service_slug('unique-slug')
        
        # Duplicate slug
        user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        Service.objects.create(
            name='Test',
            slug='test',
            created_by=user,
            updated_by=user
        )
        from django.core.exceptions import ValidationError
        with self.assertRaises(ValidationError):
            validate_service_slug('test')
    
    def test_validate_price_type(self):
        """Test validating price type."""
        # Valid type
        validate_price_type('hourly')
        
        # Invalid type
        from django.core.exceptions import ValidationError
        with self.assertRaises(ValidationError):
            validate_price_type('invalid_type')
