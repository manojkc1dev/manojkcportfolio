"""
Tests for skills app services.
"""
from django.test import TestCase
from django.contrib.auth import get_user_model
from ..models import Skill, SkillCategory
from ..services import SkillService

User = get_user_model()


class SkillServiceTest(TestCase):
    """Test Skill service."""
    
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
    
    def test_create_skill(self):
        """Test creating a skill."""
        data = {
            'name': 'JavaScript',
            'slug': 'javascript',
            'category': self.category,
            'percentage': 75
        }
        skill = SkillService.create_skill(data, self.user)
        self.assertEqual(skill.name, 'JavaScript')
    
    def test_toggle_featured(self):
        """Test toggling featured status."""
        skill = Skill.objects.create(
            name='Python',
            slug='python',
            category=self.category,
            percentage=85,
            created_by=self.user,
            updated_by=self.user
        )
        featured_skill = SkillService.toggle_featured(skill.id, self.user)
        self.assertTrue(featured_skill.is_featured)
