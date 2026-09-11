"""
Services for projects app.
"""
from django.db import transaction
from .models import Project
from .selectors import ProjectSelector


class ProjectService:
    """
    Service for Project business logic.
    """
    
    @staticmethod
    @transaction.atomic
    def create_project(data, user):
        """Create a new project."""
        project = Project.objects.create(
            created_by=user,
            updated_by=user,
            **data
        )
        return project
    
    @staticmethod
    @transaction.atomic
    def update_project(project_id, data, user):
        """Update an existing project."""
        project = Project.objects.filter(id=project_id).first()
        if not project:
            return None
        
        for attr, value in data.items():
            setattr(project, attr, value)
        project.updated_by = user
        project.save()
        return project
    
    @staticmethod
    @transaction.atomic
    def delete_project(project_id):
        """Delete a project."""
        project = Project.objects.filter(id=project_id).first()
        if not project:
            return False
        
        project.delete()
        return True
    
    @staticmethod
    def increment_view_count(project):
        """Increment project view count."""
        project.view_count += 1
        project.save(update_fields=['view_count'])
        return project
    
    @staticmethod
    def increment_like_count(project):
        """Increment project like count."""
        project.like_count += 1
        project.save(update_fields=['like_count'])
        return project
    
    @staticmethod
    def increment_share_count(project):
        """Increment project share count."""
        project.share_count += 1
        project.save(update_fields=['share_count'])
        return project
    
    @staticmethod
    def publish_project(project_id, user):
        """Publish a project."""
        project = Project.objects.filter(id=project_id).first()
        if not project:
            return None
        
        project.status = 'published'
        project.updated_by = user
        project.save()
        return project
    
    @staticmethod
    def toggle_featured(project_id, user):
        """Toggle featured status."""
        project = Project.objects.filter(id=project_id).first()
        if not project:
            return None
        
        project.is_featured = not project.is_featured
        project.updated_by = user
        project.save()
        return project
