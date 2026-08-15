"""
Tests for skills app.
"""
from django.test import TestCase
from django.contrib.auth import get_user_model
from .models import Skill, SkillCategory
from .selectors import SkillSelector, SkillCategorySelector
from .services import SkillService
from .validators import validate_skill_slug, validate_skill_percentage

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


class SkillValidatorTest(TestCase):
    """Test Skill validators."""
    
    def test_validate_skill_slug(self):
        """Test validating skill slug."""
        # Unique slug
        validate_skill_slug('unique-slug')
        
        # Duplicate slug
        from django.contrib.auth import get_user_model
        User = get_user_model()
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
