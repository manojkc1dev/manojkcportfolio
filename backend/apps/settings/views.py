"""
Views for settings app.
"""
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from core.permissions import IsAdminOrSuperAdmin
from .models import SiteSettings, HomepageSection
from .serializers import SiteSettingsSerializer, HomepageSectionSerializer, PublicSettingsSerializer


class SiteSettingsDetailView(generics.RetrieveUpdateAPIView):
    """
    Retrieve or update site settings (admin only).
    """
    queryset = SiteSettings.objects.all()
    serializer_class = SiteSettingsSerializer
    permission_classes = [IsAdminOrSuperAdmin]

    def get_object(self):
        """Always return the singleton instance."""
        return SiteSettings.get_settings()


class PublicSettingsView(generics.RetrieveAPIView):
    """
    Retrieve public site settings (no authentication required).
    """
    serializer_class = PublicSettingsSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        """Always return the singleton instance."""
        return SiteSettings.get_settings()


class HomepageSectionListCreateView(generics.ListCreateAPIView):
    """
    List and create homepage sections (admin only).
    """
    queryset = HomepageSection.objects.all()
    serializer_class = HomepageSectionSerializer
    permission_classes = [IsAdminOrSuperAdmin]

    def get_queryset(self):
        """Return sections ordered by order field."""
        return super().get_queryset().order_by('order')


class HomepageSectionDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a homepage section (admin only).
    """
    queryset = HomepageSection.objects.all()
    serializer_class = HomepageSectionSerializer
    permission_classes = [IsAdminOrSuperAdmin]
    lookup_field = 'section_type'
