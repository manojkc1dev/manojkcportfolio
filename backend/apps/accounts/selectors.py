"""
Query selectors for accounts app.
"""
from django.contrib.auth import get_user_model
from .models import UserProfile, LoginLog

User = get_user_model()


def get_user_by_email(email):
    """Get user by email."""
    try:
        return User.objects.get(email=email)
    except User.DoesNotExist:
        return None


def get_user_by_username(username):
    """Get user by username."""
    try:
        return User.objects.get(username=username)
    except User.DoesNotExist:
        return None


def get_user_by_id(user_id):
    """Get user by ID."""
    try:
        return User.objects.get(id=user_id)
    except User.DoesNotExist:
        return None


def get_users_by_role(role):
    """Get users by role."""
    return User.objects.filter(role=role, is_active=True)


def get_active_users():
    """Get all active users."""
    return User.objects.filter(is_active=True)


def get_verified_users():
    """Get all verified users."""
    return User.objects.filter(is_verified=True, is_active=True)


def get_user_profile(user):
    """Get user profile."""
    try:
        return UserProfile.objects.get(user=user)
    except UserProfile.DoesNotExist:
        return None


def get_user_login_logs(user, limit=50):
    """Get user login logs."""
    return LoginLog.objects.filter(user=user).order_by('-created_at')[:limit]


def get_recent_login_logs(limit=100):
    """Get recent login logs."""
    return LoginLog.objects.all().order_by('-created_at')[:limit]


def get_failed_login_attempts(user):
    """Get failed login attempts for user."""
    return LoginLog.objects.filter(user=user, success=False).count()


def get_locked_users():
    """Get all locked users."""
    from django.utils import timezone
    return User.objects.filter(
        locked_until__isnull=False,
        locked_until__gt=timezone.now()
    )
