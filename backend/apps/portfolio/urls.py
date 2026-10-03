"""
URL routing for Portfolio Projects API.
"""
from django.urls import path
from .views import ProjectListView, ProjectDetailView

app_name = 'portfolio'

urlpatterns = [
    path('projects/', ProjectListView.as_view(), name='project_list'),
    path('projects/<slug:slug>/', ProjectDetailView.as_view(), name='project_detail'),
]
