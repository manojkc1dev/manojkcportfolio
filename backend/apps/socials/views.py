"""
Views for socials app.
"""
from rest_framework import generics
from rest_framework.permissions import AllowAny
from core.permissions import IsPublicOrAuthenticated
from .models import SocialLink
from .serializers import SocialLinkSerializer, SocialLinkListSerializer


class SocialLinkListCreateView(generics.ListCreateAPIView):
    """
    List and create social links.
    """
    queryset = SocialLink.objects.all()
    permission_classes = [AllowAny]
    filterset_fields = ['platform', 'status', 'is_active', 'show_on_homepage']
    search_fields = ['platform', 'url', 'username', 'display_name']
    ordering_fields = ['order']

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return SocialLinkListSerializer
        return SocialLinkSerializer

    def get_queryset(self):
        """Filter queryset based on user permissions."""
        queryset = super().get_queryset()
        
        if not self.request.user.is_authenticated:
            return queryset.filter(status='published', is_active=True, show_on_homepage=True)
        
        if not self.request.user.is_content_manager():
            return queryset.filter(status='published', is_active=True, show_on_homepage=True)
        
        return queryset


class SocialLinkDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a social link.
    """
    queryset = SocialLink.objects.all()
    serializer_class = SocialLinkSerializer
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
