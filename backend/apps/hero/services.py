"""
Services for hero app.
"""
from django.db import transaction
from .models import Hero
from .selectors import HeroSelector


class HeroService:
    """
    Service for Hero business logic.
    """
    
    @staticmethod
    @transaction.atomic
    def create_hero(data, user):
        """Create a new hero section."""
        hero = Hero.objects.create(
            created_by=user,
            updated_by=user,
            **data
        )
        return hero
    
    @staticmethod
    @transaction.atomic
    def update_hero(hero_id, data, user):
        """Update an existing hero section."""
        hero = HeroSelector.get_by_id(hero_id)
        if not hero:
            return None
        
        for attr, value in data.items():
            setattr(hero, attr, value)
        hero.updated_by = user
        hero.save()
        return hero
    
    @staticmethod
    @transaction.atomic
    def delete_hero(hero_id):
        """Delete a hero section."""
        hero = HeroSelector.get_by_id(hero_id)
        if not hero:
            return False
        
        hero.delete()
        return True
    
    @staticmethod
    def set_availability(hero_id, status, user):
        """Set availability status."""
        hero = HeroSelector.get_by_id(hero_id)
        if not hero:
            return None
        
        hero.availability_status = status
        hero.updated_by = user
        hero.save()
        return hero
    
    @staticmethod
    def publish_hero(hero_id, user):
        """Publish a hero section."""
        hero = HeroSelector.get_by_id(hero_id)
        if not hero:
            return None
        
        hero.status = 'published'
        hero.updated_by = user
        hero.save()
        return hero
