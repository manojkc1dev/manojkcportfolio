"""
Tests for hero app models.
"""
from django.test import TestCase
from django.contrib.auth import get_user_model
from ..models import Hero

User = get_user_model()


class HeroModelTest(TestCase):
    """Test Hero model."""
    
    def setUp(self):
        """Set up test data."""
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.hero = Hero.objects.create(
            name='John Doe',
            title='Software Engineer',
            subtitle='Building amazing things',
            description='Full stack developer',
            availability_status='available',
            created_by=self.user,
            updated_by=self.user
        )
    
    def test_hero_creation(self):
        """Test hero creation."""
        self.assertEqual(self.hero.name, 'John Doe')
        self.assertEqual(self.hero.status, 'draft')
        self.assertTrue(self.hero.is_active)
    
    def test_hero_str(self):
        """Test hero string representation."""
        self.assertEqual(str(self.hero), 'John Doe')
    
    def test_hero_availability_choices(self):
        """Test availability status choices."""
        self.assertEqual(self.hero.availability_status, 'available')
        self.hero.availability_status = 'busy'
        self.hero.save()
        self.assertEqual(self.hero.availability_status, 'busy')
