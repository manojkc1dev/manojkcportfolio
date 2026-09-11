"""
Views for experience app.
"""
from rest_framework import generics
from core.permissions import IsPublicOrAuthenticated
from .models import Experience
from .serializers import ExperienceSerializer, ExperienceListSerializer


class ExperienceListCreateView(generics.ListCreateAPIView):
    """
    List and create work experience.
    """
    queryset = Experience.objects.all()
    permission_classes = [IsPublicOrAuthenticated]
    filterset_fields = ['status', 'is_active', 'employment_type', 'is_current', 'show_on_homepage', 'is_featured']
    search_fields = ['company', 'position', 'description']
    ordering_fields = ['order', 'start_date', '-start_date']

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return ExperienceListSerializer
        return ExperienceSerializer

    def get_queryset(self):
        """Filter queryset based on user permissions."""
        queryset = super().get_queryset()
        
        if not self.request.user.is_authenticated:
            return queryset.filter(status='published', is_active=True, show_on_homepage=True)
        
        if not self.request.user.is_content_manager():
            return queryset.filter(status='published', is_active=True, show_on_homepage=True)
        
        return queryset


class ExperienceDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete work experience.
    """
    queryset = Experience.objects.all()
    serializer_class = ExperienceSerializer
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
