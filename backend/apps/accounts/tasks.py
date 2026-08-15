"""
Celery tasks for accounts app.
"""
from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings
import logging

logger = logging.getLogger(__name__)


@shared_task
def send_verification_email(user_id):
    """
    Send email verification email to user.
    """
    from django.contrib.auth import get_user_model
    User = get_user_model()
    
    try:
        user = User.objects.get(id=user_id)
        # TODO: Implement actual email sending with verification link
        logger.info(f"Verification email sent to {user.email}")
    except User.DoesNotExist:
        logger.error(f"User with id {user_id} not found")


@shared_task
def send_password_reset_email(user_id):
    """
    Send password reset email to user.
    """
    from django.contrib.auth import get_user_model
    User = get_user_model()
    
    try:
        user = User.objects.get(id=user_id)
        # TODO: Implement actual email sending with reset link
        logger.info(f"Password reset email sent to {user.email}")
    except User.DoesNotExist:
        logger.error(f"User with id {user_id} not found")


@shared_task
def send_welcome_email(user_id):
    """
    Send welcome email to new user.
    """
    from django.contrib.auth import get_user_model
    User = get_user_model()
    
    try:
        user = User.objects.get(id=user_id)
        subject = 'Welcome to Portfolio CMS'
        message = f'Hi {user.get_full_name()},\n\nWelcome to Portfolio CMS! Your account has been created successfully.'
        
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
            fail_silently=False,
        )
        logger.info(f"Welcome email sent to {user.email}")
    except User.DoesNotExist:
        logger.error(f"User with id {user_id} not found")


@shared_task
def cleanup_old_login_logs(days=90):
    """
    Clean up login logs older than specified days.
    """
    from django.utils import timezone
    from datetime import timedelta
    from .models import LoginLog
    
    cutoff_date = timezone.now() - timedelta(days=days)
    deleted_count = LoginLog.objects.filter(created_at__lt=cutoff_date).delete()[0]
    logger.info(f"Deleted {deleted_count} old login logs")
    return deleted_count


@shared_task
def unlock_locked_accounts():
    """
    Unlock accounts whose lock period has expired.
    """
    from django.utils import timezone
    from django.contrib.auth import get_user_model
    User = get_user_model()
    
    unlocked_count = User.objects.filter(
        locked_until__isnull=False,
        locked_until__lte=timezone.now()
    ).update(locked_until=None, failed_login_attempts=0)
    
    logger.info(f"Unlocked {unlocked_count} accounts")
    return unlocked_count
