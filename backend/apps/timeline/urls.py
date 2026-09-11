"""
URL configuration for timeline app.
"""
from django.urls import path
from .views import TimelineListCreateView, TimelineDetailView

app_name = 'timeline'

urlpatterns = [
    path('', TimelineListCreateView.as_view(), name='timeline-list'),
    path('<uuid:id>/', TimelineDetailView.as_view(), name='timeline-detail'),
]
