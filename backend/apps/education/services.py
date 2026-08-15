"""
Services for education app.
"""
from django.db import transaction
from .models import Education
from .selectors import EducationSelector


class EducationService:
    """
    Service for Education business logic.
    """
    
    @staticmethod
    @transaction.atomic
    def create_education(data, user):
        """Create a new education entry."""
        education = Education.objects.create(
            created_by=user,
            updated_by=user,
            **data
        )
        return education
    
    @staticmethod
    @transaction.atomic
    def update_education(education_id, data, user):
        """Update an existing education entry."""
        education = EducationSelector.get_by_id(education_id)
        if not education:
            return None
        
        for attr, value in data.items():
            setattr(education, attr, value)
        education.updated_by = user
        education.save()
        return education
    
    @staticmethod
    @transaction.atomic
    def delete_education(education_id):
        """Delete an education entry."""
        education = EducationSelector.get_by_id(education_id)
        if not education:
            return False
        
        education.delete()
        return True
    
    @staticmethod
    def publish_education(education_id, user):
        """Publish an education entry."""
        education = EducationSelector.get_by_id(education_id)
        if not education:
            return None
        
        education.status = 'published'
        education.updated_by = user
        education.save()
        return education
