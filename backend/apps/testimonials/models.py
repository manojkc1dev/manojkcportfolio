"""
Testimonials model for portfolio CMS.
"""
from django.db import models
from core.models import BaseModel, StatusModel, OrderableModel


class Testimonial(BaseModel, StatusModel, OrderableModel):
    """
    Client testimonials and reviews.
    """
    # Client Information
    client_name = models.CharField(max_length=255, db_index=True)
    client_designation = models.CharField(max_length=255, blank=True)
    client_company = models.CharField(max_length=255, blank=True)
    
    # Visual
    client_photo = models.ImageField(upload_to='testimonials/photos/', blank=True, null=True)
    company_logo = models.ImageField(upload_to='testimonials/logos/', blank=True, null=True)
    
    # Testimonial
    review = models.TextField()
    rating = models.PositiveIntegerField(
        default=5,
        help_text='Rating out of 5'
    )
    
    # Links
    linkedin_url = models.URLField(blank=True)
    website_url = models.URLField(blank=True)
    
    # Project Reference
    project_name = models.CharField(max_length=255, blank=True)
    project_url = models.URLField(blank=True)
    
    # Display
    show_on_homepage = models.BooleanField(default=True, db_index=True)
    is_featured = models.BooleanField(default=False, db_index=True)
    
    class Meta:
        db_table = 'testimonials'
        verbose_name = 'Testimonial'
        verbose_name_plural = 'Testimonials'
        ordering = ['-is_featured', 'order']
        indexes = [
            models.Index(fields=['client_name']),
            models.Index(fields=['client_company']),
            models.Index(fields=['status', 'is_active']),
            models.Index(fields=['is_featured']),
        ]

    def __str__(self):
        return f"{self.client_name} - {self.client_company}"
