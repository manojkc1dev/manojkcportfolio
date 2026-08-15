"""
URL configuration for certifications app.
"""
from django.urls import path
from .views import CertificationListCreateView, CertificationDetailView

app_name = 'certifications'

urlpatterns = [
    path('', CertificationListCreateView.as_view(), name='certification-list'),
    path('<uuid:id>/', CertificationDetailView.as_view(), name='certification-detail'),
]
