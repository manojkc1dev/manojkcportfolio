"""
Tests for projects app validators.
"""
from django.test import TestCase
from django.contrib.auth import get_user_model
from ..models import Project
from ..validators import validate_project_slug, validate_project_visibility

User = get_user_model()


class ProjectValidatorTest(TestCase):
    """Test Project validators."""
    
    def test_validate_project_slug(self):
        """Test validating project slug."""
        # Unique slug
        from django.core.exceptions import ValidationError
        validate_project_slug('unique-slug')
        
        # Duplicate slug
        user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        Project.objects.create(
            title='Test',
            slug='test',
            created_by=user,
            updated_by=user
        )
        with self.assertRaises(ValidationError):
            validate_project_slug('test')
    
    def test_validate_project_visibility(self):
        """Test validating visibility."""
        # Valid visibility
        validate_project_visibility('public')
        
        # Invalid visibility
        from django.core.exceptions import ValidationError
        with self.assertRaises(ValidationError):
            validate_project_visibility('invalid')
