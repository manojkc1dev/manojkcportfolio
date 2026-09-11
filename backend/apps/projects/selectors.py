"""
Selectors for projects app.
"""
from django.db import models
from .models import Project


class ProjectSelector:
    """
    Selector for Project model queries.
    """
    
    @staticmethod
    def get_published_projects():
        """Get all published projects."""
        return Project.objects.filter(
            status='published',
            is_active=True,
            visibility='public'
        ).select_related('category').prefetch_related(
            'images', 'features', 'technologies', 'videos'
        ).order_by('-is_featured', '-is_pinned', '-created_at')
    
    @staticmethod
    def get_featured_projects(limit=6):
        """Get featured projects."""
        return Project.objects.filter(
            status='published',
            is_active=True,
            visibility='public',
            is_featured=True
        ).select_related('category')[:limit]
    
    @staticmethod
    def get_project_by_slug(slug):
        """Get project by slug."""
        return Project.objects.filter(
            slug=slug,
            status='published',
            is_active=True,
            visibility='public'
        ).select_related('category').prefetch_related(
            'images', 'features', 'technologies', 'videos'
        ).first()
    
    @staticmethod
    def get_projects_by_category(category_slug):
        """Get projects by category."""
        return Project.objects.filter(
            category__slug=category_slug,
            status='published',
            is_active=True,
            visibility='public'
        ).select_related('category')
    
    @staticmethod
    def search_projects(query):
        """Search projects by title, description."""
        return Project.objects.filter(
            status='published',
            is_active=True,
            visibility='public'
        ).filter(
            models.Q(title__icontains=query) |
            models.Q(short_description__icontains=query) |
            models.Q(description__icontains=query)
        ).select_related('category')
