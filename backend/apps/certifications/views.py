"""
Views for certifications app.
"""
from rest_framework import generics
from core.permissions import IsPublicOrAuthenticated
from .models import Certification
from .serializers import CertificationSerializer, CertificationListSerializer


class CertificationListCreateView(generics.ListCreateAPIView):
    """
    List and create certifications.
    """
    queryset = Certification.objects.all()
    permission_classes = [IsPublicOrAuthenticated]
    filterset_fields = ['status', 'is_active', 'is_verified', 'is_featured', 'show_on_homepage']
    search_fields = ['name', 'issuer', 'credential_id', 'description']
    ordering_fields = ['order', 'issue_date', '-issue_date']

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return CertificationListSerializer
        return CertificationSerializer

    def get_queryset(self):
        """Filter queryset based on user permissions."""
        queryset = super().get_queryset()
        
        if not self.request.user.is_authenticated:
            return queryset.filter(status='published', is_active=True, show_on_homepage=True)
        
        if not self.request.user.is_content_manager():
            return queryset.filter(status='published', is_active=True, show_on_homepage=True)
        
        return queryset


class CertificationDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a certification.
    """
    queryset = Certification.objects.all()
    serializer_class = CertificationSerializer
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
