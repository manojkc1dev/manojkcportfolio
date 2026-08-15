"""
Selectors for hero app.
"""
from django.db import models
from .models import Hero


class HeroSelector:
    """
    Selector for Hero model queries.
    """
    
    @staticmethod
    def get_published_hero():
        """Get published hero section for homepage."""
        return Hero.objects.filter(
            status='published',
            is_active=True,
            show_on_homepage=True
        ).first()
    
    @staticmethod
    def get_all_published():
        """Get all published hero sections."""
        return Hero.objects.filter(
            status='published',
            is_active=True
        ).order_by('order')
    
    @staticmethod
    def get_by_id(hero_id):
        """Get hero by ID."""
        return Hero.objects.filter(id=hero_id).first()
    
    @staticmethod
    def get_available_heroes():
        """Get heroes with available status."""
        return Hero.objects.filter(
            availability_status='available',
            status='published',
            is_active=True
        )
