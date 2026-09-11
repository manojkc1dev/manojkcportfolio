"""
Tests for skills app models.
"""
from django.test import TestCase
from django.contrib.auth import get_user_model
from ..models import Skill, SkillCategory

User = get_user_model()


class SkillModelTest(TestCase):
    """Test Skill model."""
    
    def setUp(self):
        """Set up test data."""
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.category = SkillCategory.objects.create(
            name='Programming',
            slug='programming',
            created_by=self.user,
            updated_by=self.user
        )
        self.skill = Skill.objects.create(
            name='Python',
            slug='python',
            category=self.category,
            percentage=85,
            created_by=self.user,
            updated_by=self.user
        )
    
    def test_skill_creation(self):
        """Test skill creation."""
        self.assertEqual(self.skill.name, 'Python')
        self.assertEqual(self.skill.slug, 'python')
        self.assertEqual(self.skill.percentage, 85)
    
    def test_skill_str(self):
        """Test skill string representation."""
        self.assertEqual(str(self.skill), 'Python')
