"""
App configuration for GitHub integration app.
"""
from django.apps import AppConfig


class GithubConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.github'
    verbose_name = 'GitHub Integration'
