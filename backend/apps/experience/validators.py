"""
Validators for experience app.
"""
from django.core.exceptions import ValidationError
from .models import Experience


def validate_employment_type(value):
    """Validate employment type."""
    valid_types = [choice[0] for choice in Experience.EMPLOYMENT_TYPE_CHOICES]
    if value not in valid_types:
        raise ValidationError(f'Invalid employment type. Must be one of: {valid_types}')


def validate_experience_dates(start_date, end_date, is_current):
    """Validate experience dates."""
    if not is_current and end_date and end_date < start_date:
        raise ValidationError('End date cannot be before start date.')
    return True
