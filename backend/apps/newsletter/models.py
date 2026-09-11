"""
Newsletter model for portfolio CMS.
"""
from django.db import models
from core.models import BaseModel, StatusModel


class Newsletter(BaseModel, StatusModel):
    """
    Newsletter subscriptions.
    """
    email = models.EmailField(unique=True, db_index=True)
    name = models.CharField(max_length=255, blank=True)
    
    # Status
    is_subscribed = models.BooleanField(default=True, db_index=True)
    is_verified = models.BooleanField(default=False, db_index=True)
    
    # Verification
    verification_token = models.CharField(max_length=255, blank=True)
    verified_at = models.DateTimeField(null=True, blank=True)
    
    # Unsubscription
    unsubscribed_at = models.DateTimeField(null=True, blank=True)
    unsubscribe_reason = models.TextField(blank=True)
    
    # Source
    source = models.CharField(max_length=100, blank=True, help_text='Where they subscribed from')
    
    class Meta:
        db_table = 'newsletters'
        verbose_name = 'Newsletter'
        verbose_name_plural = 'Newsletters'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['is_subscribed']),
            models.Index(fields=['is_verified']),
        ]

    def __str__(self):
        return self.email
