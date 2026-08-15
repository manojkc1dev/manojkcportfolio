"""
Tests for skills app selectors.
"""
from django.test import TestCase
from django.contrib.auth import get_user_model
from ..models import Skill, SkillCategory
from ..selectors import SkillSelector, SkillCategorySelector

User = get_user_model()


class SkillSelectorTest(TestCase):
    """Test Skill selector."""
    
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
            status='published',
            is_active=True,
            show_on_homepage=True,
            created_by=self.user,
            updated_by=self.user
        )
    
    def test_get_published_skills(self):
        """Test getting published skills."""
        skills = SkillSelector.get_published_skills()
        self.assertEqual(skills.count(), 1)
    
    def test_get_featured_skills(self):
        """Test getting featured skills."""
        self.skill.is_featured = True
        self.skill.save()
        skills = SkillSelector.get_featured_skills(limit=10)
        self.assertEqual(skills.count(), 1)
    
    def test_get_skill_by_slug(self):
        """Test getting skill by slug."""
        skill = SkillSelector.get_skill_by_slug('python')
        self.assertEqual(skill.id, self.skill.id)
