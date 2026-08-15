"""
URL configuration for blogs app.
"""
from django.urls import path
from .views import (
    BlogCategoryListCreateView, BlogCategoryDetailView,
    BlogTagListCreateView, BlogTagDetailView,
    BlogListCreateView, BlogDetailView
)

app_name = 'blogs'

urlpatterns = [
    # Blog Categories
    path('categories/', BlogCategoryListCreateView.as_view(), name='category-list'),
    path('categories/<slug:slug>/', BlogCategoryDetailView.as_view(), name='category-detail'),
    
    # Blog Tags
    path('tags/', BlogTagListCreateView.as_view(), name='tag-list'),
    path('tags/<slug:slug>/', BlogTagDetailView.as_view(), name='tag-detail'),
    
    # Blog Posts
    path('', BlogListCreateView.as_view(), name='blog-list'),
    path('<slug:slug>/', BlogDetailView.as_view(), name='blog-detail'),
]
