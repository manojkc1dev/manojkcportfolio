"""
Timeline model for portfolio CMS.
"""
from django.db import models
from core.models import BaseModel, StatusModel, OrderableModel


class Timeline(BaseModel, StatusModel, OrderableModel):
    """
    Career timeline events.
    """
    EVENT_TYPES = [
        ('education', 'Education'),
        ('work', 'Work Experience'),
        ('project', 'Project'),
        ('achievement', 'Achievement'),
        ('certification', 'Certification'),
        ('milestone', 'Milestone'),
        ('other', 'Other'),
    ]
    
    # Event Information
    title = models.CharField(max_length=255, db_index=True)
    event_type = models.CharField(max_length=20, choices=EVENT_TYPES, default='milestone')
    date = models.DateField(db_index=True)
    
    # Description
    description = models.TextField(blank=True)
    details = models.JSONField(
        default=dict,
        blank=True,
        help_text='Additional event details'
    )
    
    # Links
    url = models.URLField(blank=True)
    image = models.ImageField(upload_to='timeline/', blank=True, null=True)
    
    # Icon
    icon = models.CharField(max_length=50, blank=True, help_text='Icon class')
    color = models.CharField(max_length=7, blank=True, help_text='Hex color code')
    
    # Display
    show_on_homepage = models.BooleanField(default=True, db_index=True)
    
    class Meta:
        db_table = 'timeline_events'
        verbose_name = 'Timeline Event'
        verbose_name_plural = 'Timeline Events'
        ordering = ['-date', 'order']
        indexes = [
            models.Index(fields=['date']),
            models.Index(fields=['event_type']),
            models.Index(fields=['status', 'is_active']),
        ]

    def __str__(self):
        return f"{self.title} - {self.date}"
