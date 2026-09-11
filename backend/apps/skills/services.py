"""
Services for skills app.
"""
from django.db import transaction
from .models import Skill
from .selectors import SkillSelector


class SkillService:
    """
    Service for Skill business logic.
    """
    
    @staticmethod
    @transaction.atomic
    def create_skill(data, user):
        """Create a new skill."""
        skill = Skill.objects.create(
            created_by=user,
            updated_by=user,
            **data
        )
        return skill
    
    @staticmethod
    @transaction.atomic
    def update_skill(skill_id, data, user):
        """Update an existing skill."""
        skill = Skill.objects.filter(id=skill_id).first()
        if not skill:
            return None
        
        for attr, value in data.items():
            setattr(skill, attr, value)
        skill.updated_by = user
        skill.save()
        return skill
    
    @staticmethod
    @transaction.atomic
    def delete_skill(skill_id):
        """Delete a skill."""
        skill = Skill.objects.filter(id=skill_id).first()
        if not skill:
            return False
        
        skill.delete()
        return True
    
    @staticmethod
    def toggle_featured(skill_id, user):
        """Toggle featured status."""
        skill = Skill.objects.filter(id=skill_id).first()
        if not skill:
            return None
        
        skill.is_featured = not skill.is_featured
        skill.updated_by = user
        skill.save()
        return skill
    
    @staticmethod
    def publish_skill(skill_id, user):
        """Publish a skill."""
        skill = Skill.objects.filter(id=skill_id).first()
        if not skill:
            return None
        
        skill.status = 'published'
        skill.updated_by = user
        skill.save()
        return skill
