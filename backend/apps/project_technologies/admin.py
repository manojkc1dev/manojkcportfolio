"""
Admin configuration for project technologies.
"""
from django.contrib import admin
from .models import ProjectTechnology


class ProjectTechnologyInline(admin.TabularInline):
    """
    Inline admin for project technologies.
    """
    model = ProjectTechnology
    extra = 1
    fields = ['name', 'category', 'version', 'icon', 'url']
