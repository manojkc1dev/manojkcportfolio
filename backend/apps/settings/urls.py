"""
URL configuration for settings app.
"""
from django.urls import path
from .views import (
    SiteSettingsDetailView, PublicSettingsView,
    HomepageSectionListCreateView, HomepageSectionDetailView
)

app_name = 'settings'

urlpatterns = [
    # Public settings (no auth required)
    path('public/', PublicSettingsView.as_view(), name='public-settings'),
    
    # Admin settings (admin only)
    path('', SiteSettingsDetailView.as_view(), name='site-settings'),
    
    # Homepage sections (admin only)
    path('sections/', HomepageSectionListCreateView.as_view(), name='section-list'),
    path('sections/<str:section_type>/', HomepageSectionDetailView.as_view(), name='section-detail'),
]
