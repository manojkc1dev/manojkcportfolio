"""
URL configuration for about app.
"""
from django.urls import path
from .views import AboutListCreateView, AboutDetailView

app_name = 'about'

urlpatterns = [
    path('', AboutListCreateView.as_view(), name='about-list'),
    path('<uuid:id>/', AboutDetailView.as_view(), name='about-detail'),
]
