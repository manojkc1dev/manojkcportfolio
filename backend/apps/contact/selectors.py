"""
Selectors for contact app.
"""
from .models import Contact


class ContactSelector:
    """
    Selector for Contact model queries.
    """
    
    @staticmethod
    def get_all_contacts():
        """Get all contact submissions."""
        return Contact.objects.all().order_by('-created_at')
    
    @staticmethod
    def get_by_id(contact_id):
        """Get contact by ID."""
        return Contact.objects.filter(id=contact_id).first()
    
    @staticmethod
    def get_pending_contacts():
        """Get pending contact submissions."""
        return Contact.objects.filter(
            contact_status='pending'
        ).order_by('-created_at')
    
    @staticmethod
    def get_starred_contacts():
        """Get starred contact submissions."""
        return Contact.objects.filter(
            is_starred=True
        ).order_by('-created_at')
    
    @staticmethod
    def get_spam_contacts():
        """Get spam contact submissions."""
        return Contact.objects.filter(
            is_spam=True
        ).order_by('-created_at')
