"""
URL configuration for hero app.
"""
from django.urls import path
from .views import HeroListCreateView, HeroDetailView

app_name = 'hero'

urlpatterns = [
    path('', HeroListCreateView.as_view(), name='hero-list'),
    path('<uuid:id>/', HeroDetailView.as_view(), name='hero-detail'),
]
