"""
Admin configuration for resume app.
"""
from django.contrib import admin
from .models import Resume


@admin.register(Resume)
class ResumeAdmin(admin.ModelAdmin):
    """
    Admin interface for resume management.
    """
    list_display = [
        'title', 'version', 'file_type', 'is_default',
        'download_count', 'last_downloaded_at',
        'show_on_homepage', 'status', 'is_active', 'created_at'
    ]
    list_filter = [
        'status', 'is_active', 'file_type', 'is_default',
        'show_on_homepage', 'created_at'
    ]
    search_fields = ['title', 'description']
    list_editable = ['is_default', 'show_on_homepage', 'status', 'is_active']
    readonly_fields = [
        'id', 'download_count', 'last_downloaded_at',
        'created_at', 'updated_at', 'created_by', 'updated_by'
    ]
    fieldsets = (
        ('File Information', {
            'fields': ('title', 'description', 'resume_file', 'file_type')
        }),
        ('Version', {
            'fields': ('version', 'is_default')
        }),
        ('Statistics', {
            'fields': ('download_count', 'last_downloaded_at')
        }),
        ('Display', {
            'fields': ('show_on_homepage', 'status', 'is_active')
        }),
        ('Metadata', {
            'fields': ('id', 'created_at', 'updated_at', 'created_by', 'updated_by')
        }),
    )
