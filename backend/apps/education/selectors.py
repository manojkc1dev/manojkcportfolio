"""
Selectors for education app.
"""
from .models import Education


class EducationSelector:
    """
    Selector for Education model queries.
    """
    
    @staticmethod
    def get_published_education():
        """Get all published education."""
        return Education.objects.filter(
            status='published',
            is_active=True,
            show_on_homepage=True
        ).order_by('-start_date')
    
    @staticmethod
    def get_by_id(education_id):
        """Get education by ID."""
        return Education.objects.filter(id=education_id).first()
    
    @staticmethod
    def get_current_education():
        """Get current education."""
        return Education.objects.filter(
            status='published',
            is_active=True,
            is_current=True
        ).order_by('-start_date')
