"""
URL routing for Core API services.
"""
from django.urls import path
from .views import HealthCheckView

app_name = 'core_api'

urlpatterns = [
    path('health/', HealthCheckView.as_view(), name='health-check'),
]
