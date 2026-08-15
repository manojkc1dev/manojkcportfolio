"""
Tests for hero app services.
"""
from django.test import TestCase
from django.contrib.auth import get_user_model
from ..models import Hero
from ..services import HeroService

User = get_user_model()


class HeroServiceTest(TestCase):
    """Test Hero service."""
    
    def setUp(self):
        """Set up test data."""
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
    
    def test_create_hero(self):
        """Test creating a hero."""
        data = {
            'name': 'Jane Doe',
            'title': 'Developer',
            'availability_status': 'available'
        }
        hero = HeroService.create_hero(data, self.user)
        self.assertEqual(hero.name, 'Jane Doe')
        self.assertEqual(hero.created_by, self.user)
    
    def test_update_hero(self):
        """Test updating a hero."""
        hero = Hero.objects.create(
            name='John Doe',
            title='Software Engineer',
            created_by=self.user,
            updated_by=self.user
        )
        data = {'title': 'Senior Software Engineer'}
        updated_hero = HeroService.update_hero(hero.id, data, self.user)
        self.assertEqual(updated_hero.title, 'Senior Software Engineer')
    
    def test_delete_hero(self):
        """Test deleting a hero."""
        hero = Hero.objects.create(
            name='John Doe',
            title='Software Engineer',
            created_by=self.user,
            updated_by=self.user
        )
        result = HeroService.delete_hero(hero.id)
        self.assertTrue(result)
        self.assertFalse(Hero.objects.filter(id=hero.id).exists())
    
    def test_publish_hero(self):
        """Test publishing a hero."""
        hero = Hero.objects.create(
            name='John Doe',
            title='Software Engineer',
            status='draft',
            created_by=self.user,
            updated_by=self.user
        )
        published_hero = HeroService.publish_hero(hero.id, self.user)
        self.assertEqual(published_hero.status, 'published')
