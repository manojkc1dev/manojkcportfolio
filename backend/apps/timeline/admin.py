"""
Admin configuration for timeline app.
"""
from django.contrib import admin
from .models import Timeline


@admin.register(Timeline)
class TimelineAdmin(admin.ModelAdmin):
    """
    Admin interface for timeline events.
    """
    list_display = [
        'title', 'event_type', 'date', 'show_on_homepage',
        'status', 'is_active', 'order'
    ]
    list_filter = [
        'event_type', 'status', 'is_active', 'show_on_homepage', 'date'
    ]
    search_fields = ['title', 'description']
    list_editable = ['show_on_homepage', 'status', 'is_active', 'order']
    readonly_fields = [
        'id', 'created_at', 'updated_at', 'created_by', 'updated_by'
    ]
    date_hierarchy = 'date'
    fieldsets = (
        ('Event Information', {
            'fields': ('title', 'event_type', 'date')
        }),
        ('Description', {
            'fields': ('description', 'details')
        }),
        ('Links', {
            'fields': ('url', 'image')
        }),
        ('Icon', {
            'fields': ('icon', 'color')
        }),
        ('Display', {
            'fields': ('show_on_homepage', 'status', 'is_active', 'order')
        }),
        ('Metadata', {
            'fields': ('id', 'created_at', 'updated_at', 'created_by', 'updated_by')
        }),
    )
