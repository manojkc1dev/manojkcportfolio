"""
Experience model for portfolio CMS.
"""
from django.db import models
from core.models import BaseModel, StatusModel, OrderableModel


class Experience(BaseModel, StatusModel, OrderableModel):
    """
    Work experience with comprehensive details.
    """
    EMPLOYMENT_TYPES = [
        ('full_time', 'Full Time'),
        ('part_time', 'Part Time'),
        ('contract', 'Contract'),
        ('freelance', 'Freelance'),
        ('internship', 'Internship'),
    ]
    
    # Company Information
    company = models.CharField(max_length=255, db_index=True)
    position = models.CharField(max_length=255, db_index=True)
    employment_type = models.CharField(max_length=20, choices=EMPLOYMENT_TYPES, default='full_time')
    location = models.CharField(max_length=100, blank=True)
    
    # Duration
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True, help_text='Leave blank if currently working')
    is_current = models.BooleanField(default=False, help_text='Currently working here')
    
    # Description
    description = models.TextField(blank=True)
    responsibilities = models.TextField(blank=True)
    
    # Technologies
    technologies = models.JSONField(
        default=list,
        blank=True,
        help_text='List of technologies used'
    )
    
    # Achievements
    achievements = models.JSONField(
        default=list,
        blank=True,
        help_text='List of key achievements'
    )
    
    # Links
    company_website = models.URLField(blank=True)
    company_logo = models.ImageField(upload_to='experience/companies/', blank=True, null=True)
    
    # Display
    show_on_homepage = models.BooleanField(default=True, db_index=True)
    is_featured = models.BooleanField(default=False, db_index=True)
    
    class Meta:
        db_table = 'experiences'
        verbose_name = 'Experience'
        verbose_name_plural = 'Experiences'
        ordering = ['-is_current', '-start_date', 'order']
        indexes = [
            models.Index(fields=['company']),
            models.Index(fields=['position']),
            models.Index(fields=['start_date']),
            models.Index(fields=['status', 'is_active']),
            models.Index(fields=['status', 'show_on_homepage', 'is_active']),
            models.Index(fields=['is_current', 'start_date']),
        ]

    def __str__(self):
        return f"{self.position} at {self.company}"
