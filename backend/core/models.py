"""
Core models for Portfolio CMS.
Provides base models with common functionality.
"""
import uuid
from django.db import models
from django.core.exceptions import ValidationError


class BaseModel(models.Model):
    """
    Abstract base model with common fields.
    All models should inherit from this.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        'accounts.User',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='%(class)s_created',
        verbose_name='Created By'
    )
    updated_by = models.ForeignKey(
        'accounts.User',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='%(class)s_updated',
        verbose_name='Updated By'
    )

    class Meta:
        abstract = True
        ordering = ['-created_at']

    def __str__(self):
        return str(self.id)


class SoftDeleteManager(models.Manager):
    """
    Custom manager for soft delete functionality.
    Returns only non-deleted objects by default.
    """
    def get_queryset(self):
        return super().get_queryset().filter(deleted_at__isnull=True)

    def with_deleted(self):
        """Include deleted objects in queryset."""
        return super().get_queryset()

    def deleted(self):
        """Return only deleted objects."""
        return super().get_queryset().filter(deleted_at__isnull=False)


class SoftDeleteModel(BaseModel):
    """
    Abstract model for soft delete functionality.
    Objects are marked as deleted instead of being removed from database.
    """
    deleted_at = models.DateTimeField(null=True, blank=True, db_index=True)
    deleted_by = models.ForeignKey(
        'accounts.User',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='%(class)s_deleted',
        verbose_name='Deleted By'
    )
    is_deleted = models.BooleanField(default=False, db_index=True)

    objects = SoftDeleteManager()
    all_objects = models.Manager()

    class Meta:
        abstract = True
        ordering = ['-created_at']

    def soft_delete(self, user=None):
        """Mark object as deleted."""
        from django.utils import timezone
        self.deleted_at = timezone.now()
        self.deleted_by = user
        self.is_deleted = True
        self.save()

    def restore(self):
        """Restore soft-deleted object."""
        self.deleted_at = None
        self.deleted_by = None
        self.is_deleted = False
        self.save()

    def delete(self, *args, **kwargs):
        """Override delete to use soft delete."""
        if kwargs.pop('hard_delete', False):
            super().delete(*args, **kwargs)
        else:
            self.soft_delete()


class StatusModel(models.Model):
    """
    Abstract model with status field.
    Common for content that can be active/inactive.
    """
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
        ('archived', 'Archived'),
    ]

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='draft',
        db_index=True
    )
    is_active = models.BooleanField(default=True, db_index=True)

    class Meta:
        abstract = True

    def publish(self):
        """Change status to published."""
        self.status = 'published'
        self.is_active = True
        self.save()

    def archive(self):
        """Change status to archived."""
        self.status = 'archived'
        self.is_active = False
        self.save()

    def draft(self):
        """Change status to draft."""
        self.status = 'draft'
        self.is_active = False
        self.save()


class OrderableModel(models.Model):
    """
    Abstract model for objects that need ordering.
    """
    order = models.PositiveIntegerField(default=0, db_index=True)

    class Meta:
        abstract = True
        ordering = ['order']


class SEOModel(models.Model):
    """
    Abstract model with SEO fields.
    """
    meta_title = models.CharField(max_length=255, blank=True)
    meta_description = models.TextField(blank=True)
    meta_keywords = models.CharField(max_length=255, blank=True)
    og_image = models.ImageField(upload_to='seo/og/', blank=True, null=True)
    canonical_url = models.URLField(blank=True)
    no_index = models.BooleanField(default=False, help_text='Prevent search engines from indexing this page')
    no_follow = models.BooleanField(default=False, help_text='Prevent search engines from following links')

    class Meta:
        abstract = True


class AuditLog(BaseModel):
    """
    Model to track all changes in the system.
    Provides complete audit trail for compliance.
    """
    ACTION_CHOICES = [
        ('create', 'Create'),
        ('update', 'Update'),
        ('delete', 'Delete'),
        ('login', 'Login'),
        ('logout', 'Logout'),
        ('export', 'Export'),
        ('import', 'Import'),
        ('view', 'View'),
        ('download', 'Download'),
        ('upload', 'Upload'),
    ]

    user = models.ForeignKey(
        'accounts.User',
        on_delete=models.SET_NULL,
        null=True,
        related_name='audit_logs',
        verbose_name='User'
    )
    action = models.CharField(max_length=20, choices=ACTION_CHOICES, db_index=True)
    model_name = models.CharField(max_length=100, db_index=True)
    object_id = models.UUIDField(null=True, blank=True)
    object_repr = models.CharField(max_length=255, blank=True)
    changes = models.JSONField(default=dict, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    request_method = models.CharField(max_length=10, blank=True)
    request_path = models.CharField(max_length=255, blank=True)
    extra_data = models.JSONField(default=dict, blank=True)

    class Meta:
        db_table = 'audit_logs'
        verbose_name = 'Audit Log'
        verbose_name_plural = 'Audit Logs'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'action']),
            models.Index(fields=['model_name', 'object_id']),
            models.Index(fields=['created_at']),
        ]

    def __str__(self):
        return f'{self.user} - {self.action} - {self.model_name}'


class BaseModelManager(models.Manager):
    """
    Base manager with common query methods.
    """
    def active(self):
        """Return only active objects."""
        return self.filter(is_active=True)

    def published(self):
        """Return only published objects."""
        return self.filter(status='published')

    def featured(self):
        """Return only featured objects."""
        return self.filter(is_featured=True)
