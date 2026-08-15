"""
Validators for contact app.
"""
from django.core.exceptions import ValidationError
from .models import Contact


def validate_contact_email(email):
    """Validate contact email."""
    if not email:
        raise ValidationError('Email is required.')
    return email


def validate_contact_message(message):
    """Validate contact message."""
    if not message or len(message) < 10:
        raise ValidationError('Message must be at least 10 characters long.')
    return message


def validate_contact_status(value):
    """Validate contact status."""
    valid_statuses = [choice[0] for choice in Contact.CONTACT_STATUS_CHOICES]
    if value not in valid_statuses:
        raise ValidationError(f'Invalid contact status. Must be one of: {valid_statuses}')
