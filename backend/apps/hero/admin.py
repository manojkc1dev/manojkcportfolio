"""
Admin configuration for hero app.
"""
from django.contrib import admin
from .models import Hero


@admin.register(Hero)
class HeroAdmin(admin.ModelAdmin):
    """
    Admin interface for hero section.
    """
    list_display = [
        'name', 'title', 'availability_status', 'show_on_homepage',
        'is_featured', 'status', 'is_active', 'order', 'created_at'
    ]
    list_filter = [
        'status', 'is_active', 'availability_status',
        'show_on_homepage', 'is_featured', 'created_at'
    ]
    search_fields = ['name', 'title', 'subtitle', 'description']
    list_editable = ['show_on_homepage', 'is_featured', 'status', 'is_active', 'order']
    readonly_fields = [
        'id', 'created_at', 'updated_at', 'created_by', 'updated_by'
    ]
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'title', 'subtitle', 'description')
        }),
        ('Availability', {
            'fields': ('availability_badge', 'availability_status')
        }),
        ('Location', {
            'fields': ('location',)
        }),
        ('Images', {
            'fields': ('profile_image', 'background_image')
        }),
        ('Resume Button', {
            'fields': ('resume_button_text', 'resume_button_url')
        }),
        ('CTA Buttons', {
            'fields': (
                'hire_me_button_text', 'hire_me_button_url',
                'github_button_text', 'github_button_url',
                'linkedin_button_text', 'linkedin_button_url',
                'email_button_text', 'email_button_url',
                'whatsapp_button_text', 'whatsapp_button_url'
            )
        }),
        ('Typing Animation', {
            'fields': ('typing_animation_texts', 'typing_animation_enabled')
        }),
        ('Display Settings', {
            'fields': ('show_on_homepage', 'is_featured', 'status', 'is_active', 'order')
        }),
        ('SEO', {
            'fields': ('meta_title', 'meta_description', 'meta_keywords', 'og_image', 'canonical_url', 'no_index', 'no_follow')
        }),
        ('Metadata', {
            'fields': ('id', 'created_at', 'updated_at', 'created_by', 'updated_by')
        }),
    )
