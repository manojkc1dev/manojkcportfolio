"""
Blog CMS model for portfolio.
"""
from django.db import models
from core.models import BaseModel, StatusModel, OrderableModel, SEOModel


class BlogCategory(BaseModel, StatusModel, OrderableModel):
    """
    Blog categories for organizing posts.
    """
    name = models.CharField(max_length=100, db_index=True)
    slug = models.SlugField(max_length=100, unique=True, db_index=True)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, blank=True)
    color = models.CharField(max_length=7, blank=True, help_text='Hex color code')
    
    class Meta:
        db_table = 'blog_categories'
        verbose_name = 'Blog Category'
        verbose_name_plural = 'Blog Categories'
        ordering = ['order', 'name']
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['status', 'is_active']),
        ]

    def __str__(self):
        return self.name


class BlogTag(BaseModel, StatusModel):
    """
    Blog tags for categorizing posts.
    """
    name = models.CharField(max_length=50, db_index=True)
    slug = models.SlugField(max_length=50, unique=True, db_index=True)
    
    class Meta:
        db_table = 'blog_tags'
        verbose_name = 'Blog Tag'
        verbose_name_plural = 'Blog Tags'
        ordering = ['name']
        indexes = [
            models.Index(fields=['slug']),
        ]

    def __str__(self):
        return self.name


class Blog(BaseModel, StatusModel, OrderableModel, SEOModel):
    """
    Blog posts with markdown support.
    """
    # Basic Information
    title = models.CharField(max_length=255, db_index=True)
    slug = models.SlugField(max_length=255, unique=True, db_index=True)
    excerpt = models.CharField(max_length=500, blank=True)
    content = models.TextField()
    
    # Categorization
    category = models.ForeignKey(
        BlogCategory,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='blogs'
    )
    tags = models.ManyToManyField(
        BlogTag,
        blank=True,
        related_name='blogs'
    )
    
    # Featured Image
    featured_image = models.ImageField(upload_to='blogs/featured/', blank=True, null=True)
    
    # Author
    author = models.ForeignKey(
        'accounts.User',
        on_delete=models.SET_NULL,
        null=True,
        related_name='blogs'
    )
    
    # Reading Time
    reading_time = models.PositiveIntegerField(default=0, help_text='Reading time in minutes')
    
    # Publishing
    published_at = models.DateTimeField(null=True, blank=True)
    scheduled_at = models.DateTimeField(null=True, blank=True, help_text='Schedule for future publishing')
    
    # Statistics
    view_count = models.PositiveIntegerField(default=0)
    like_count = models.PositiveIntegerField(default=0)
    comment_count = models.PositiveIntegerField(default=0)
    share_count = models.PositiveIntegerField(default=0)
    
    # Display
    is_featured = models.BooleanField(default=False, db_index=True)
    allow_comments = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'blogs'
        verbose_name = 'Blog'
        verbose_name_plural = 'Blogs'
        ordering = ['-published_at', '-created_at']
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['category']),
            models.Index(fields=['published_at']),
            models.Index(fields=['status', 'is_active']),
            models.Index(fields=['is_featured']),
            models.Index(fields=['status', 'is_active', 'published_at']),
            models.Index(fields=['author']),
            models.Index(fields=['created_at']),
        ]

    def __str__(self):
        return self.title

    def increment_view_count(self):
        """Increment view count."""
        self.view_count += 1
        self.save(update_fields=['view_count'])
