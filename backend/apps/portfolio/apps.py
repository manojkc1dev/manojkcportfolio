from django.apps import AppConfig


class PortfolioConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.portfolio'
    label = 'portfolio'
    verbose_name = 'Portfolio & Case Studies'
