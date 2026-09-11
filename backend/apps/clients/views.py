"""
Views for clients app.
"""
from rest_framework import generics
from core.permissions import IsPublicOrAuthenticated
from .models import Client
from .serializers import ClientSerializer, ClientListSerializer


class ClientListCreateView(generics.ListCreateAPIView):
    """
    List and create clients.
    """
    queryset = Client.objects.all()
    permission_classes = [IsPublicOrAuthenticated]
    filterset_fields = ['status', 'is_active', 'is_featured', 'show_on_homepage', 'rating']
    search_fields = ['name', 'company', 'designation', 'review']
    ordering_fields = ['order', 'name']

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return ClientListSerializer
        return ClientSerializer

    def get_queryset(self):
        """Filter queryset based on user permissions."""
        queryset = super().get_queryset()
        
        if not self.request.user.is_authenticated:
            return queryset.filter(status='published', is_active=True, show_on_homepage=True)
        
        if not self.request.user.is_content_manager():
            return queryset.filter(status='published', is_active=True, show_on_homepage=True)
        
        return queryset


class ClientDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a client.
    """
    queryset = Client.objects.all()
    serializer_class = ClientSerializer
    permission_classes = [IsPublicOrAuthenticated]
    lookup_field = 'id'

    def get_queryset(self):
        """Filter queryset based on user permissions."""
        queryset = super().get_queryset()
        
        if not self.request.user.is_authenticated:
            return queryset.filter(status='published', is_active=True, show_on_homepage=True)
        
        if not self.request.user.is_content_manager():
            return queryset.filter(status='published', is_active=True, show_on_homepage=True)
        
        return queryset
