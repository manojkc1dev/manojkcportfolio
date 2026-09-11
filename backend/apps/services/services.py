"""
Services for services app.
"""
from django.db import transaction
from .models import Service
from .selectors import ServiceSelector


class ServiceService:
    """
    Service for Service business logic.
    """
    
    @staticmethod
    @transaction.atomic
    def create_service(data, user):
        """Create a new service."""
        service = Service.objects.create(
            created_by=user,
            updated_by=user,
            **data
        )
        return service
    
    @staticmethod
    @transaction.atomic
    def update_service(service_id, data, user):
        """Update an existing service."""
        service = Service.objects.filter(id=service_id).first()
        if not service:
            return None
        
        for attr, value in data.items():
            setattr(service, attr, value)
        service.updated_by = user
        service.save()
        return service
    
    @staticmethod
    @transaction.atomic
    def delete_service(service_id):
        """Delete a service."""
        service = Service.objects.filter(id=service_id).first()
        if not service:
            return False
        
        service.delete()
        return True
    
    @staticmethod
    def toggle_featured(service_id, user):
        """Toggle featured status."""
        service = Service.objects.filter(id=service_id).first()
        if not service:
            return None
        
        service.is_featured = not service.is_featured
        service.updated_by = user
        service.save()
        return service
    
    @staticmethod
    def publish_service(service_id, user):
        """Publish a service."""
        service = Service.objects.filter(id=service_id).first()
        if not service:
            return None
        
        service.status = 'published'
        service.updated_by = user
        service.save()
        return service
