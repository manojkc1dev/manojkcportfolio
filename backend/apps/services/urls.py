"""
URL configuration for services app.
"""
from django.urls import path
from .views import ServiceListCreateView, ServiceDetailView

app_name = 'services'

urlpatterns = [
    path('', ServiceListCreateView.as_view(), name='service-list'),
    path('<slug:slug>/', ServiceDetailView.as_view(), name='service-detail'),
]
