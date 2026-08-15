"""
About section model for portfolio CMS.
"""
from django.db import models
from core.models import BaseModel, StatusModel, SEOModel


class About(BaseModel, StatusModel, SEOModel):
    """
    About section with comprehensive personal information.
    """
    # Basic Information
    photo = models.ImageField(upload_to='about/photo/', blank=True, null=True)
    bio = models.TextField(blank=True)
    long_description = models.TextField(blank=True)
    
    # Mission & Vision
    mission = models.TextField(blank=True)
    vision = models.TextField(blank=True)
    
    # Statistics
    years_experience = models.PositiveIntegerField(default=0)
    projects_completed = models.PositiveIntegerField(default=0)
    happy_clients = models.PositiveIntegerField(default=0)
    awards_won = models.PositiveIntegerField(default=0)
    
    # Quote
    quote = models.TextField(blank=True)
    quote_author = models.CharField(max_length=255, blank=True)
    
    # Highlights
    highlights = models.JSONField(
        default=list,
        blank=True,
        help_text='List of key highlights/achievements'
    )
    
    # Display Settings
    show_on_homepage = models.BooleanField(default=True, db_index=True)
    
    class Meta:
        db_table = 'about_sections'
        verbose_name = 'About Section'
        verbose_name_plural = 'About Sections'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status', 'is_active']),
            models.Index(fields=['show_on_homepage']),
        ]

    def __str__(self):
        return f"About - {self.bio[:50]}"
