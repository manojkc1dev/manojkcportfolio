"""
Selectors for experience app.
"""
from .models import Experience


class ExperienceSelector:
    """
    Selector for Experience model queries.
    """
    
    @staticmethod
    def get_published_experience():
        """Get all published work experience."""
        return Experience.objects.filter(
            status='published',
            is_active=True,
            show_on_homepage=True
        ).order_by('-start_date')
    
    @staticmethod
    def get_by_id(experience_id):
        """Get experience by ID."""
        return Experience.objects.filter(id=experience_id).first()
    
    @staticmethod
    def get_current_experience():
        """Get current work experience."""
        return Experience.objects.filter(
            status='published',
            is_active=True,
            is_current=True
        ).order_by('-start_date')
