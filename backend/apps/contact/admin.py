"""
Admin configuration for contact app.
"""
from django.contrib import admin
from .models import Contact


@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    """
    Admin interface for contact form submissions.
    """
    list_display = [
        'name', 'email', 'subject', 'contact_status',
        'is_starred', 'is_spam', 'created_at'
    ]
    list_filter = [
        'contact_status', 'is_starred', 'is_spam', 'created_at'
    ]
    search_fields = ['name', 'email', 'subject', 'message']
    list_editable = ['contact_status', 'is_starred', 'is_spam']
    readonly_fields = [
        'id', 'ip_address', 'country', 'browser', 'device',
        'user_agent', 'spam_score', 'created_at', 'updated_at', 'created_by', 'updated_by'
    ]
    date_hierarchy = 'created_at'
    fieldsets = (
        ('Contact Information', {
            'fields': ('name', 'email', 'phone', 'subject', 'message')
        }),
        ('Tracking', {
            'fields': ('ip_address', 'country', 'browser', 'device', 'user_agent')
        }),
        ('Status', {
            'fields': ('contact_status',)
        }),
        ('Response', {
            'fields': ('reply', 'replied_at', 'replied_by')
        }),
        ('Flags', {
            'fields': ('is_starred', 'is_spam', 'spam_score')
        }),
        ('Metadata', {
            'fields': ('id', 'created_at', 'updated_at', 'created_by', 'updated_by')
        }),
    )
