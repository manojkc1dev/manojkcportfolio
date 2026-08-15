"""
URL configuration for seo app.
"""
from django.urls import path
from .views import SEOSettingsDetailView

app_name = 'seo'

urlpatterns = [
    path('settings/', SEOSettingsDetailView.as_view(), name='seo-settings'),
]
