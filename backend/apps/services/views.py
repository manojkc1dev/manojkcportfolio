"""
Public Read-Only API Views for Engineering Services.
"""
from rest_framework import generics
from rest_framework.permissions import AllowAny
from .models import Service
from .serializers import ServiceSerializer


class ServiceListView(generics.ListAPIView):
    """List published engineering services."""
    permission_classes = [AllowAny]
    serializer_class = ServiceSerializer
    pagination_class = None

    def get_queryset(self):
        queryset = Service.objects.filter(visibility='Published')
        featured = self.request.query_params.get('featured')
        if featured is not None and featured.lower() in ('true', '1'):
            queryset = queryset.filter(featured=True)
        return queryset


class ServiceDetailView(generics.RetrieveAPIView):
    """Retrieve a single published service specification by slug."""
    permission_classes = [AllowAny]
    serializer_class = ServiceSerializer
    lookup_field = 'slug'

    def get_queryset(self):
        return Service.objects.filter(visibility='Published')
