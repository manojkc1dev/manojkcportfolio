"""
Views for services app.
"""
from rest_framework import generics
from core.permissions import IsPublicOrAuthenticated
from .models import Service
from .serializers import ServiceSerializer, ServiceListSerializer


class ServiceListCreateView(generics.ListCreateAPIView):
    """
    List and create services.
    """
    queryset = Service.objects.all()
    permission_classes = [IsPublicOrAuthenticated]
    filterset_fields = ['status', 'is_active', 'price_type', 'is_featured', 'show_on_homepage']
    search_fields = ['name', 'slug', 'tagline', 'description']
    ordering_fields = ['order', 'name']

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return ServiceListSerializer
        return ServiceSerializer

    def get_queryset(self):
        """Filter queryset based on user permissions."""
        queryset = super().get_queryset()
        
        if not self.request.user.is_authenticated:
            return queryset.filter(status='published', is_active=True, show_on_homepage=True)
        
        if not self.request.user.is_content_manager():
            return queryset.filter(status='published', is_active=True, show_on_homepage=True)
        
        return queryset


class ServiceDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a service.
    """
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    permission_classes = [IsPublicOrAuthenticated]
    lookup_field = 'slug'

    def get_queryset(self):
        """Filter queryset based on user permissions."""
        queryset = super().get_queryset()
        
        if not self.request.user.is_authenticated:
            return queryset.filter(status='published', is_active=True, show_on_homepage=True)
        
        if not self.request.user.is_content_manager():
            return queryset.filter(status='published', is_active=True, show_on_homepage=True)
        
        return queryset
