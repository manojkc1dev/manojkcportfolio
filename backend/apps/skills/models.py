"""
Skills model for portfolio CMS.
"""
from django.db import models
from core.models import BaseModel, StatusModel, OrderableModel


class SkillCategory(BaseModel, StatusModel, OrderableModel):
    """
    Skill categories for organizing skills.
    """
    name = models.CharField(max_length=100, db_index=True)
    slug = models.SlugField(max_length=100, unique=True, db_index=True)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, blank=True, help_text='Icon class or emoji')
    color = models.CharField(max_length=7, blank=True, help_text='Hex color code')
    
    class Meta:
        db_table = 'skill_categories'
        verbose_name = 'Skill Category'
        verbose_name_plural = 'Skill Categories'
        ordering = ['order', 'name']
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['status', 'is_active']),
        ]

    def __str__(self):
        return self.name


class Skill(BaseModel, StatusModel, OrderableModel):
    """
    Individual skill with proficiency and experience.
    """
    name = models.CharField(max_length=100, db_index=True)
    slug = models.SlugField(max_length=100, unique=True, db_index=True)
    category = models.ForeignKey(
        SkillCategory,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='skills'
    )
    
    # Proficiency
    percentage = models.PositiveIntegerField(
        default=0,
        help_text='Skill proficiency percentage (0-100)'
    )
    experience_years = models.PositiveIntegerField(default=0, help_text='Years of experience')
    
    # Visual
    icon = models.CharField(max_length=50, blank=True, help_text='Icon class or emoji')
    image = models.ImageField(upload_to='skills/', blank=True, null=True)
    
    # Display
    priority = models.PositiveIntegerField(default=0, help_text='Higher priority shown first')
    is_featured = models.BooleanField(default=False, db_index=True)
    show_on_homepage = models.BooleanField(default=True, db_index=True)
    
    class Meta:
        db_table = 'skills'
        verbose_name = 'Skill'
        verbose_name_plural = 'Skills'
        ordering = ['-priority', 'order', '-percentage']
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['category']),
            models.Index(fields=['status', 'is_active']),
            models.Index(fields=['is_featured']),
            models.Index(fields=['status', 'show_on_homepage', 'is_active']),
            models.Index(fields=['percentage']),
        ]

    def __str__(self):
        return self.name
