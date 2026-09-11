"""
Education model for portfolio CMS.
"""
from django.db import models
from core.models import BaseModel, StatusModel, OrderableModel


class Education(BaseModel, StatusModel, OrderableModel):
    """
    Academic education and qualifications.
    """
    # Institution Information
    institution = models.CharField(max_length=255, db_index=True)
    degree = models.CharField(max_length=255, db_index=True)
    major = models.CharField(max_length=255, blank=True)
    field_of_study = models.CharField(max_length=255, blank=True)
    
    # Duration
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True, help_text='Leave blank if currently studying')
    is_current = models.BooleanField(default=False, help_text='Currently studying')
    
    # Academic Details
    cgpa = models.DecimalField(
        max_digits=4,
        decimal_places=2,
        null=True,
        blank=True,
        help_text='Cumulative Grade Point Average'
    )
    percentage = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
        help_text='Overall percentage'
    )
    grade = models.CharField(max_length=10, blank=True)
    
    # Description
    description = models.TextField(blank=True)
    coursework = models.JSONField(
        default=list,
        blank=True,
        help_text='List of relevant coursework'
    )
    achievements = models.JSONField(
        default=list,
        blank=True,
        help_text='List of academic achievements'
    )
    
    # Links
    institution_website = models.URLField(blank=True)
    institution_logo = models.ImageField(upload_to='education/institutions/', blank=True, null=True)
    
    # Display
    show_on_homepage = models.BooleanField(default=True, db_index=True)
    
    class Meta:
        db_table = 'education'
        verbose_name = 'Education'
        verbose_name_plural = 'Education'
        ordering = ['-is_current', '-end_date', '-start_date', 'order']
        indexes = [
            models.Index(fields=['institution']),
            models.Index(fields=['degree']),
            models.Index(fields=['start_date']),
            models.Index(fields=['status', 'is_active']),
            models.Index(fields=['status', 'show_on_homepage', 'is_active']),
            models.Index(fields=['is_current', 'start_date']),
        ]

    def __str__(self):
        return f"{self.degree} from {self.institution}"
