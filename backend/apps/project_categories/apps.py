"""
App configuration for project_categories app.
"""
from django.apps import AppConfig


class ProjectCategoriesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.project_categories'
    verbose_name = 'Project Categories'
