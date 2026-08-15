"""
Admin configuration for projects app.
"""
from django.contrib import admin
from .models import Project
from apps.project_images.admin import ProjectImageInline
from apps.project_features.admin import ProjectFeatureInline
from apps.project_technologies.admin import ProjectTechnologyInline
from apps.project_videos.admin import ProjectVideoInline


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    """
    Admin interface for projects.
    """
    list_display = [
        'title', 'slug', 'category', 'visibility', 'is_featured',
        'is_pinned', 'status', 'is_active', 'view_count',
        'like_count', 'share_count', 'created_at'
    ]
    list_filter = [
        'status', 'is_active', 'visibility', 'is_featured',
        'is_pinned', 'category', 'created_at'
    ]
    search_fields = ['title', 'slug', 'short_description', 'description']
    prepopulated_fields = {'slug': ('title',)}
    list_editable = ['is_featured', 'is_pinned', 'status', 'is_active']
    readonly_fields = [
        'id', 'view_count', 'like_count', 'share_count',
        'created_at', 'updated_at', 'created_by', 'updated_by'
    ]
    inlines = [
        ProjectImageInline,
        ProjectFeatureInline,
        ProjectTechnologyInline,
        ProjectVideoInline,
    ]
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'slug', 'category', 'thumbnail', 'cover_image')
        }),
        ('Description', {
            'fields': ('short_description', 'description', 'problem', 'solution', 'architecture')
        }),
        ('Project Details', {
            'fields': ('role', 'client', 'company', 'duration', 'team_size', 'responsibilities')
        }),
        ('Tech Stack', {
            'fields': ('programming_language', 'framework', 'database', 'api', 'authentication', 'deployment')
        }),
        ('Links', {
            'fields': ('github_url', 'live_demo_url', 'documentation_url', 'figma_url', 'case_study_url')
        }),
        ('Visibility & Status', {
            'fields': ('visibility', 'is_featured', 'is_pinned', 'status', 'is_active', 'order')
        }),
        ('Additional', {
            'fields': ('challenges', 'future_improvements')
        }),
        ('Statistics', {
            'fields': ('view_count', 'like_count', 'share_count')
        }),
        ('SEO', {
            'fields': ('meta_title', 'meta_description', 'meta_keywords', 'og_image', 'canonical_url', 'no_index', 'no_follow')
        }),
        ('Metadata', {
            'fields': ('id', 'created_at', 'updated_at', 'created_by', 'updated_by')
        }),
    )
