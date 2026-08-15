"""
Selectors for skills app.
"""
from .models import Skill, SkillCategory


class SkillSelector:
    """
    Selector for Skill model queries.
    """
    
    @staticmethod
    def get_published_skills():
        """Get all published skills."""
        return Skill.objects.filter(
            status='published',
            is_active=True,
            show_on_homepage=True
        ).select_related('category').order_by('priority', 'order')
    
    @staticmethod
    def get_featured_skills(limit=10):
        """Get featured skills."""
        return Skill.objects.filter(
            status='published',
            is_active=True,
            is_featured=True
        ).select_related('category')[:limit]
    
    @staticmethod
    def get_skill_by_slug(slug):
        """Get skill by slug."""
        return Skill.objects.filter(
            slug=slug,
            status='published',
            is_active=True
        ).select_related('category').first()
    
    @staticmethod
    def get_skills_by_category(category_slug):
        """Get skills by category."""
        return Skill.objects.filter(
            category__slug=category_slug,
            status='published',
            is_active=True
        ).select_related('category').order_by('priority', 'order')
    
    @staticmethod
    def get_skills_by_proficiency(level):
        """Get skills by proficiency level."""
        return Skill.objects.filter(
            proficiency_level=level,
            status='published',
            is_active=True
        ).select_related('category').order_by('-percentage')


class SkillCategorySelector:
    """
    Selector for SkillCategory model queries.
    """
    
    @staticmethod
    def get_published_categories():
        """Get all published categories."""
        return SkillCategory.objects.filter(
            status='published',
            is_active=True
        ).order_by('order')
    
    @staticmethod
    def get_category_by_slug(slug):
        """Get category by slug."""
        return SkillCategory.objects.filter(
            slug=slug,
            status='published',
            is_active=True
        ).first()
