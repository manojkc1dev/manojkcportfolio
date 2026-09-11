"""
URL configuration for dashboard app.
"""
from django.urls import path
from .views import dashboard_analytics

app_name = 'dashboard'

urlpatterns = [
    path('analytics/', dashboard_analytics, name='analytics'),
]
