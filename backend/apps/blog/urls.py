"""
URL routing for Blog Articles API.
"""
from django.urls import path
from .views import ArticleListView, ArticleDetailView

app_name = 'blog'

urlpatterns = [
    path('articles/', ArticleListView.as_view(), name='article_list'),
    path('articles/<slug:slug>/', ArticleDetailView.as_view(), name='article_detail'),
    path('blog/', ArticleListView.as_view(), name='blog_list'),
    path('blog/<slug:slug>/', ArticleDetailView.as_view(), name='blog_detail'),
]
