"""
Validators for hero app.
"""
from django.core.exceptions import ValidationError
from .models import Hero


def validate_hero_availability(value):
    """Validate availability status."""
    valid_statuses = ['available', 'busy', 'offline']
    if value not in valid_statuses:
        raise ValidationError(f'Invalid availability status. Must be one of: {valid_statuses}')


def validate_hero_images(data):
    """Validate hero images are present if required."""
    if not data.get('profile_image'):
        raise ValidationError('Profile image is required.')
    return data


def validate_cta_buttons(data):
    """Validate CTA button consistency."""
    if data.get('resume_button_text') and not data.get('resume_button_url'):
        raise ValidationError('Resume button URL is required when text is provided.')
    
    if data.get('hire_me_button_text') and not data.get('hire_me_button_url'):
        raise ValidationError('Hire me button URL is required when text is provided.')
    
    return data
