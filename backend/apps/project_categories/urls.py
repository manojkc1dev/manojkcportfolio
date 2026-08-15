"""
URL configuration for project_categories app.
"""
from django.urls import path
from .views import ProjectCategoryListCreateView, ProjectCategoryDetailView

app_name = 'project_categories'

urlpatterns = [
    path('', ProjectCategoryListCreateView.as_view(), name='category-list'),
    path('<slug:slug>/', ProjectCategoryDetailView.as_view(), name='category-detail'),
]
