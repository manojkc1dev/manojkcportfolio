"""
Tests for services app selectors.
"""
from django.test import TestCase
from django.contrib.auth import get_user_model
from ..models import Service
from ..selectors import ServiceSelector

User = get_user_model()


class ServiceSelectorTest(TestCase):
    """Test Service selector."""
    
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
            status='published',
            is_active=True,
            show_on_homepage=True,
            created_by=self.user,
            updated_by=self.user
        )
    
    def test_get_published_services(self):
        """Test getting published services."""
        services = ServiceSelector.get_published_services()
        self.assertEqual(services.count(), 1)
    
    def test_get_featured_services(self):
        """Test getting featured services."""
        self.service.is_featured = True
        self.service.save()
        services = ServiceSelector.get_featured_services(limit=6)
        self.assertEqual(services.count(), 1)
    
    def test_get_service_by_slug(self):
        """Test getting service by slug."""
        service = ServiceSelector.get_service_by_slug('web-development')
        self.assertEqual(service.id, self.service.id)
