"""
Admin configuration for skills app.
"""
from django.contrib import admin
from .models import Skill, SkillCategory


@admin.register(SkillCategory)
class SkillCategoryAdmin(admin.ModelAdmin):
    """
    Admin interface for skill categories.
    """
    list_display = ['name', 'slug', 'icon', 'status', 'is_active', 'order', 'created_at']
    list_filter = ['status', 'is_active', 'created_at']
    search_fields = ['name', 'slug', 'description']
    prepopulated_fields = {'slug': ('name',)}
    list_editable = ['status', 'is_active', 'order']
    readonly_fields = ['id', 'created_at', 'updated_at', 'created_by', 'updated_by']


@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    """
    Admin interface for skills.
    """
    list_display = [
        'name', 'slug', 'category', 'percentage', 'experience_years',
        'priority', 'is_featured', 'show_on_homepage', 'status', 'is_active', 'order'
    ]
    list_filter = [
        'status', 'is_active', 'category', 'is_featured',
        'show_on_homepage', 'created_at'
    ]
    search_fields = ['name', 'slug', 'category__name']
    prepopulated_fields = {'slug': ('name',)}
    list_editable = ['percentage', 'priority', 'is_featured', 'show_on_homepage', 'status', 'is_active', 'order']
    readonly_fields = ['id', 'created_at', 'updated_at', 'created_by', 'updated_by']
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'slug', 'category')
        }),
        ('Proficiency', {
            'fields': ('percentage', 'experience_years')
        }),
        ('Visual', {
            'fields': ('icon', 'image')
        }),
        ('Display', {
            'fields': ('priority', 'is_featured', 'show_on_homepage', 'status', 'is_active', 'order')
        }),
        ('Metadata', {
            'fields': ('id', 'created_at', 'updated_at', 'created_by', 'updated_by')
        }),
    )
