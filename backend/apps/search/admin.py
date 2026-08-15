"""
Admin configuration for search app.
"""
from django.contrib import admin
from .models import SearchQuery


@admin.register(SearchQuery)
class SearchQueryAdmin(admin.ModelAdmin):
    """
    Admin interface for search queries.
    """
    list_display = [
        'query', 'search_type', 'results_count', 'ip_address', 'created_at'
    ]
    list_filter = [
        'search_type', 'created_at'
    ]
    search_fields = ['query']
    readonly_fields = [
        'id', 'query', 'results_count', 'ip_address', 'user_agent',
        'search_type', 'created_at', 'updated_at', 'created_by', 'updated_by'
    ]
    date_hierarchy = 'created_at'
    
    def has_add_permission(self, request):
        return False
    
    def has_change_permission(self, request, obj=None):
        return False
