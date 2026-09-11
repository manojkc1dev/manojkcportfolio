"""
Admin configuration for project images.
"""
from django.contrib import admin
from .models import ProjectImage


class ProjectImageInline(admin.TabularInline):
    """
    Inline admin for project images.
    """
    model = ProjectImage
    extra = 1
    fields = ['image', 'alt_text', 'caption', 'is_cover', 'order']
