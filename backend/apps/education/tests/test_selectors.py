"""
Tests for education app selectors.
"""
from django.test import TestCase
from django.contrib.auth import get_user_model
from ..models import Education
from ..selectors import EducationSelector

User = get_user_model()


class EducationSelectorTest(TestCase):
    """Test Education selector."""
    
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
            status='published',
            is_active=True,
            show_on_homepage=True,
            created_by=self.user,
            updated_by=self.user
        )
    
    def test_get_published_education(self):
        """Test getting published education."""
        education_list = EducationSelector.get_published_education()
        self.assertEqual(education_list.count(), 1)
    
    def test_get_current_education(self):
        """Test getting current education."""
        self.education.is_current = True
        self.education.save()
        education_list = EducationSelector.get_current_education()
        self.assertEqual(education_list.count(), 1)
