"""
Tests for experience app models.
"""
from django.test import TestCase
from django.contrib.auth import get_user_model
from ..models import Experience

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
