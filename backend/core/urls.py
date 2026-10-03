"""
Root URL Configuration for Manoj KC Portfolio Backend.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
"""
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),

    # Versioned API Endpoints
    path('api/v1/', include('apps.core_api.urls', namespace='v1_core')),
    path('api/v1/auth/', include('apps.authentication.urls', namespace='v1_auth')),

    # Compatibility Aliases for Frontend Client
    path('api/auth/', include('apps.authentication.urls')),
    path('api/token/', include('apps.authentication.urls')),
]
