"""
URL configuration for socials app.
"""
from django.urls import path
from .views import SocialLinkListCreateView, SocialLinkDetailView

app_name = 'socials'

urlpatterns = [
    path('', SocialLinkListCreateView.as_view(), name='social-link-list'),
    path('<uuid:id>/', SocialLinkDetailView.as_view(), name='social-link-detail'),
]
