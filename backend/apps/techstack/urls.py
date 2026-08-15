"""
URL configuration for techstack app.
"""
from django.urls import path
from .views import (
    TechStackCategoryListCreateView, TechStackCategoryDetailView,
    TechStackItemListCreateView, TechStackItemDetailView
)

app_name = 'techstack'

urlpatterns = [
    # Tech Stack Categories
    path('categories/', TechStackCategoryListCreateView.as_view(), name='category-list'),
    path('categories/<slug:slug>/', TechStackCategoryDetailView.as_view(), name='category-detail'),
    
    # Tech Stack Items
    path('', TechStackItemListCreateView.as_view(), name='item-list'),
    path('<slug:slug>/', TechStackItemDetailView.as_view(), name='item-detail'),
]
