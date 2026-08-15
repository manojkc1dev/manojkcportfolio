"""
Tests for experience app selectors.
"""
from django.test import TestCase
from django.contrib.auth import get_user_model
from ..models import Experience
from ..selectors import ExperienceSelector

User = get_user_model()


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
