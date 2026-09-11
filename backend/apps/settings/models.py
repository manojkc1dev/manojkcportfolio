"""
Site settings model for global configuration.
"""
from django.db import models
from core.models import BaseModel


class SiteSettings(BaseModel):
    """
    Global site settings managed from admin panel.
    """
    # Site Identity
    site_name = models.CharField(max_length=100, default="Portfolio")
    tagline = models.CharField(max_length=255, blank=True)
    logo = models.ImageField(upload_to='settings/', blank=True, null=True)
    favicon = models.ImageField(upload_to='settings/', blank=True, null=True)
    
    # Theme Settings
    THEME_CHOICES = [
        ('dark', 'Dark Mode'),
        ('light', 'Light Mode'),
        ('system', 'System Default'),
    ]
    default_theme = models.CharField(max_length=10, choices=THEME_CHOICES, default='dark')
    allow_theme_toggle = models.BooleanField(default=True)
    
    # Contact Information
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=20, blank=True)
    location = models.CharField(max_length=255, blank=True)
    timezone = models.CharField(max_length=50, default='UTC')
    
    # Social Links
    github_url = models.URLField(blank=True)
    linkedin_url = models.URLField(blank=True)
    twitter_url = models.URLField(blank=True)
    instagram_url = models.URLField(blank=True)
    youtube_url = models.URLField(blank=True)
    
    # Footer
    footer_text = models.TextField(blank=True)
    copyright_text = models.CharField(max_length=255, default="© {year} All rights reserved")
    show_social_links = models.BooleanField(default=True)
    
    # SEO
    meta_title = models.CharField(max_length=255, blank=True)
    meta_description = models.TextField(blank=True)
    meta_keywords = models.CharField(max_length=255, blank=True)
    
    # Analytics
    google_analytics_id = models.CharField(max_length=50, blank=True)
    posthog_api_key = models.CharField(max_length=100, blank=True)
    posthog_host = models.URLField(blank=True)
    
    # Maintenance Mode
    maintenance_mode = models.BooleanField(default=False)
    maintenance_message = models.TextField(blank=True)
    
    class Meta:
        db_table = 'site_settings'
        verbose_name = 'Site Settings'
        verbose_name_plural = 'Site Settings'

    def __str__(self):
        return self.site_name

    def save(self, *args, **kwargs):
        """Ensure only one instance exists."""
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def get_settings(cls):
        """Get the singleton instance."""
        obj, created = cls.objects.get_or_create(pk=1)
        return obj


class HomepageSection(BaseModel):
    """
    Homepage sections with ordering and visibility control.
    """
    SECTION_CHOICES = [
        ('hero', 'Hero Section'),
        ('about', 'About Section'),
        ('skills', 'Skills Section'),
        ('techstack', 'Tech Stack Section'),
        ('projects', 'Featured Projects'),
        ('experience', 'Experience Section'),
        ('education', 'Education Section'),
        ('certifications', 'Certifications Section'),
        ('services', 'Services Section'),
        ('testimonials', 'Testimonials Section'),
        ('clients', 'Clients Section'),
        ('blog', 'Latest Blog Posts'),
        ('contact', 'Contact Section'),
    ]

    section_type = models.CharField(max_length=50, choices=SECTION_CHOICES, unique=True)
    is_enabled = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0, db_index=True)
    custom_title = models.CharField(max_length=255, blank=True)
    display_limit = models.PositiveIntegerField(blank=True, null=True, help_text='Limit number of items to display')

    class Meta:
        db_table = 'homepage_sections'
        verbose_name = 'Homepage Section'
        verbose_name_plural = 'Homepage Sections'
        ordering = ['order']

    def __str__(self):
        return f"{self.get_section_type_display()} ({'Enabled' if self.is_enabled else 'Disabled'})"
