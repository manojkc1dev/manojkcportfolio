"""
Tests for experience app services.
"""
from django.test import TestCase
from django.contrib.auth import get_user_model
from ..models import Experience
from ..services import ExperienceService

User = get_user_model()


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
