"""
Admin configuration for achievements app.
"""
from django.contrib import admin
from .models import Achievement


@admin.register(Achievement)
class AchievementAdmin(admin.ModelAdmin):
    """
    Admin interface for achievements.
    """
    list_display = [
        'title', 'achievement_type', 'date', 'organization',
        'is_featured', 'show_on_homepage', 'status', 'is_active', 'order'
    ]
    list_filter = [
        'achievement_type', 'status', 'is_active', 'is_featured',
        'show_on_homepage', 'date', 'created_at'
    ]
    search_fields = ['title', 'organization', 'description']
    list_editable = ['is_featured', 'show_on_homepage', 'status', 'is_active', 'order']
    readonly_fields = [
        'id', 'created_at', 'updated_at', 'created_by', 'updated_by'
    ]
    date_hierarchy = 'date'
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'achievement_type', 'description', 'date')
        }),
        ('Organization', {
            'fields': ('organization', 'organization_url', 'organization_logo')
        }),
        ('Certificate/Image', {
            'fields': ('certificate_image', 'badge_url')
        }),
        ('Links', {
            'fields': ('url',)
        }),
        ('Display', {
            'fields': ('show_on_homepage', 'is_featured', 'status', 'is_active', 'order')
        }),
        ('Metadata', {
            'fields': ('id', 'created_at', 'updated_at', 'created_by', 'updated_by')
        }),
    )
