"""
Tests for education app services.
"""
from django.test import TestCase
from django.contrib.auth import get_user_model
from ..models import Education
from ..services import EducationService

User = get_user_model()


class EducationServiceTest(TestCase):
    """Test Education service."""
    
    def setUp(self):
        """Set up test data."""
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
    
    def test_create_education(self):
        """Test creating education."""
        data = {
            'institution': 'New University',
            'degree': 'Master of Science',
            'major': 'Data Science',
            'start_date': '2020-01-01'
        }
        education = EducationService.create_education(data, self.user)
        self.assertEqual(education.institution, 'New University')
    
    def test_publish_education(self):
        """Test publishing education."""
        education = Education.objects.create(
            institution='University of Tech',
            degree='Bachelor of Science',
            major='Computer Science',
            start_date='2016-01-01',
            status='draft',
            created_by=self.user,
            updated_by=self.user
        )
        published_education = EducationService.publish_education(education.id, self.user)
        self.assertEqual(published_education.status, 'published')
