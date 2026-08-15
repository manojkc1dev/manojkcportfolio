"""
Validators for services app.
"""
from django.core.exceptions import ValidationError
from .models import Service


def validate_service_slug(slug, instance=None):
    """Validate service slug is unique."""
    queryset = Service.objects.filter(slug=slug)
    if instance:
        queryset = queryset.exclude(id=instance.id)
    
    if queryset.exists():
        raise ValidationError('Service with this slug already exists.')


def validate_price_type(value):
    """Validate price type."""
    valid_types = ['fixed', 'hourly', 'project', 'custom']
    if value and value not in valid_types:
        raise ValidationError(f'Invalid price type. Must be one of: {valid_types}')
