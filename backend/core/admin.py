"""
Admin configuration for core models.
"""
from django.contrib import admin
from .models import AuditLog


@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    """
    Admin interface for audit logs.
    """
    list_display = ['id', 'user', 'action', 'model_name', 'created_at', 'ip_address']
    list_filter = ['action', 'model_name', 'created_at']
    search_fields = ['user__email', 'model_name', 'object_repr', 'ip_address']
    readonly_fields = [
        'id', 'user', 'action', 'model_name', 'object_id', 'object_repr',
        'changes', 'ip_address', 'user_agent', 'request_method', 'request_path',
        'extra_data', 'created_at', 'created_by', 'updated_at'
    ]
    date_hierarchy = 'created_at'
    ordering = ['-created_at']

    def has_add_permission(self, request):
        """Prevent manual creation of audit logs."""
        return False

    def has_change_permission(self, request, obj=None):
        """Prevent modification of audit logs."""
        return False

    def has_delete_permission(self, request, obj=None):
        """Only super admin can delete audit logs."""
        return request.user.is_superuser
