from django.apps import AppConfig


class CoreApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.core_api'
    label = 'core_api'
    verbose_name = 'Core API & Health Services'
