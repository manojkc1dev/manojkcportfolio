"""
User model and authentication models for Portfolio CMS.
"""
from django.contrib.auth.models import AbstractUser
from django.db import models
from core.models import BaseModel, SoftDeleteModel
import secrets


class User(AbstractUser, BaseModel):
    """
    Custom user model with role-based access control.
    """
    ROLE_CHOICES = [
        ('super_admin', 'Super Admin'),
        ('admin', 'Admin'),
        ('editor', 'Editor'),
        ('content_manager', 'Content Manager'),
        ('viewer', 'Viewer'),
    ]

    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default='viewer',
        db_index=True
    )
    phone = models.CharField(max_length=20, blank=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    bio = models.TextField(blank=True)
    website = models.URLField(blank=True)
    location = models.CharField(max_length=100, blank=True)
    github_url = models.URLField(blank=True)
    linkedin_url = models.URLField(blank=True)
    twitter_url = models.URLField(blank=True)
    is_verified = models.BooleanField(default=False, db_index=True)
    last_login_ip = models.GenericIPAddressField(null=True, blank=True)
    failed_login_attempts = models.PositiveIntegerField(default=0)
    locked_until = models.DateTimeField(null=True, blank=True)
    
    # Email verification
    verification_token = models.CharField(max_length=255, blank=True, null=True)
    verification_token_expires_at = models.DateTimeField(null=True, blank=True)
    
    # Password reset
    password_reset_token = models.CharField(max_length=255, blank=True, null=True)
    password_reset_token_expires_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'users'
        verbose_name = 'User'
        verbose_name_plural = 'Users'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['role']),
            models.Index(fields=['is_active']),
        ]

    def __str__(self):
        return self.email or self.username

    def get_full_name(self):
        """Return full name or username."""
        full_name = f"{self.first_name} {self.last_name}".strip()
        return full_name or self.username

    def is_super_admin(self):
        """Check if user is super admin."""
        return self.role == 'super_admin'

    def is_admin(self):
        """Check if user is admin or above."""
        return self.role in ['super_admin', 'admin']

    def is_editor(self):
        """Check if user is editor or above."""
        return self.role in ['super_admin', 'admin', 'editor']

    def is_content_manager(self):
        """Check if user is content manager or above."""
        return self.role in ['super_admin', 'admin', 'editor', 'content_manager']

    def increment_failed_login(self):
        """Increment failed login attempts."""
        self.failed_login_attempts += 1
        if self.failed_login_attempts >= 5:
            from django.utils import timezone
            from datetime import timedelta
            self.locked_until = timezone.now() + timedelta(minutes=30)
        self.save()

    def reset_failed_login(self):
        """Reset failed login attempts."""
        self.failed_login_attempts = 0
        self.locked_until = None
        self.save()

    def is_locked(self):
        """Check if account is locked."""
        if self.locked_until:
            from django.utils import timezone
            if timezone.now() < self.locked_until:
                return True
            else:
                self.locked_until = None
                self.save()
        return False

    def generate_verification_token(self):
        """Generate a secure email verification token."""
        from django.utils import timezone
        from datetime import timedelta
        self.verification_token = secrets.token_urlsafe(64)
        self.verification_token_expires_at = timezone.now() + timedelta(hours=24)
        self.save()
        return self.verification_token

    def generate_password_reset_token(self):
        """Generate a secure password reset token."""
        from django.utils import timezone
        from datetime import timedelta
        self.password_reset_token = secrets.token_urlsafe(64)
        self.password_reset_token_expires_at = timezone.now() + timedelta(hours=1)
        self.save()
        return self.password_reset_token

    def is_verification_token_valid(self, token):
        """Check if verification token is valid."""
        from django.utils import timezone
        if not self.verification_token or self.verification_token != token:
            return False
        if self.verification_token_expires_at and timezone.now() > self.verification_token_expires_at:
            return False
        return True

    def is_password_reset_token_valid(self, token):
        """Check if password reset token is valid."""
        from django.utils import timezone
        if not self.password_reset_token or self.password_reset_token != token:
            return False
        if self.password_reset_token_expires_at and timezone.now() > self.password_reset_token_expires_at:
            return False
        return True

    def clear_verification_token(self):
        """Clear verification token after successful verification."""
        self.verification_token = None
        self.verification_token_expires_at = None
        self.save()

    def clear_password_reset_token(self):
        """Clear password reset token after successful reset."""
        self.password_reset_token = None
        self.password_reset_token_expires_at = None
        self.save()


class UserProfile(BaseModel):
    """
    Extended user profile for additional information.
    """
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='profile'
    )
    notification_preferences = models.JSONField(default=dict, blank=True)
    theme_preference = models.CharField(
        max_length=10,
        choices=[('light', 'Light'), ('dark', 'Dark')],
        default='light'
    )
    language_preference = models.CharField(max_length=10, default='en')
    timezone = models.CharField(max_length=50, default='UTC')
    two_factor_enabled = models.BooleanField(default=False)
    two_factor_secret = models.CharField(max_length=32, blank=True)

    class Meta:
        db_table = 'user_profiles'
        verbose_name = 'User Profile'
        verbose_name_plural = 'User Profiles'

    def __str__(self):
        return f"{self.user.email} Profile"


class LoginLog(BaseModel):
    """
    Track user login attempts for security.
    """
    user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='login_logs'
    )
    ip_address = models.GenericIPAddressField()
    user_agent = models.TextField()
    success = models.BooleanField(default=True)
    failure_reason = models.CharField(max_length=255, blank=True)
    location = models.CharField(max_length=100, blank=True)
    device_type = models.CharField(max_length=50, blank=True)

    class Meta:
        db_table = 'login_logs'
        verbose_name = 'Login Log'
        verbose_name_plural = 'Login Logs'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'created_at']),
            models.Index(fields=['ip_address']),
        ]

    def __str__(self):
        return f"{self.user} - {self.ip_address}"
