"""
Admin configuration for certifications app.
"""
from django.contrib import admin
from .models import Certification


@admin.register(Certification)
class CertificationAdmin(admin.ModelAdmin):
    """
    Admin interface for certifications.
    """
    list_display = [
        'name', 'issuer', 'credential_id', 'issue_date', 'expiry_date',
        'is_verified', 'is_featured', 'show_on_homepage', 'status', 'is_active', 'order'
    ]
    list_filter = [
        'status', 'is_active', 'is_verified', 'is_featured',
        'show_on_homepage', 'issue_date', 'created_at'
    ]
    search_fields = ['name', 'issuer', 'credential_id', 'description']
    list_editable = ['is_verified', 'is_featured', 'show_on_homepage', 'status', 'is_active', 'order']
    readonly_fields = ['id', 'created_at', 'updated_at', 'created_by', 'updated_by']
    date_hierarchy = 'issue_date'
    fieldsets = (
        ('Certificate Information', {
            'fields': ('name', 'issuer', 'credential_id')
        }),
        ('Dates', {
            'fields': ('issue_date', 'expiry_date', 'does_not_expire')
        }),
        ('Verification', {
            'fields': ('verification_url', 'is_verified')
        }),
        ('Description', {
            'fields': ('description', 'skills')
        }),
        ('Visual', {
            'fields': ('certificate_image', 'issuer_logo', 'badge_url')
        }),
        ('Links', {
            'fields': ('certificate_url',)
        }),
        ('Display', {
            'fields': ('show_on_homepage', 'is_featured', 'status', 'is_active', 'order')
        }),
        ('Metadata', {
            'fields': ('id', 'created_at', 'updated_at', 'created_by', 'updated_by')
        }),
    )
