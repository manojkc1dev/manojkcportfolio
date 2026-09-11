"""
Admin configuration for socials app.
"""
from django.contrib import admin
from .models import SocialLink


@admin.register(SocialLink)
class SocialLinkAdmin(admin.ModelAdmin):
    """
    Admin interface for social media links.
    """
    list_display = [
        'platform', 'url', 'username', 'display_name',
        'show_on_homepage', 'status', 'is_active', 'order'
    ]
    list_filter = [
        'platform', 'status', 'is_active', 'show_on_homepage'
    ]
    search_fields = ['platform', 'url', 'username', 'display_name']
    list_editable = ['show_on_homepage', 'status', 'is_active', 'order']
    readonly_fields = [
        'id', 'created_at', 'updated_at', 'created_by', 'updated_by'
    ]
    fieldsets = (
        ('Platform', {
            'fields': ('platform', 'url', 'username', 'display_name', 'icon')
        }),
        ('Display', {
            'fields': ('show_on_homepage', 'status', 'is_active', 'order')
        }),
        ('Metadata', {
            'fields': ('id', 'created_at', 'updated_at', 'created_by', 'updated_by')
        }),
    )
