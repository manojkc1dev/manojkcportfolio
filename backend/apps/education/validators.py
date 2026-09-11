"""
Validators for education app.
"""
from django.core.exceptions import ValidationError
from .models import Education


def validate_education_dates(start_date, end_date, is_current):
    """Validate education dates."""
    if not is_current and end_date and end_date < start_date:
        raise ValidationError('End date cannot be before start date.')
    return True


def validate_cgpa(value):
    """Validate CGPA."""
    if value and not 0 <= value <= 10:
        raise ValidationError('CGPA must be between 0 and 10.')
    return value


def validate_percentage(value):
    """Validate percentage."""
    if value and not 0 <= value <= 100:
        raise ValidationError('Percentage must be between 0 and 100.')
    return value
