"""
Selectors for blogs app.
"""
from django.db import models
from .models import Blog, BlogCategory, BlogTag


class BlogSelector:
    """
    Selector for Blog model queries.
    """
    
    @staticmethod
    def get_published_blogs():
        """Get all published blogs."""
        return Blog.objects.filter(
            status='published',
            is_active=True
        ).select_related('category', 'author').prefetch_related('tags').order_by('-published_at')
    
    @staticmethod
    def get_featured_blogs(limit=3):
        """Get featured blogs."""
        return Blog.objects.filter(
            status='published',
            is_active=True,
            is_featured=True
        ).select_related('category', 'author')[:limit]
    
    @staticmethod
    def get_blog_by_slug(slug):
        """Get blog by slug."""
        return Blog.objects.filter(
            slug=slug,
            status='published',
            is_active=True
        ).select_related('category', 'author').prefetch_related('tags').first()
    
    @staticmethod
    def get_blogs_by_category(category_slug):
        """Get blogs by category."""
        return Blog.objects.filter(
            category__slug=category_slug,
            status='published',
            is_active=True
        ).select_related('category', 'author').prefetch_related('tags')
    
    @staticmethod
    def get_blogs_by_tag(tag_slug):
        """Get blogs by tag."""
        return Blog.objects.filter(
            tags__slug=tag_slug,
            status='published',
            is_active=True
        ).select_related('category', 'author').prefetch_related('tags').distinct()
    
    @staticmethod
    def search_blogs(query):
        """Search blogs by title, excerpt, content."""
        return Blog.objects.filter(
            status='published',
            is_active=True
        ).filter(
            models.Q(title__icontains=query) |
            models.Q(excerpt__icontains=query) |
            models.Q(content__icontains=query)
        ).select_related('category', 'author').prefetch_related('tags')


class BlogCategorySelector:
    """
    Selector for BlogCategory model queries.
    """
    
    @staticmethod
    def get_published_categories():
        """Get all published categories."""
        return BlogCategory.objects.filter(
            status='published',
            is_active=True
        ).order_by('order')
    
    @staticmethod
    def get_category_by_slug(slug):
        """Get category by slug."""
        return BlogCategory.objects.filter(
            slug=slug,
            status='published',
            is_active=True
        ).first()


class BlogTagSelector:
    """
    Selector for BlogTag model queries.
    """
    
    @staticmethod
    def get_published_tags():
        """Get all published tags."""
        return BlogTag.objects.filter(
            status='published',
            is_active=True
        ).order_by('name')
    
    @staticmethod
    def get_tag_by_slug(slug):
        """Get tag by slug."""
        return BlogTag.objects.filter(
            slug=slug,
            status='published',
            is_active=True
        ).first()
