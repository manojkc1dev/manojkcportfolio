"""
Admin configuration for project categories.
"""
from django.contrib import admin
from .models import ProjectCategory


@admin.register(ProjectCategory)
class ProjectCategoryAdmin(admin.ModelAdmin):
    """
    Admin interface for project categories.
    """
    list_display = ['name', 'slug', 'is_featured', 'status', 'is_active', 'order', 'created_at']
    list_filter = ['status', 'is_active', 'is_featured', 'created_at']
    search_fields = ['name', 'slug', 'description']
    prepopulated_fields = {'slug': ('name',)}
    list_editable = ['order', 'is_featured']
    readonly_fields = ['id', 'created_at', 'updated_at']
