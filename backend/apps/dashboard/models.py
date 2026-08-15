"""
Dashboard model for portfolio CMS.
"""
from django.db import models
from core.models import BaseModel


class DashboardStats(BaseModel):
    """
    Dashboard statistics and metrics.
    """
    # Project Stats
    total_projects = models.PositiveIntegerField(default=0)
    published_projects = models.PositiveIntegerField(default=0)
    draft_projects = models.PositiveIntegerField(default=0)
    
    # Visitor Stats
    total_visitors = models.PositiveIntegerField(default=0)
    unique_visitors = models.PositiveIntegerField(default=0)
    
    # Contact Stats
    total_contacts = models.PositiveIntegerField(default=0)
    pending_contacts = models.PositiveIntegerField(default=0)
    
    # Download Stats
    total_downloads = models.PositiveIntegerField(default=0)
    resume_downloads = models.PositiveIntegerField(default=0)
    
    # Content Stats
    total_blogs = models.PositiveIntegerField(default=0)
    published_blogs = models.PositiveIntegerField(default=0)
    total_skills = models.PositiveIntegerField(default=0)
    total_certifications = models.PositiveIntegerField(default=0)
    
    # Newsletter Stats
    total_subscribers = models.PositiveIntegerField(default=0)
    active_subscribers = models.PositiveIntegerField(default=0)
    
    # Date Range
    stats_date = models.DateField(db_index=True)
    
    class Meta:
        db_table = 'dashboard_stats'
        verbose_name = 'Dashboard Stats'
        verbose_name_plural = 'Dashboard Stats'
        ordering = ['-stats_date']
        indexes = [
            models.Index(fields=['stats_date']),
        ]

    def __str__(self):
        return f"Stats for {self.stats_date}"
