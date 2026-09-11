"""
URL configuration for newsletter app.
"""
from django.urls import path
from .views import NewsletterListCreateView, NewsletterDetailView

app_name = 'newsletter'

urlpatterns = [
    path('', NewsletterListCreateView.as_view(), name='newsletter-list'),
    path('<uuid:id>/', NewsletterDetailView.as_view(), name='newsletter-detail'),
]
