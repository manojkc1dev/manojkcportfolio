"""
Hero section model for portfolio CMS.
"""
from django.db import models
from core.models import BaseModel, StatusModel, OrderableModel, SEOModel


class Hero(BaseModel, StatusModel, OrderableModel, SEOModel):
    """
    Hero section with comprehensive fields for portfolio landing.
    """
    # Basic Information
    name = models.CharField(max_length=255, db_index=True)
    title = models.CharField(max_length=255, db_index=True)
    subtitle = models.CharField(max_length=500, blank=True)
    description = models.TextField(blank=True)
    
    # Availability
    availability_badge = models.CharField(max_length=50, blank=True, help_text='e.g., Available for work')
    availability_status = models.CharField(
        max_length=20,
        choices=[
            ('available', 'Available'),
            ('busy', 'Busy'),
            ('offline', 'Offline'),
        ],
        default='available'
    )
    
    # Location
    location = models.CharField(max_length=100, blank=True)
    
    # Images
    profile_image = models.ImageField(upload_to='hero/profile/', blank=True, null=True)
    background_image = models.ImageField(upload_to='hero/background/', blank=True, null=True)
    
    # Resume
    resume_button_text = models.CharField(max_length=50, default='Download Resume')
    resume_button_url = models.URLField(blank=True)
    
    # CTA Buttons
    hire_me_button_text = models.CharField(max_length=50, default='Hire Me')
    hire_me_button_url = models.URLField(blank=True)
    
    github_button_text = models.CharField(max_length=50, default='GitHub')
    github_button_url = models.URLField(blank=True)
    
    linkedin_button_text = models.CharField(max_length=50, default='LinkedIn')
    linkedin_button_url = models.URLField(blank=True)
    
    email_button_text = models.CharField(max_length=50, default='Email Me')
    email_button_url = models.EmailField(blank=True)
    
    whatsapp_button_text = models.CharField(max_length=50, default='WhatsApp')
    whatsapp_button_url = models.URLField(blank=True)
    
    # Typing Animation
    typing_animation_texts = models.JSONField(
        default=list,
        blank=True,
        help_text='List of texts for typing animation'
    )
    typing_animation_enabled = models.BooleanField(default=True)
    
    # Display Settings
    show_on_homepage = models.BooleanField(default=True, db_index=True)
    is_featured = models.BooleanField(default=False, db_index=True)
    
    class Meta:
        db_table = 'hero_sections'
        verbose_name = 'Hero Section'
        verbose_name_plural = 'Hero Sections'
        ordering = ['order', '-created_at']
        indexes = [
            models.Index(fields=['status', 'is_active']),
            models.Index(fields=['show_on_homepage']),
            models.Index(fields=['status', 'show_on_homepage', 'is_active']),
            models.Index(fields=['is_featured']),
        ]

    def __str__(self):
        return self.name
