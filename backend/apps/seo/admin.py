"""
Admin configuration for SEO app.
"""
from django.contrib import admin
from .models import SEOSettings


@admin.register(SEOSettings)
class SEOSettingsAdmin(admin.ModelAdmin):
    """
    Admin interface for SEO settings.
    """
    list_display = ['site_title', 'google_analytics_id', 'sitemap_enabled', 'created_at']
    readonly_fields = [
        'id', 'created_at', 'updated_at', 'created_by', 'updated_by'
    ]
    fieldsets = (
        ('Site Information', {
            'fields': ('site_title', 'meta_description', 'meta_keywords')
        }),
        ('Open Graph', {
            'fields': ('og_image', 'og_title', 'og_description')
        }),
        ('Twitter Card', {
            'fields': ('twitter_card', 'twitter_image', 'twitter_title', 'twitter_description')
        }),
        ('Technical SEO', {
            'fields': ('canonical_url', 'robots_txt')
        }),
        ('Schema.org', {
            'fields': ('schema_org_type', 'schema_org_json')
        }),
        ('Sitemap', {
            'fields': ('sitemap_enabled',)
        }),
        ('Analytics', {
            'fields': ('google_analytics_id', 'google_tag_manager_id')
        }),
        ('Metadata', {
            'fields': ('id', 'created_at', 'updated_at', 'created_by', 'updated_by')
        }),
    )
    
    def has_add_permission(self, request):
        # Only allow one SEO settings instance
        return self.model.objects.count() == 0
