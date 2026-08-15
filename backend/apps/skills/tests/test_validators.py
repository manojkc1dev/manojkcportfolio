"""
Tests for skills app validators.
"""
from django.test import TestCase
from django.contrib.auth import get_user_model
from ..models import Skill
from ..validators import validate_skill_slug, validate_skill_percentage

User = get_user_model()


class SkillValidatorTest(TestCase):
    """Test Skill validators."""
    
    def test_validate_skill_slug(self):
        """Test validating skill slug."""
        # Unique slug
        validate_skill_slug('unique-slug')
        
        # Duplicate slug
        user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        Skill.objects.create(
            name='Test',
            slug='test',
            created_by=user,
            updated_by=user
        )
        from django.core.exceptions import ValidationError
        with self.assertRaises(ValidationError):
            validate_skill_slug('test')
    
    def test_validate_skill_percentage(self):
        """Test validating skill percentage."""
        # Valid percentage
        validate_skill_percentage(50)
        
        # Invalid percentage
        from django.core.exceptions import ValidationError
        with self.assertRaises(ValidationError):
            validate_skill_percentage(150)
