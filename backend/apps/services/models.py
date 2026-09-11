"""
Services model for portfolio CMS.
"""
from django.db import models
from core.models import BaseModel, StatusModel, OrderableModel, SEOModel


class Service(BaseModel, StatusModel, OrderableModel, SEOModel):
    """
    Service offerings for portfolio.
    """
    # Basic Information
    name = models.CharField(max_length=255, db_index=True)
    slug = models.SlugField(max_length=255, unique=True, db_index=True)
    tagline = models.CharField(max_length=500, blank=True)
    description = models.TextField()
    
    # Visual
    icon = models.CharField(max_length=50, blank=True, help_text='Icon class')
    image = models.ImageField(upload_to='services/', blank=True, null=True)
    color = models.CharField(max_length=7, blank=True, help_text='Hex color code')
    
    # Pricing
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    price_type = models.CharField(
        max_length=20,
        choices=[
            ('fixed', 'Fixed Price'),
            ('hourly', 'Hourly Rate'),
            ('project', 'Project Based'),
            ('custom', 'Custom Quote'),
        ],
        blank=True
    )
    
    # Features
    features = models.JSONField(
        default=list,
        blank=True,
        help_text='List of service features'
    )
    
    # Process
    process_steps = models.JSONField(
        default=list,
        blank=True,
        help_text='List of process steps'
    )
    
    # Display
    show_on_homepage = models.BooleanField(default=True, db_index=True)
    is_featured = models.BooleanField(default=False, db_index=True)
    
    class Meta:
        db_table = 'services'
        verbose_name = 'Service'
        verbose_name_plural = 'Services'
        ordering = ['-is_featured', 'order']
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['status', 'is_active']),
            models.Index(fields=['is_featured']),
        ]

    def __str__(self):
        return self.name
