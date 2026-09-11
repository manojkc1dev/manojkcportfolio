"""
URL configuration for analytics app.
"""
from django.urls import path
from .views import AnalyticsListCreateView, AnalyticsDetailView

app_name = 'analytics'

urlpatterns = [
    path('', AnalyticsListCreateView.as_view(), name='analytics-list'),
    path('<uuid:id>/', AnalyticsDetailView.as_view(), name='analytics-detail'),
]
