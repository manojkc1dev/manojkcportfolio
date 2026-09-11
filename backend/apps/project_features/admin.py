"""
Admin configuration for project features.
"""
from django.contrib import admin
from .models import ProjectFeature


class ProjectFeatureInline(admin.TabularInline):
    """
    Inline admin for project features.
    """
    model = ProjectFeature
    extra = 1
    fields = ['title', 'description', 'icon', 'order']
