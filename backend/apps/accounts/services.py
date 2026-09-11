"""
Business logic services for accounts app.
"""
from django.contrib.auth import get_user_model
from .models import LoginLog
import logging

logger = logging.getLogger(__name__)

User = get_user_model()


def get_client_ip(request):
    """Get client IP address from request."""
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


def get_user_agent(request):
    """Get user agent from request."""
    return request.META.get('HTTP_USER_AGENT', '')


def get_device_type(user_agent):
    """Determine device type from user agent."""
    user_agent = user_agent.lower()
    if 'mobile' in user_agent or 'android' in user_agent or 'iphone' in user_agent:
        return 'mobile'
    elif 'tablet' in user_agent or 'ipad' in user_agent:
        return 'tablet'
    else:
        return 'desktop'


def get_location_from_ip(ip_address):
    """
    Get location from IP address.
    Placeholder for IP geolocation service integration.
    """
    # TODO: Integrate with IP geolocation service
    return 'Unknown'


def log_login(user, request, success=True, failure_reason=None):
    """
    Log user login attempt.
    """
    try:
        ip_address = get_client_ip(request)
        user_agent = get_user_agent(request)
        device_type = get_device_type(user_agent)
        location = get_location_from_ip(ip_address)

        LoginLog.objects.create(
            user=user if success else None,
            ip_address=ip_address,
            user_agent=user_agent,
            success=success,
            failure_reason=failure_reason or '',
            location=location,
            device_type=device_type
        )

        # Update user last login IP
        if success:
            user.last_login_ip = ip_address
            user.save()

    except Exception as e:
        logger.error(f"Error logging login: {e}")


def log_logout(user, request):
    """
    Log user logout.
    """
    try:
        from core.models import AuditLog
        AuditLog.objects.create(
            user=user,
            action='logout',
            model_name='User',
            object_id=user.id,
            object_repr=str(user),
            ip_address=get_client_ip(request),
            user_agent=get_user_agent(request),
            request_method='POST',
            request_path='/api/v1/auth/logout/'
        )
    except Exception as e:
        logger.error(f"Error logging logout: {e}")


def create_user_profile(user):
    """
    Create user profile for new user.
    """
    from .models import UserProfile
    profile, created = UserProfile.objects.get_or_create(user=user)
    return profile


def deactivate_user(user):
    """
    Deactivate user account.
    """
    user.is_active = False
    user.save()
    return user


def activate_user(user):
    """
    Activate user account.
    """
    user.is_active = True
    user.save()
    return user


def change_user_role(user, new_role):
    """
    Change user role (admin only).
    """
    user.role = new_role
    user.save()
    return user


def verify_user_email(user):
    """
    Mark user email as verified.
    """
    user.is_verified = True
    user.save()
    return user


def get_user_stats(user):
    """
    Get user statistics.
    """
    from apps.projects.models import Project
    from apps.blogs.models import Blog
    
    stats = {
        'projects_count': Project.objects.filter(created_by=user).count(),
        'blogs_count': Blog.objects.filter(created_by=user).count(),
        'login_count': LoginLog.objects.filter(user=user, success=True).count(),
    }
    return stats
