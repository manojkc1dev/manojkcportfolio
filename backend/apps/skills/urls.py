"""
URL configuration for skills app.
"""
from django.urls import path
from .views import (
    SkillCategoryListCreateView, SkillCategoryDetailView,
    SkillListCreateView, SkillDetailView
)

app_name = 'skills'

urlpatterns = [
    # Skill Categories
    path('categories/', SkillCategoryListCreateView.as_view(), name='category-list'),
    path('categories/<slug:slug>/', SkillCategoryDetailView.as_view(), name='category-detail'),
    
    # Skills
    path('', SkillListCreateView.as_view(), name='skill-list'),
    path('<slug:slug>/', SkillDetailView.as_view(), name='skill-detail'),
]
