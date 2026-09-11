"""
Views for education app.
"""
from rest_framework import generics
from core.permissions import IsPublicOrAuthenticated
from .models import Education
from .serializers import EducationSerializer, EducationListSerializer


class EducationListCreateView(generics.ListCreateAPIView):
    """
    List and create education entries.
    """
    queryset = Education.objects.all()
    permission_classes = [IsPublicOrAuthenticated]
    filterset_fields = ['status', 'is_active', 'is_current', 'show_on_homepage']
    search_fields = ['institution', 'degree', 'major', 'field_of_study']
    ordering_fields = ['order', 'start_date', '-start_date']

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return EducationListSerializer
        return EducationSerializer

    def get_queryset(self):
        """Filter queryset based on user permissions."""
        queryset = super().get_queryset()
        
        if not self.request.user.is_authenticated:
            return queryset.filter(status='published', is_active=True, show_on_homepage=True)
        
        if not self.request.user.is_content_manager():
            return queryset.filter(status='published', is_active=True, show_on_homepage=True)
        
        return queryset


class EducationDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete education entry.
    """
    queryset = Education.objects.all()
    serializer_class = EducationSerializer
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
