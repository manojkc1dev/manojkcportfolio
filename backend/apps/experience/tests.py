"""
Tests for experience app.
"""
from django.test import TestCase
from django.contrib.auth import get_user_model
from .models import Experience
from .selectors import ExperienceSelector
from .services import ExperienceService
from .validators import validate_employment_type, validate_experience_dates

User = get_user_model()


class ExperienceModelTest(TestCase):
    """Test Experience model."""
    
    def setUp(self):
        """Set up test data."""
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.experience = Experience.objects.create(
            company='Tech Corp',
            position='Software Engineer',
            employment_type='full_time',
            start_date='2020-01-01',
            created_by=self.user,
            updated_by=self.user
        )
    
    def test_experience_creation(self):
        """Test experience creation."""
        self.assertEqual(self.experience.company, 'Tech Corp')
        self.assertEqual(self.experience.position, 'Software Engineer')
        self.assertEqual(self.experience.employment_type, 'full_time')
    
    def test_experience_str(self):
        """Test experience string representation."""
        self.assertEqual(str(self.experience), 'Software Engineer at Tech Corp')


class ExperienceSelectorTest(TestCase):
    """Test Experience selector."""
    
    def setUp(self):
        """Set up test data."""
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.experience = Experience.objects.create(
            company='Tech Corp',
            position='Software Engineer',
            employment_type='full_time',
            start_date='2020-01-01',
            status='published',
            is_active=True,
            show_on_homepage=True,
            created_by=self.user,
            updated_by=self.user
        )
    
    def test_get_published_experience(self):
        """Test getting published experience."""
        experiences = ExperienceSelector.get_published_experience()
        self.assertEqual(experiences.count(), 1)
    
    def test_get_current_experience(self):
        """Test getting current experience."""
        self.experience.is_current = True
        self.experience.save()
        experiences = ExperienceSelector.get_current_experience()
        self.assertEqual(experiences.count(), 1)


class ExperienceServiceTest(TestCase):
    """Test Experience service."""
    
    def setUp(self):
        """Set up test data."""
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
    
    def test_create_experience(self):
        """Test creating experience."""
        data = {
            'company': 'New Corp',
            'position': 'Developer',
            'employment_type': 'full_time',
            'start_date': '2021-01-01'
        }
        experience = ExperienceService.create_experience(data, self.user)
        self.assertEqual(experience.company, 'New Corp')
    
    def test_publish_experience(self):
        """Test publishing experience."""
        experience = Experience.objects.create(
            company='Tech Corp',
            position='Software Engineer',
            employment_type='full_time',
            start_date='2020-01-01',
            status='draft',
            created_by=self.user,
            updated_by=self.user
        )
        published_experience = ExperienceService.publish_experience(experience.id, self.user)
        self.assertEqual(published_experience.status, 'published')


class ExperienceValidatorTest(TestCase):
    """Test Experience validators."""
    
    def test_validate_employment_type(self):
        """Test validating employment type."""
        # Valid type
        validate_employment_type('full_time')
        
        # Invalid type
        from django.core.exceptions import ValidationError
        with self.assertRaises(ValidationError):
            validate_employment_type('invalid_type')
    
    def test_validate_experience_dates(self):
        """Test validating experience dates."""
        from datetime import date
        # Valid dates
        validate_experience_dates(date(2020, 1, 1), date(2021, 1, 1), False)
        
        # Invalid dates
        with self.assertRaises(ValidationError):
            validate_experience_dates(date(2021, 1, 1), date(2020, 1, 1), False)
