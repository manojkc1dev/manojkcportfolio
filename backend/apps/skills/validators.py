"""
Validators for skills app.
"""
from django.core.exceptions import ValidationError
from .models import Skill


def validate_skill_slug(slug, instance=None):
    """Validate skill slug is unique."""
    queryset = Skill.objects.filter(slug=slug)
    if instance:
        queryset = queryset.exclude(id=instance.id)
    
    if queryset.exists():
        raise ValidationError('Skill with this slug already exists.')


def validate_skill_percentage(value):
    """Validate skill percentage."""
    if not 0 <= value <= 100:
        raise ValidationError('Percentage must be between 0 and 100.')
    return value


def validate_skill_experience_years(value):
    """Validate experience years."""
    if value and value < 0:
        raise ValidationError('Experience years cannot be negative.')
    return value
