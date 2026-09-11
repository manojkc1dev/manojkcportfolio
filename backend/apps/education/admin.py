"""
Admin configuration for education app.
"""
from django.contrib import admin
from .models import Education


@admin.register(Education)
class EducationAdmin(admin.ModelAdmin):
    """
    Admin interface for education.
    """
    list_display = [
        'institution', 'degree', 'major', 'start_date', 'end_date',
        'is_current', 'cgpa', 'show_on_homepage', 'status', 'is_active', 'order'
    ]
    list_filter = [
        'status', 'is_active', 'is_current', 'show_on_homepage',
        'start_date', 'created_at'
    ]
    search_fields = ['institution', 'degree', 'major', 'field_of_study']
    list_editable = ['show_on_homepage', 'status', 'is_active', 'order']
    readonly_fields = ['id', 'created_at', 'updated_at', 'created_by', 'updated_by']
    date_hierarchy = 'start_date'
    fieldsets = (
        ('Institution Information', {
            'fields': ('institution', 'degree', 'major', 'field_of_study')
        }),
        ('Duration', {
            'fields': ('start_date', 'end_date', 'is_current')
        }),
        ('Academic Details', {
            'fields': ('cgpa', 'percentage', 'grade')
        }),
        ('Description', {
            'fields': ('description', 'coursework', 'achievements')
        }),
        ('Links', {
            'fields': ('institution_website', 'institution_logo')
        }),
        ('Display', {
            'fields': ('show_on_homepage', 'status', 'is_active', 'order')
        }),
        ('Metadata', {
            'fields': ('id', 'created_at', 'updated_at', 'created_by', 'updated_by')
        }),
    )
