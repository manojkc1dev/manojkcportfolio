"""
Signals for accounts app.
"""
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from .models import UserProfile

User = get_user_model()


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """
    Create user profile when user is created.
    """
    if created:
        UserProfile.objects.get_or_create(user=instance)


@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    """
    Save user profile when user is saved.
    """
    try:
        if hasattr(instance, 'profile'):
            instance.profile.save()
    except UserProfile.DoesNotExist:
        UserProfile.objects.create(user=instance)


@receiver(post_delete, sender=User)
def log_user_deletion(sender, instance, **kwargs):
    """
    Log user deletion for compliance audit.
    """
    try:
        from apps.compliance.models import ComplianceAuditLog
        ComplianceAuditLog.objects.create(
            user=None,  # User is being deleted, so set to None
            action_type='delete',
            action_description=f'User account deleted: {instance.email}',
            object_repr=str(instance),
            ip_address=None,
        )
    except Exception:
        # Don't break user deletion if audit logging fails
        pass
