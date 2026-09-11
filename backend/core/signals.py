"""
Signals for core app.
"""
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from .models import AuditLog

User = get_user_model()


@receiver(post_save)
def audit_log_create(sender, instance, created, **kwargs):
    """
    Signal to log create actions.
    """
    # Skip audit log itself to avoid infinite loop
    if sender == AuditLog:
        return

    # Skip if instance doesn't have created_by field
    if not hasattr(instance, 'created_by'):
        return

    if created:
        try:
            AuditLog.objects.create(
                user=instance.created_by,
                action='create',
                model_name=sender.__name__,
                object_id=instance.id,
                object_repr=str(instance),
                changes={'created': True}
            )
        except Exception:
            pass


@receiver(post_delete)
def audit_log_delete(sender, instance, **kwargs):
    """
    Signal to log delete actions.
    """
    # Skip audit log itself
    if sender == AuditLog:
        return

    try:
        AuditLog.objects.create(
            user=getattr(instance, 'deleted_by', None),
            action='delete',
            model_name=sender.__name__,
            object_id=instance.id,
            object_repr=str(instance),
            changes={'deleted': True}
        )
    except Exception:
        pass
