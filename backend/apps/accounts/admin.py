"""
Admin configuration for accounts app.
"""
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth import get_user_model
from .models import UserProfile, LoginLog

User = get_user_model()


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """
    Admin interface for User model.
    """
    list_display = ['email', 'username', 'role', 'is_verified', 'is_active', 'last_login', 'created_at']
    list_filter = ['role', 'is_verified', 'is_active', 'is_staff', 'created_at']
    search_fields = ['email', 'username', 'first_name', 'last_name']
    ordering = ['-created_at']
    readonly_fields = ['id', 'created_at', 'updated_at', 'last_login', 'date_joined', 'failed_login_attempts', 'locked_until']

    fieldsets = (
        (None, {'fields': ('email', 'username', 'password')}),
        ('Personal Info', {
            'fields': ('first_name', 'last_name', 'phone', 'avatar', 'bio', 'website', 'location')
        }),
        ('Social Links', {
            'fields': ('github_url', 'linkedin_url', 'twitter_url')
        }),
        ('Permissions', {
            'fields': ('role', 'is_active', 'is_staff', 'is_superuser', 'is_verified', 'groups', 'user_permissions')
        }),
        ('Security', {
            'fields': ('failed_login_attempts', 'locked_until', 'last_login_ip')
        }),
        ('Important Dates', {
            'fields': ('last_login', 'date_joined', 'created_at', 'updated_at')
        }),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'password1', 'password2', 'role'),
        }),
    )

    def get_readonly_fields(self, request, obj=None):
        """Make certain fields readonly based on user role."""
        if not request.user.is_super_admin():
            return self.readonly_fields + ['is_superuser']
        return self.readonly_fields


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    """
    Admin interface for UserProfile model.
    """
    list_display = ['user', 'theme_preference', 'language_preference', 'timezone', 'two_factor_enabled']
    list_filter = ['theme_preference', 'language_preference', 'two_factor_enabled']
    search_fields = ['user__email', 'user__username']
    readonly_fields = ['id', 'created_at', 'updated_at', 'two_factor_secret']


@admin.register(LoginLog)
class LoginLogAdmin(admin.ModelAdmin):
    """
    Admin interface for LoginLog model.
    """
    list_display = ['user', 'ip_address', 'success', 'device_type', 'location', 'created_at']
    list_filter = ['success', 'device_type', 'created_at']
    search_fields = ['user__email', 'ip_address', 'user_agent']
    readonly_fields = ['id', 'user', 'ip_address', 'user_agent', 'success', 'failure_reason', 'location', 'device_type', 'created_at']
    date_hierarchy = 'created_at'
    ordering = ['-created_at']

    def has_add_permission(self, request):
        """Prevent manual creation of login logs."""
        return False

    def has_change_permission(self, request, obj=None):
        """Prevent modification of login logs."""
        return False
