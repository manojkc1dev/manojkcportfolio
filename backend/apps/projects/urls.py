"""
URL configuration for projects app.
"""
from django.urls import path
from .views import (
    ProjectListCreateView, ProjectDetailView,
    increment_like_count, increment_share_count, publish_project
)

app_name = 'projects'

urlpatterns = [
    path('', ProjectListCreateView.as_view(), name='project-list'),
    path('<slug:slug>/', ProjectDetailView.as_view(), name='project-detail'),
    path('<slug:slug>/like/', increment_like_count, name='project-like'),
    path('<slug:slug>/share/', increment_share_count, name='project-share'),
    path('<slug:slug>/publish/', publish_project, name='project-publish'),
]
