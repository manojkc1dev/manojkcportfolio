"""
Clients model for portfolio CMS.
"""
from django.db import models
from core.models import BaseModel, StatusModel, OrderableModel


class Client(BaseModel, StatusModel, OrderableModel):
    """
    Client information and reviews.
    """
    # Basic Information
    name = models.CharField(max_length=255, db_index=True)
    company = models.CharField(max_length=255, blank=True)
    designation = models.CharField(max_length=255, blank=True)
    
    # Visual
    logo = models.ImageField(upload_to='clients/logos/', blank=True, null=True)
    photo = models.ImageField(upload_to='clients/photos/', blank=True, null=True)
    
    # Contact
    website = models.URLField(blank=True)
    email = models.EmailField(blank=True)
    linkedin = models.URLField(blank=True)
    
    # Review
    review = models.TextField(blank=True)
    rating = models.PositiveIntegerField(
        default=5,
        help_text='Rating out of 5'
    )
    
    # Project Details
    project_name = models.CharField(max_length=255, blank=True)
    project_description = models.TextField(blank=True)
    
    # Display
    show_on_homepage = models.BooleanField(default=True, db_index=True)
    is_featured = models.BooleanField(default=False, db_index=True)
    
    class Meta:
        db_table = 'clients'
        verbose_name = 'Client'
        verbose_name_plural = 'Clients'
        ordering = ['-is_featured', 'order']
        indexes = [
            models.Index(fields=['name']),
            models.Index(fields=['company']),
            models.Index(fields=['status', 'is_active']),
            models.Index(fields=['is_featured']),
        ]

    def __str__(self):
        return f"{self.name} - {self.company}"
