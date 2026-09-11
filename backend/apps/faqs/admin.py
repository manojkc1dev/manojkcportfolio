"""
Admin configuration for FAQs app.
"""
from django.contrib import admin
from .models import FAQ, FAQCategory


@admin.register(FAQCategory)
class FAQCategoryAdmin(admin.ModelAdmin):
    """
    Admin interface for FAQ categories.
    """
    list_display = ['name', 'slug', 'icon', 'status', 'is_active', 'order', 'created_at']
    list_filter = ['status', 'is_active', 'created_at']
    search_fields = ['name', 'slug', 'description']
    prepopulated_fields = {'slug': ('name',)}
    list_editable = ['status', 'is_active', 'order']
    readonly_fields = ['id', 'created_at', 'updated_at', 'created_by', 'updated_by']


@admin.register(FAQ)
class FAQAdmin(admin.ModelAdmin):
    """
    Admin interface for FAQs.
    """
    list_display = [
        'question', 'category', 'is_featured', 'show_on_homepage',
        'status', 'is_active', 'order'
    ]
    list_filter = [
        'status', 'is_active', 'category', 'is_featured',
        'show_on_homepage', 'created_at'
    ]
    search_fields = ['question', 'answer']
    list_editable = ['is_featured', 'show_on_homepage', 'status', 'is_active', 'order']
    readonly_fields = [
        'id', 'created_at', 'updated_at', 'created_by', 'updated_by'
    ]
    fieldsets = (
        ('Question', {
            'fields': ('question', 'answer', 'category')
        }),
        ('Display', {
            'fields': ('show_on_homepage', 'is_featured', 'status', 'is_active', 'order')
        }),
        ('Metadata', {
            'fields': ('id', 'created_at', 'updated_at', 'created_by', 'updated_by')
        }),
    )
