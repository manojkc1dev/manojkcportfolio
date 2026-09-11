"""
Services for contact app.
"""
from django.db import transaction
from .models import Contact
from .selectors import ContactSelector


class ContactService:
    """
    Service for Contact business logic.
    """
    
    @staticmethod
    @transaction.atomic
    def create_contact(data, user=None):
        """Create a new contact submission."""
        contact = Contact.objects.create(
            created_by=user,
            updated_by=user,
            **data
        )
        return contact
    
    @staticmethod
    @transaction.atomic
    def update_contact(contact_id, data, user):
        """Update an existing contact submission."""
        contact = ContactSelector.get_by_id(contact_id)
        if not contact:
            return None
        
        for attr, value in data.items():
            setattr(contact, attr, value)
        contact.updated_by = user
        contact.save()
        return contact
    
    @staticmethod
    @transaction.atomic
    def delete_contact(contact_id):
        """Delete a contact submission."""
        contact = ContactSelector.get_by_id(contact_id)
        if not contact:
            return False
        
        contact.delete()
        return True
    
    @staticmethod
    def mark_as_replied(contact_id, reply_text, user):
        """Mark contact as replied."""
        contact = ContactSelector.get_by_id(contact_id)
        if not contact:
            return None
        
        contact.contact_status = 'replied'
        contact.reply = reply_text
        contact.replied_by = user
        from django.utils import timezone
        contact.replied_at = timezone.now()
        contact.updated_by = user
        contact.save()
        return contact
    
    @staticmethod
    def toggle_starred(contact_id, user):
        """Toggle starred status."""
        contact = ContactSelector.get_by_id(contact_id)
        if not contact:
            return None
        
        contact.is_starred = not contact.is_starred
        contact.updated_by = user
        contact.save()
        return contact
    
    @staticmethod
    def mark_as_spam(contact_id, user):
        """Mark contact as spam."""
        contact = ContactSelector.get_by_id(contact_id)
        if not contact:
            return None
        
        contact.is_spam = True
        contact.updated_by = user
        contact.save()
        return contact
