"""
Admin configuration for testimonials app.
"""
from django.contrib import admin
from .models import Testimonial


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    """
    Admin interface for testimonials.
    """
    list_display = [
        'client_name', 'client_company', 'rating',
        'is_featured', 'show_on_homepage', 'status', 'is_active', 'order'
    ]
    list_filter = [
        'status', 'is_active', 'is_featured', 'show_on_homepage',
        'rating', 'created_at'
    ]
    search_fields = ['client_name', 'client_company', 'review']
    list_editable = ['is_featured', 'show_on_homepage', 'status', 'is_active', 'order']
    readonly_fields = [
        'id', 'created_at', 'updated_at', 'created_by', 'updated_by'
    ]
    fieldsets = (
        ('Client Information', {
            'fields': ('client_name', 'client_designation', 'client_company')
        }),
        ('Visual', {
            'fields': ('client_photo', 'company_logo')
        }),
        ('Testimonial', {
            'fields': ('review', 'rating')
        }),
        ('Links', {
            'fields': ('linkedin_url', 'website_url')
        }),
        ('Project Reference', {
            'fields': ('project_name', 'project_url')
        }),
        ('Display', {
            'fields': ('show_on_homepage', 'is_featured', 'status', 'is_active', 'order')
        }),
        ('Metadata', {
            'fields': ('id', 'created_at', 'updated_at', 'created_by', 'updated_by')
        }),
    )
