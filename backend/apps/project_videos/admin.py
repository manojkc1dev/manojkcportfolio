"""
Admin configuration for project videos.
"""
from django.contrib import admin
from .models import ProjectVideo


class ProjectVideoInline(admin.TabularInline):
    """
    Inline admin for project videos.
    """
    model = ProjectVideo
    extra = 1
    fields = ['video_type', 'video_file', 'video_url', 'thumbnail', 'title', 'description', 'duration', 'order']
