"""
Tests for education app models.
"""
from django.test import TestCase
from django.contrib.auth import get_user_model
from ..models import Education

User = get_user_model()


class EducationModelTest(TestCase):
    """Test Education model."""
    
    def setUp(self):
        """Set up test data."""
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.education = Education.objects.create(
            institution='University of Tech',
            degree='Bachelor of Science',
            major='Computer Science',
            start_date='2016-01-01',
            end_date='2020-01-01',
            created_by=self.user,
            updated_by=self.user
        )
    
    def test_education_creation(self):
        """Test education creation."""
        self.assertEqual(self.education.institution, 'University of Tech')
        self.assertEqual(self.education.degree, 'Bachelor of Science')
        self.assertEqual(self.education.major, 'Computer Science')
    
    def test_education_str(self):
        """Test education string representation."""
        self.assertEqual(str(self.education), 'Bachelor of Science from University of Tech')
