"""
Tests for hero app selectors.
"""
from django.test import TestCase
from django.contrib.auth import get_user_model
from ..models import Hero
from ..selectors import HeroSelector

User = get_user_model()


class HeroSelectorTest(TestCase):
    """Test Hero selector."""
    
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
            availability_status='available',
            status='published',
            is_active=True,
            show_on_homepage=True,
            created_by=self.user,
            updated_by=self.user
        )
    
    def test_get_published_hero(self):
        """Test getting published hero."""
        hero = HeroSelector.get_published_hero()
        self.assertEqual(hero.id, self.hero.id)
    
    def test_get_by_id(self):
        """Test getting hero by ID."""
        hero = HeroSelector.get_by_id(self.hero.id)
        self.assertEqual(hero.id, self.hero.id)
    
    def test_get_available_heroes(self):
        """Test getting available heroes."""
        heroes = HeroSelector.get_available_heroes()
        self.assertEqual(heroes.count(), 1)
