"""
URL routing for Engineering Services API.
"""
from django.urls import path
from .views import ServiceListView, ServiceDetailView

app_name = 'services'

urlpatterns = [
    path('services/', ServiceListView.as_view(), name='service_list'),
    path('services/<slug:slug>/', ServiceDetailView.as_view(), name='service_detail'),
]
