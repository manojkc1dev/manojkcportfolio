"""
URL configuration for core app.
"""
from django.urls import path
from django.http import JsonResponse


def health_check(request):
    """Health check endpoint."""
    return JsonResponse({
        'status': 'healthy',
        'service': 'portfolio-cms',
        'version': '1.0.0'
    })


urlpatterns = [
    path('', health_check, name='health-check'),
]
