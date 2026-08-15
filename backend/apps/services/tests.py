"""
Tests for services app.
"""
from django.test import TestCase
from django.contrib.auth import get_user_model
from .models import Service
from .selectors import ServiceSelector
from .services import ServiceService
from .validators import validate_service_slug, validate_price_type

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


class ServiceValidatorTest(TestCase):
    """Test Service validators."""
    
    def test_validate_service_slug(self):
        """Test validating service slug."""
        # Unique slug
        validate_service_slug('unique-slug')
        
        # Duplicate slug
        from django.contrib.auth import get_user_model
        User = get_user_model()
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
