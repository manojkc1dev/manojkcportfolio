"""
Admin configuration for analytics app.
"""
from django.contrib import admin
from .models import Analytics


@admin.register(Analytics)
class AnalyticsAdmin(admin.ModelAdmin):
    """
    Admin interface for analytics.
    """
    list_display = [
        'ip_address', 'country', 'device_type', 'browser',
        'page_views', 'duration', 'created_at'
    ]
    list_filter = [
        'country', 'device_type', 'browser', 'source', 'created_at'
    ]
    search_fields = ['ip_address', 'session_id', 'referrer']
    readonly_fields = [
        'id', 'ip_address', 'user_agent', 'country', 'city', 'region',
        'device_type', 'browser', 'os', 'session_id', 'referrer',
        'landing_page', 'exit_page', 'duration', 'page_views',
        'source', 'medium', 'campaign', 'created_at', 'updated_at',
        'created_by', 'updated_by'
    ]
    date_hierarchy = 'created_at'
    
    def has_add_permission(self, request):
        return False
    
    def has_change_permission(self, request, obj=None):
        return False
