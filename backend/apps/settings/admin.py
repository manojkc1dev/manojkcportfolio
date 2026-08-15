"""
Admin configuration for settings app.
"""
from django.contrib import admin
from .models import SiteSettings, HomepageSection


@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    """
    Admin interface for site settings.
    """
    list_display = ['site_name', 'default_theme', 'maintenance_mode', 'updated_at']
    list_filter = ['default_theme', 'maintenance_mode', 'allow_theme_toggle']
    readonly_fields = ['id', 'created_at', 'updated_at']

    def has_add_permission(self, request):
        """Prevent adding multiple instances."""
        return not SiteSettings.objects.exists()

    def has_delete_permission(self, request, obj=None):
        """Prevent deletion."""
        return False

    fieldsets = (
        ('Site Identity', {
            'fields': ('site_name', 'tagline', 'logo', 'favicon')
        }),
        ('Theme Settings', {
            'fields': ('default_theme', 'allow_theme_toggle')
        }),
        ('Contact Information', {
            'fields': ('email', 'phone', 'location', 'timezone')
        }),
        ('Social Links', {
            'fields': ('github_url', 'linkedin_url', 'twitter_url', 'instagram_url', 'youtube_url')
        }),
        ('Footer', {
            'fields': ('footer_text', 'copyright_text', 'show_social_links')
        }),
        ('SEO', {
            'fields': ('meta_title', 'meta_description', 'meta_keywords')
        }),
        ('Analytics', {
            'fields': ('google_analytics_id', 'posthog_api_key', 'posthog_host')
        }),
        ('Maintenance Mode', {
            'fields': ('maintenance_mode', 'maintenance_message')
        }),
        ('Metadata', {
            'fields': ('id', 'created_at', 'updated_at')
        }),
    )


@admin.register(HomepageSection)
class HomepageSectionAdmin(admin.ModelAdmin):
    """
    Admin interface for homepage sections.
    """
    list_display = ['section_type', 'is_enabled', 'order', 'custom_title', 'display_limit']
    list_filter = ['is_enabled', 'section_type']
    list_editable = ['is_enabled', 'order']
    readonly_fields = ['id', 'created_at', 'updated_at']

    fieldsets = (
        ('Section Configuration', {
            'fields': ('section_type', 'is_enabled', 'order')
        }),
        ('Display Options', {
            'fields': ('custom_title', 'display_limit')
        }),
        ('Metadata', {
            'fields': ('id', 'created_at', 'updated_at')
        }),
    )
