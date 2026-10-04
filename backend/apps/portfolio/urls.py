"""
URL routing for Portfolio Projects API.
"""
from django.urls import path
from .views import (
    ProjectListView,
    ProjectDetailView,
    AdminProjectListCreateView,
    AdminProjectDetailView,
)

app_name = 'portfolio'

urlpatterns = [
    # Public endpoints
    path('projects/', ProjectListView.as_view(), name='project_list'),
    path('projects/<slug:slug>/', ProjectDetailView.as_view(), name='project_detail'),

    # Admin endpoints (IsAuthenticated)
    path('admin/projects/', AdminProjectListCreateView.as_view(), name='admin_project_list_create'),
    path('admin/projects/<str:pk>/', AdminProjectDetailView.as_view(), name='admin_project_detail'),
]

