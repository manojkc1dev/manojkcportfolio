"""
Certifications model for portfolio CMS.
"""
from django.db import models
from core.models import BaseModel, StatusModel, OrderableModel


class Certification(BaseModel, StatusModel, OrderableModel):
    """
    Professional certifications and credentials.
    """
    # Certificate Information
    name = models.CharField(max_length=255, db_index=True)
    issuer = models.CharField(max_length=255, db_index=True)
    credential_id = models.CharField(max_length=100, blank=True, unique=True)
    
    # Dates
    issue_date = models.DateField()
    expiry_date = models.DateField(null=True, blank=True, help_text='Leave blank if no expiration')
    does_not_expire = models.BooleanField(default=False, help_text='Certificate does not expire')
    
    # Verification
    verification_url = models.URLField(blank=True, help_text='URL to verify certificate')
    is_verified = models.BooleanField(default=False, db_index=True)
    
    # Description
    description = models.TextField(blank=True)
    skills = models.JSONField(
        default=list,
        blank=True,
        help_text='List of skills certified'
    )
    
    # Visual
    certificate_image = models.ImageField(upload_to='certificates/', blank=True, null=True)
    issuer_logo = models.ImageField(upload_to='certificates/issuers/', blank=True, null=True)
    badge_url = models.URLField(blank=True, help_text='Badge image URL')
    
    # Links
    certificate_url = models.URLField(blank=True)
    
    # Display
    show_on_homepage = models.BooleanField(default=True, db_index=True)
    is_featured = models.BooleanField(default=False, db_index=True)
    
    class Meta:
        db_table = 'certifications'
        verbose_name = 'Certification'
        verbose_name_plural = 'Certifications'
        ordering = ['-is_featured', '-issue_date', 'order']
        indexes = [
            models.Index(fields=['issuer']),
            models.Index(fields=['credential_id']),
            models.Index(fields=['issue_date']),
            models.Index(fields=['status', 'is_active']),
            models.Index(fields=['is_verified']),
        ]

    def __str__(self):
        return f"{self.name} - {self.issuer}"
