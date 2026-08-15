"""
Project model with comprehensive fields for portfolio.
"""
from django.db import models
from django.contrib.auth import get_user_model
from core.models import BaseModel, StatusModel, OrderableModel, SEOModel
from apps.project_categories.models import ProjectCategory

User = get_user_model()


class Project(BaseModel, StatusModel, OrderableModel, SEOModel):
    """
    Comprehensive project model for portfolio.
    """
    VISIBILITY_CHOICES = [
        ('public', 'Public'),
        ('private', 'Private'),
    ]

    # Basic Information
    title = models.CharField(max_length=255, db_index=True)
    slug = models.SlugField(max_length=255, unique=True, db_index=True)
    category = models.ForeignKey(
        ProjectCategory,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='projects'
    )
    
    # Images
    thumbnail = models.ImageField(upload_to='projects/thumbnails/', blank=True, null=True)
    cover_image = models.ImageField(upload_to='projects/covers/', blank=True, null=True)
    
    # Description
    short_description = models.CharField(max_length=500, blank=True)
    description = models.TextField()
    problem = models.TextField(blank=True, help_text='Problem statement')
    solution = models.TextField(blank=True, help_text='Solution provided')
    architecture = models.TextField(blank=True, help_text='Architecture details')
    
    # Project Details
    role = models.CharField(max_length=100, blank=True)
    client = models.CharField(max_length=100, blank=True)
    company = models.CharField(max_length=100, blank=True)
    duration = models.CharField(max_length=50, blank=True, help_text='e.g., 3 months')
    team_size = models.PositiveIntegerField(blank=True, null=True)
    responsibilities = models.TextField(blank=True)
    
    # Tech Stack
    programming_language = models.CharField(max_length=100, blank=True)
    framework = models.CharField(max_length=100, blank=True)
    database = models.CharField(max_length=100, blank=True)
    api = models.CharField(max_length=100, blank=True)
    authentication = models.CharField(max_length=100, blank=True)
    deployment = models.CharField(max_length=100, blank=True)
    
    # Links
    github_url = models.URLField(blank=True)
    live_demo_url = models.URLField(blank=True)
    documentation_url = models.URLField(blank=True)
    figma_url = models.URLField(blank=True)
    case_study_url = models.URLField(blank=True)
    
    # Visibility and Featured
    visibility = models.CharField(max_length=10, choices=VISIBILITY_CHOICES, default='public')
    is_featured = models.BooleanField(default=False, db_index=True)
    is_pinned = models.BooleanField(default=False, db_index=True)
    
    # Additional
    challenges = models.TextField(blank=True)
    future_improvements = models.TextField(blank=True)
    
    # Statistics
    view_count = models.PositiveIntegerField(default=0)
    like_count = models.PositiveIntegerField(default=0)
    share_count = models.PositiveIntegerField(default=0)
    
    class Meta:
        db_table = 'projects'
        verbose_name = 'Project'
        verbose_name_plural = 'Projects'
        ordering = ['-is_pinned', '-is_featured', 'order', '-created_at']
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['status', 'is_active']),
            models.Index(fields=['visibility', 'is_featured']),
            models.Index(fields=['category']),
            models.Index(fields=['status', 'visibility', 'is_active']),
            models.Index(fields=['is_featured', 'is_active']),
            models.Index(fields=['created_at']),
            models.Index(fields=['view_count']),
        ]

    def __str__(self):
        return self.title

    def increment_view_count(self):
        """Increment view count."""
        self.view_count += 1
        self.save(update_fields=['view_count'])

    def increment_like_count(self):
        """Increment like count."""
        self.like_count += 1
        self.save(update_fields=['like_count'])

    def increment_share_count(self):
        """Increment share count."""
        self.share_count += 1
        self.save(update_fields=['share_count'])
