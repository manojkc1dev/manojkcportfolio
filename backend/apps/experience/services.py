"""
Services for experience app.
"""
from django.db import transaction
from .models import Experience
from .selectors import ExperienceSelector


class ExperienceService:
    """
    Service for Experience business logic.
    """
    
    @staticmethod
    @transaction.atomic
    def create_experience(data, user):
        """Create a new work experience."""
        experience = Experience.objects.create(
            created_by=user,
            updated_by=user,
            **data
        )
        return experience
    
    @staticmethod
    @transaction.atomic
    def update_experience(experience_id, data, user):
        """Update an existing work experience."""
        experience = ExperienceSelector.get_by_id(experience_id)
        if not experience:
            return None
        
        for attr, value in data.items():
            setattr(experience, attr, value)
        experience.updated_by = user
        experience.save()
        return experience
    
    @staticmethod
    @transaction.atomic
    def delete_experience(experience_id):
        """Delete a work experience."""
        experience = ExperienceSelector.get_by_id(experience_id)
        if not experience:
            return False
        
        experience.delete()
        return True
    
    @staticmethod
    def publish_experience(experience_id, user):
        """Publish a work experience."""
        experience = ExperienceSelector.get_by_id(experience_id)
        if not experience:
            return None
        
        experience.status = 'published'
        experience.updated_by = user
        experience.save()
        return experience
