"""
Admin configuration for experience app.
"""
from django.contrib import admin
from .models import Experience


@admin.register(Experience)
class ExperienceAdmin(admin.ModelAdmin):
    """
    Admin interface for work experience.
    """
    list_display = [
        'company', 'position', 'employment_type', 'location',
        'start_date', 'end_date', 'is_current',
        'show_on_homepage', 'is_featured', 'status', 'is_active', 'order'
    ]
    list_filter = [
        'status', 'is_active', 'employment_type', 'is_current',
        'show_on_homepage', 'is_featured', 'start_date', 'created_at'
    ]
    search_fields = ['company', 'position', 'description']
    list_editable = ['show_on_homepage', 'is_featured', 'status', 'is_active', 'order']
    readonly_fields = ['id', 'created_at', 'updated_at', 'created_by', 'updated_by']
    date_hierarchy = 'start_date'
    fieldsets = (
        ('Company Information', {
            'fields': ('company', 'position', 'employment_type', 'location')
        }),
        ('Duration', {
            'fields': ('start_date', 'end_date', 'is_current')
        }),
        ('Description', {
            'fields': ('description', 'responsibilities')
        }),
        ('Technologies', {
            'fields': ('technologies',)
        }),
        ('Achievements', {
            'fields': ('achievements',)
        }),
        ('Links', {
            'fields': ('company_website', 'company_logo')
        }),
        ('Display', {
            'fields': ('show_on_homepage', 'is_featured', 'status', 'is_active', 'order')
        }),
        ('Metadata', {
            'fields': ('id', 'created_at', 'updated_at', 'created_by', 'updated_by')
        }),
    )
