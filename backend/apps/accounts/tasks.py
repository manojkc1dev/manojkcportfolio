"""
Celery tasks for accounts app.
"""
from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from django.utils import timezone
import logging

logger = logging.getLogger(__name__)


@shared_task(bind=True, max_retries=3, default_retry_delay=60)
def send_verification_email(self, user_id):
    """
    Send email verification email to user.
    """
    from django.contrib.auth import get_user_model
    User = get_user_model()
    
    try:
        user = User.objects.get(id=user_id)
        
        # Generate verification token
        token = user.generate_verification_token()
        
        # Build verification URL
        frontend_url = settings.FRONTEND_URL if hasattr(settings, 'FRONTEND_URL') else 'http://localhost:3000'
        verification_url = f"{frontend_url}/verify-email?token={token}"
        
        # Render email templates
        context = {
            'user': user,
            'verification_url': verification_url,
            'site_name': settings.SITE_NAME if hasattr(settings, 'SITE_NAME') else 'Portfolio CMS',
            'year': timezone.now().year,
        }
        
        html_message = render_to_string('accounts/verification_email.html', context)
        plain_message = render_to_string('accounts/verification_email.txt', context)
        
        # Send email
        send_mail(
            subject='Verify Your Email Address',
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            html_message=html_message,
            fail_silently=False,
        )
        
        logger.info(f"Verification email sent to {user.email}")
        return {'status': 'success', 'user_id': user_id}
        
    except User.DoesNotExist:
        logger.error(f"User with id {user_id} not found")
        return {'status': 'error', 'message': 'User not found'}
    except Exception as e:
        logger.error(f"Failed to send verification email to user {user_id}: {str(e)}")
        if self.request.retries < self.max_retries:
            raise self.retry(exc=e)
        return {'status': 'error', 'message': str(e)}


@shared_task(bind=True, max_retries=3, default_retry_delay=60)
def send_password_reset_email(self, user_id):
    """
    Send password reset email to user.
    """
    from django.contrib.auth import get_user_model
    User = get_user_model()
    
    try:
        user = User.objects.get(id=user_id)
        
        # Generate password reset token
        token = user.generate_password_reset_token()
        
        # Build reset URL
        frontend_url = settings.FRONTEND_URL if hasattr(settings, 'FRONTEND_URL') else 'http://localhost:3000'
        reset_url = f"{frontend_url}/reset-password?token={token}"
        
        # Render email templates
        context = {
            'user': user,
            'reset_url': reset_url,
            'site_name': settings.SITE_NAME if hasattr(settings, 'SITE_NAME') else 'Portfolio CMS',
            'year': timezone.now().year,
        }
        
        html_message = render_to_string('accounts/password_reset_email.html', context)
        plain_message = render_to_string('accounts/password_reset_email.txt', context)
        
        # Send email
        send_mail(
            subject='Reset Your Password',
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            html_message=html_message,
            fail_silently=False,
        )
        
        logger.info(f"Password reset email sent to {user.email}")
        return {'status': 'success', 'user_id': user_id}
        
    except User.DoesNotExist:
        logger.error(f"User with id {user_id} not found")
        return {'status': 'error', 'message': 'User not found'}
    except Exception as e:
        logger.error(f"Failed to send password reset email to user {user_id}: {str(e)}")
        if self.request.retries < self.max_retries:
            raise self.retry(exc=e)
        return {'status': 'error', 'message': str(e)}


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
