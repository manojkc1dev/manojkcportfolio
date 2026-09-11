"""
Search model for portfolio CMS.
"""
from django.db import models
from core.models import BaseModel


class SearchQuery(BaseModel):
    """
    Track search queries for analytics.
    """
    query = models.CharField(max_length=255, db_index=True)
    results_count = models.PositiveIntegerField(default=0)
    
    # User Info
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    
    # Filters
    search_type = models.CharField(
        max_length=20,
        choices=[
            ('all', 'All'),
            ('projects', 'Projects'),
            ('blogs', 'Blogs'),
            ('skills', 'Skills'),
        ],
        default='all'
    )
    
    class Meta:
        db_table = 'search_queries'
        verbose_name = 'Search Query'
        verbose_name_plural = 'Search Queries'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['query']),
            models.Index(fields=['created_at']),
        ]

    def __str__(self):
        return self.query
