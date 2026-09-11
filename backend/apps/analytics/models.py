"""
Analytics model for portfolio CMS.
"""
from django.db import models
from core.models import BaseModel


class Analytics(BaseModel):
    """
    Visitor analytics and statistics.
    """
    # Visitor Information
    ip_address = models.GenericIPAddressField(db_index=True)
    user_agent = models.TextField(blank=True)
    
    # Location
    country = models.CharField(max_length=100, blank=True)
    city = models.CharField(max_length=100, blank=True)
    region = models.CharField(max_length=100, blank=True)
    
    # Device
    device_type = models.CharField(max_length=50, blank=True)
    browser = models.CharField(max_length=100, blank=True)
    os = models.CharField(max_length=100, blank=True)
    
    # Session
    session_id = models.CharField(max_length=255, blank=True, db_index=True)
    referrer = models.URLField(blank=True)
    landing_page = models.URLField(blank=True)
    exit_page = models.URLField(blank=True)
    
    # Time
    duration = models.PositiveIntegerField(default=0, help_text='Session duration in seconds')
    page_views = models.PositiveIntegerField(default=0)
    
    # Source
    source = models.CharField(max_length=50, blank=True)
    medium = models.CharField(max_length=50, blank=True)
    campaign = models.CharField(max_length=100, blank=True)
    
    class Meta:
        db_table = 'analytics'
        verbose_name = 'Analytics'
        verbose_name_plural = 'Analytics'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['ip_address']),
            models.Index(fields=['session_id']),
            models.Index(fields=['created_at']),
            models.Index(fields=['country']),
        ]

    def __str__(self):
        return f"{self.ip_address} - {self.created_at}"
