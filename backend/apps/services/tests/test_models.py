"""
Tests for services app models.
"""
from django.test import TestCase
from django.contrib.auth import get_user_model
from ..models import Service

User = get_user_model()


class ServiceModelTest(TestCase):
    """Test Service model."""
    
    def setUp(self):
        """Set up test data."""
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.service = Service.objects.create(
            name='Web Development',
            slug='web-development',
            tagline='Building modern web applications',
            description='Full stack web development services',
            price_type='hourly',
            price=50,
            created_by=self.user,
            updated_by=self.user
        )
    
    def test_service_creation(self):
        """Test service creation."""
        self.assertEqual(self.service.name, 'Web Development')
        self.assertEqual(self.service.slug, 'web-development')
        self.assertEqual(self.service.price_type, 'hourly')
    
    def test_service_str(self):
        """Test service string representation."""
        self.assertEqual(str(self.service), 'Web Development')
