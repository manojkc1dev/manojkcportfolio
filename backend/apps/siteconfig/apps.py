from django.apps import AppConfig


class SiteConfigConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.siteconfig'
    label = 'siteconfig'
    verbose_name = 'Site Profile & Global Configuration'
