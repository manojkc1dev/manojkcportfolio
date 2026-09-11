"""
Admin configuration for blogs app.
"""
from django.contrib import admin
from .models import Blog, BlogCategory, BlogTag


@admin.register(BlogCategory)
class BlogCategoryAdmin(admin.ModelAdmin):
    """
    Admin interface for blog categories.
    """
    list_display = ['name', 'slug', 'icon', 'status', 'is_active', 'order', 'created_at']
    list_filter = ['status', 'is_active', 'created_at']
    search_fields = ['name', 'slug', 'description']
    prepopulated_fields = {'slug': ('name',)}
    list_editable = ['status', 'is_active', 'order']
    readonly_fields = ['id', 'created_at', 'updated_at', 'created_by', 'updated_by']


@admin.register(BlogTag)
class BlogTagAdmin(admin.ModelAdmin):
    """
    Admin interface for blog tags.
    """
    list_display = ['name', 'slug', 'status', 'is_active', 'created_at']
    list_filter = ['status', 'is_active', 'created_at']
    search_fields = ['name', 'slug']
    prepopulated_fields = {'slug': ('name',)}
    list_editable = ['status', 'is_active']
    readonly_fields = ['id', 'created_at', 'updated_at', 'created_by', 'updated_by']


@admin.register(Blog)
class BlogAdmin(admin.ModelAdmin):
    """
    Admin interface for blog posts.
    """
    list_display = [
        'title', 'slug', 'category', 'author', 'published_at',
        'view_count', 'like_count', 'is_featured', 'status', 'is_active', 'created_at'
    ]
    list_filter = [
        'status', 'is_active', 'category', 'is_featured',
        'allow_comments', 'published_at', 'created_at'
    ]
    search_fields = ['title', 'slug', 'excerpt', 'content']
    prepopulated_fields = {'slug': ('title',)}
    list_editable = ['is_featured', 'status', 'is_active']
    readonly_fields = [
        'id', 'view_count', 'like_count', 'comment_count', 'share_count',
        'created_at', 'updated_at', 'created_by', 'updated_by'
    ]
    filter_horizontal = ['tags']
    date_hierarchy = 'published_at'
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'slug', 'excerpt', 'content')
        }),
        ('Categorization', {
            'fields': ('category', 'tags')
        }),
        ('Featured Image', {
            'fields': ('featured_image',)
        }),
        ('Author', {
            'fields': ('author',)
        }),
        ('Reading Time', {
            'fields': ('reading_time',)
        }),
        ('Publishing', {
            'fields': ('published_at', 'scheduled_at')
        }),
        ('Statistics', {
            'fields': ('view_count', 'like_count', 'comment_count', 'share_count')
        }),
        ('Display', {
            'fields': ('is_featured', 'allow_comments', 'status', 'is_active', 'order')
        }),
        ('SEO', {
            'fields': ('meta_title', 'meta_description', 'meta_keywords', 'og_image', 'canonical_url', 'no_index', 'no_follow')
        }),
        ('Metadata', {
            'fields': ('id', 'created_at', 'updated_at', 'created_by', 'updated_by')
        }),
    )
