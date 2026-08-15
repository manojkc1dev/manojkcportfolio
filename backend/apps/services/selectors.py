"""
Selectors for services app.
"""
from .models import Service


class ServiceSelector:
    """
    Selector for Service model queries.
    """
    
    @staticmethod
    def get_published_services():
        """Get all published services."""
        return Service.objects.filter(
            status='published',
            is_active=True,
            show_on_homepage=True
        ).order_by('order')
    
    @staticmethod
    def get_featured_services(limit=6):
        """Get featured services."""
        return Service.objects.filter(
            status='published',
            is_active=True,
            is_featured=True
        )[:limit]
    
    @staticmethod
    def get_service_by_slug(slug):
        """Get service by slug."""
        return Service.objects.filter(
            slug=slug,
            status='published',
            is_active=True
        ).first()
