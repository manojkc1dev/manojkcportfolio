"""
Tests for services app services.
"""
from django.test import TestCase
from django.contrib.auth import get_user_model
from ..models import Service
from ..services import ServiceService

User = get_user_model()


class ServiceServiceTest(TestCase):
    """Test Service service."""
    
    def setUp(self):
        """Set up test data."""
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
    
    def test_create_service(self):
        """Test creating a service."""
        data = {
            'name': 'Mobile Development',
            'slug': 'mobile-development',
            'tagline': 'Building mobile apps',
            'description': 'iOS and Android development',
            'price_type': 'project',
            'price': 5000
        }
        service = ServiceService.create_service(data, self.user)
        self.assertEqual(service.name, 'Mobile Development')
    
    def test_toggle_featured(self):
        """Test toggling featured status."""
        service = Service.objects.create(
            name='Web Development',
            slug='web-development',
            price_type='hourly',
            price=50,
            created_by=self.user,
            updated_by=self.user
        )
        featured_service = ServiceService.toggle_featured(service.id, self.user)
        self.assertTrue(featured_service.is_featured)
    
    def test_publish_service(self):
        """Test publishing a service."""
        service = Service.objects.create(
            name='Web Development',
            slug='web-development',
            price_type='hourly',
            price=50,
            status='draft',
            created_by=self.user,
            updated_by=self.user
        )
        published_service = ServiceService.publish_service(service.id, self.user)
        self.assertEqual(published_service.status, 'published')
