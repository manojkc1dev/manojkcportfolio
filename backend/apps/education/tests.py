"""
Tests for education app.
"""
from django.test import TestCase
from django.contrib.auth import get_user_model
from .models import Education
from .selectors import EducationSelector
from .services import EducationService
from .validators import validate_education_dates, validate_cgpa

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
        self.assertEqual(str(self.education), 'Bachelor of Science in Computer Science at University of Tech')


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


class EducationValidatorTest(TestCase):
    """Test Education validators."""
    
    def test_validate_education_dates(self):
        """Test validating education dates."""
        from datetime import date
        # Valid dates
        validate_education_dates(date(2016, 1, 1), date(2020, 1, 1), False)
        
        # Invalid dates
        from django.core.exceptions import ValidationError
        with self.assertRaises(ValidationError):
            validate_education_dates(date(2020, 1, 1), date(2016, 1, 1), False)
    
    def test_validate_cgpa(self):
        """Test validating CGPA."""
        # Valid CGPA
        validate_cgpa(8.5)
        
        # Invalid CGPA
        from django.core.exceptions import ValidationError
        with self.assertRaises(ValidationError):
            validate_cgpa(11)
