"""
Root URL Configuration for Manoj KC Portfolio Backend.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
"""
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    # API v1 versioned endpoints
    path('api/v1/', include('apps.core_api.urls', namespace='v1_core')),
]
