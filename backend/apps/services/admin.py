"""
Admin configuration for services app.
"""
from django.contrib import admin
from .models import Service


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    """
    Admin interface for services.
    """
    list_display = [
        'name', 'slug', 'price', 'price_type',
        'is_featured', 'show_on_homepage', 'status', 'is_active', 'order'
    ]
    list_filter = [
        'status', 'is_active', 'price_type', 'is_featured',
        'show_on_homepage', 'created_at'
    ]
    search_fields = ['name', 'slug', 'tagline', 'description']
    prepopulated_fields = {'slug': ('name',)}
    list_editable = ['is_featured', 'show_on_homepage', 'status', 'is_active', 'order']
    readonly_fields = [
        'id', 'created_at', 'updated_at', 'created_by', 'updated_by'
    ]
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'slug', 'tagline', 'description')
        }),
        ('Visual', {
            'fields': ('icon', 'image', 'color')
        }),
        ('Pricing', {
            'fields': ('price', 'price_type')
        }),
        ('Features', {
            'fields': ('features', 'process_steps')
        }),
        ('Display', {
            'fields': ('show_on_homepage', 'is_featured', 'status', 'is_active', 'order')
        }),
        ('SEO', {
            'fields': ('meta_title', 'meta_description', 'meta_keywords', 'og_image', 'canonical_url', 'no_index', 'no_follow')
        }),
        ('Metadata', {
            'fields': ('id', 'created_at', 'updated_at', 'created_by', 'updated_by')
        }),
    )
