"""
Admin configuration for clients app.
"""
from django.contrib import admin
from .models import Client


@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    """
    Admin interface for clients.
    """
    list_display = [
        'name', 'company', 'designation', 'rating',
        'is_featured', 'show_on_homepage', 'status', 'is_active', 'order'
    ]
    list_filter = [
        'status', 'is_active', 'is_featured', 'show_on_homepage',
        'rating', 'created_at'
    ]
    search_fields = ['name', 'company', 'designation', 'review']
    list_editable = ['is_featured', 'show_on_homepage', 'status', 'is_active', 'order']
    readonly_fields = [
        'id', 'created_at', 'updated_at', 'created_by', 'updated_by'
    ]
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'company', 'designation')
        }),
        ('Visual', {
            'fields': ('logo', 'photo')
        }),
        ('Contact', {
            'fields': ('website', 'email', 'linkedin')
        }),
        ('Review', {
            'fields': ('review', 'rating')
        }),
        ('Project Details', {
            'fields': ('project_name', 'project_description')
        }),
        ('Display', {
            'fields': ('show_on_homepage', 'is_featured', 'status', 'is_active', 'order')
        }),
        ('Metadata', {
            'fields': ('id', 'created_at', 'updated_at', 'created_by', 'updated_by')
        }),
    )
