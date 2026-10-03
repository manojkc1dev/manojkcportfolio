"""
URL routing for Site Configuration, Profile, and Uses API.
"""
from django.urls import path
from .views import SiteProfileView, UseCategoryListView, CurrentItemListView

app_name = 'siteconfig'

urlpatterns = [
    path('profile/', SiteProfileView.as_view(), name='site_profile'),
    path('uses/', UseCategoryListView.as_view(), name='uses_list'),
    path('currently-building/', CurrentItemListView.as_view(), name='currently_building_list'),
]
