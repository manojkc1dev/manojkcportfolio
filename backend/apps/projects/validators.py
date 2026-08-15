"""
Validators for projects app.
"""
from django.core.exceptions import ValidationError
from .models import Project


def validate_project_slug(slug, instance=None):
    """Validate project slug is unique."""
    queryset = Project.objects.filter(slug=slug)
    if instance:
        queryset = queryset.exclude(id=instance.id)
    
    if queryset.exists():
        raise ValidationError('Project with this slug already exists.')


def validate_project_visibility(value):
    """Validate visibility status."""
    valid_visibilities = [choice[0] for choice in Project.VISIBILITY_CHOICES]
    if value not in valid_visibilities:
        raise ValidationError(f'Invalid visibility. Must be one of: {valid_visibilities}')


def validate_project_images(data):
    """Validate project has required images."""
    if not data.get('thumbnail'):
        raise ValidationError('Thumbnail image is required.')
    return data


def validate_github_url(url):
    """Validate GitHub URL format."""
    if url and 'github.com' not in url:
        raise ValidationError('Invalid GitHub URL.')
    return url
