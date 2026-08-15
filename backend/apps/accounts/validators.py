"""
Custom validators for accounts app.
"""
from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model
import re

User = get_user_model()


def validate_email_unique(email):
    """
    Validate that email is unique.
    """
    if User.objects.filter(email=email).exists():
        raise ValidationError('A user with this email already exists.')


def validate_username_unique(username):
    """
    Validate that username is unique.
    """
    if User.objects.filter(username=username).exists():
        raise ValidationError('A user with this username already exists.')


def validate_password_strength(password):
    """
    Validate password strength.
    Must be at least 12 characters with uppercase, lowercase, number, and special character.
    """
    if len(password) < 12:
        raise ValidationError('Password must be at least 12 characters long.')
    
    if not re.search(r'[A-Z]', password):
        raise ValidationError('Password must contain at least one uppercase letter.')
    
    if not re.search(r'[a-z]', password):
        raise ValidationError('Password must contain at least one lowercase letter.')
    
    if not re.search(r'[0-9]', password):
        raise ValidationError('Password must contain at least one number.')
    
    if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        raise ValidationError('Password must contain at least one special character.')


def validate_phone_number(phone):
    """
    Validate phone number format.
    """
    if phone and not re.match(r'^\+?[\d\s-()]+$', phone):
        raise ValidationError('Invalid phone number format.')


def validate_url(url):
    """
    Validate URL format.
    """
    if url and not (url.startswith('http://') or url.startswith('https://')):
        raise ValidationError('URL must start with http:// or https://')


def validate_role(role):
    """
    Validate role is valid.
    """
    valid_roles = [choice[0] for choice in User.ROLE_CHOICES]
    if role not in valid_roles:
        raise ValidationError(f'Invalid role. Must be one of: {", ".join(valid_roles)}')
