"""
Admin configuration for about app.
"""
from django.contrib import admin
from .models import About


@admin.register(About)
class AboutAdmin(admin.ModelAdmin):
    """
    Admin interface for about section.
    """
    list_display = [
        'bio_preview', 'years_experience', 'projects_completed',
        'show_on_homepage', 'status', 'is_active', 'created_at'
    ]
    list_filter = [
        'status', 'is_active', 'show_on_homepage', 'created_at'
    ]
    search_fields = ['bio', 'long_description', 'mission', 'vision']
    list_editable = ['show_on_homepage', 'status', 'is_active']
    readonly_fields = [
        'id', 'created_at', 'updated_at', 'created_by', 'updated_by'
    ]
    fieldsets = (
        ('Basic Information', {
            'fields': ('photo', 'bio', 'long_description')
        }),
        ('Mission & Vision', {
            'fields': ('mission', 'vision')
        }),
        ('Statistics', {
            'fields': ('years_experience', 'projects_completed', 'happy_clients', 'awards_won')
        }),
        ('Quote', {
            'fields': ('quote', 'quote_author')
        }),
        ('Highlights', {
            'fields': ('highlights',)
        }),
        ('Display Settings', {
            'fields': ('show_on_homepage', 'status', 'is_active')
        }),
        ('SEO', {
            'fields': ('meta_title', 'meta_description', 'meta_keywords', 'og_image', 'canonical_url', 'no_index', 'no_follow')
        }),
        ('Metadata', {
            'fields': ('id', 'created_at', 'updated_at', 'created_by', 'updated_by')
        }),
    )

    def bio_preview(self, obj):
        return obj.bio[:50] if obj.bio else '-'
    bio_preview.short_description = 'Bio'
