"""
Root URL Configuration for Manoj KC Portfolio Backend.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
"""
from django.contrib import admin
from django.urls import path, include
from apps.authentication.views import (
    PortfolioTokenObtainPairView,
    ChangePasswordView,
)

urlpatterns = [
    path('admin/', admin.site.urls),

    # Versioned API Endpoints
    path('api/v1/', include('apps.core_api.urls', namespace='v1_core')),
    path('api/v1/auth/', include('apps.authentication.urls', namespace='v1_auth')),
    path('api/v1/', include('apps.portfolio.urls', namespace='v1_portfolio')),
    path('api/v1/', include('apps.services.urls', namespace='v1_services')),
    path('api/v1/', include('apps.experience.urls', namespace='v1_experience')),
    path('api/v1/', include('apps.skills.urls', namespace='v1_skills')),
    path('api/v1/', include('apps.siteconfig.urls', namespace='v1_siteconfig')),
    path('api/v1/', include('apps.blog.urls', namespace='v1_blog')),
    path('api/v1/', include('apps.resume.urls', namespace='v1_resume')),
    path('api/v1/', include('apps.inquiries.urls', namespace='v1_inquiries')),

    # Compatibility Aliases for Frontend Client
    path('api/token/', PortfolioTokenObtainPairView.as_view(), name='compat_token_obtain_pair'),
    path('api/auth/login/', PortfolioTokenObtainPairView.as_view(), name='compat_auth_login'),
    path('api/auth/change-password/', ChangePasswordView.as_view(), name='compat_auth_change_password'),
]
