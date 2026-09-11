"""
Admin configuration for techstack app.
"""
from django.contrib import admin
from .models import TechStackCategory, TechStackItem


@admin.register(TechStackCategory)
class TechStackCategoryAdmin(admin.ModelAdmin):
    """
    Admin interface for tech stack categories.
    """
    list_display = ['name', 'slug', 'category_type', 'icon', 'status', 'is_active', 'order', 'created_at']
    list_filter = ['category_type', 'status', 'is_active', 'created_at']
    search_fields = ['name', 'slug', 'description']
    prepopulated_fields = {'slug': ('name',)}
    list_editable = ['status', 'is_active', 'order']
    readonly_fields = ['id', 'created_at', 'updated_at', 'created_by', 'updated_by']


@admin.register(TechStackItem)
class TechStackItemAdmin(admin.ModelAdmin):
    """
    Admin interface for tech stack items.
    """
    list_display = [
        'name', 'slug', 'category', 'skill_level', 'experience_years',
        'display_order', 'is_featured', 'show_on_homepage', 'status', 'is_active', 'order'
    ]
    list_filter = [
        'status', 'is_active', 'category', 'skill_level',
        'is_featured', 'show_on_homepage', 'created_at'
    ]
    search_fields = ['name', 'slug', 'category__name']
    prepopulated_fields = {'slug': ('name',)}
    list_editable = ['skill_level', 'experience_years', 'display_order', 'is_featured', 'show_on_homepage', 'status', 'is_active', 'order']
    readonly_fields = ['id', 'created_at', 'updated_at', 'created_by', 'updated_by']
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'slug', 'category')
        }),
        ('Visual', {
            'fields': ('icon', 'svg', 'image', 'color')
        }),
        ('Links', {
            'fields': ('official_website', 'documentation_url')
        }),
        ('Experience', {
            'fields': ('skill_level', 'experience_years')
        }),
        ('Display', {
            'fields': ('display_order', 'is_featured', 'show_on_homepage', 'status', 'is_active', 'order')
        }),
        ('Metadata', {
            'fields': ('id', 'created_at', 'updated_at', 'created_by', 'updated_by')
        }),
    )
