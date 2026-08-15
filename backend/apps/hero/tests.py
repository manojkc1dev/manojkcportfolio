"""
Tests for hero app.
"""
from django.test import TestCase
from django.contrib.auth import get_user_model
from .models import Hero
from .selectors import HeroSelector
from .services import HeroService
from .validators import validate_hero_availability, validate_hero_images, validate_cta_buttons

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


class HeroValidatorTest(TestCase):
    """Test Hero validators."""
    
    def test_validate_hero_availability(self):
        """Test validating availability status."""
        # Valid status
        validate_hero_availability('available')
        
        # Invalid status
        from django.core.exceptions import ValidationError
        with self.assertRaises(ValidationError):
            validate_hero_availability('invalid_status')
    
    def test_validate_hero_images(self):
        """Test validating hero images."""
        # Missing profile image
        data = {'name': 'John Doe'}
        from django.core.exceptions import ValidationError
        with self.assertRaises(ValidationError):
            validate_hero_images(data)
        
        # With profile image
        data = {'profile_image': 'image.jpg'}
        result = validate_hero_images(data)
        self.assertEqual(result, data)
    
    def test_validate_cta_buttons(self):
        """Test validating CTA buttons."""
        # Text without URL
        data = {'resume_button_text': 'Download Resume'}
        from django.core.exceptions import ValidationError
        with self.assertRaises(ValidationError):
            validate_cta_buttons(data)
        
        # Text with URL
        data = {
            'resume_button_text': 'Download Resume',
            'resume_button_url': 'https://example.com/resume.pdf'
        }
        result = validate_cta_buttons(data)
        self.assertEqual(result, data)
