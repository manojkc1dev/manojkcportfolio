"""
Achievements model for portfolio CMS.
"""
from django.db import models
from core.models import BaseModel, StatusModel, OrderableModel


class Achievement(BaseModel, StatusModel, OrderableModel):
    """
    Awards and achievements.
    """
    ACHIEVEMENT_TYPES = [
        ('award', 'Award'),
        ('recognition', 'Recognition'),
        ('milestone', 'Milestone'),
        ('publication', 'Publication'),
        ('speaking', 'Speaking Engagement'),
        ('other', 'Other'),
    ]
    
    # Basic Information
    title = models.CharField(max_length=255, db_index=True)
    achievement_type = models.CharField(max_length=20, choices=ACHIEVEMENT_TYPES, default='award')
    description = models.TextField(blank=True)
    
    # Date
    date = models.DateField(db_index=True)
    
    # Organization
    organization = models.CharField(max_length=255, blank=True)
    organization_url = models.URLField(blank=True)
    organization_logo = models.ImageField(upload_to='achievements/organizations/', blank=True, null=True)
    
    # Certificate/Image
    certificate_image = models.ImageField(upload_to='achievements/certificates/', blank=True, null=True)
    badge_url = models.URLField(blank=True)
    
    # Links
    url = models.URLField(blank=True, help_text='Link to achievement details')
    
    # Display
    show_on_homepage = models.BooleanField(default=True, db_index=True)
    is_featured = models.BooleanField(default=False, db_index=True)
    
    class Meta:
        db_table = 'achievements'
        verbose_name = 'Achievement'
        verbose_name_plural = 'Achievements'
        ordering = ['-is_featured', '-date', 'order']
        indexes = [
            models.Index(fields=['date']),
            models.Index(fields=['achievement_type']),
            models.Index(fields=['status', 'is_active']),
            models.Index(fields=['is_featured']),
        ]

    def __str__(self):
        return self.title
