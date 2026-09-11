"""
Views for SEO app.
"""
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from core.permissions import IsContentManagerOrAbove
from .models import SEOSettings
from .serializers import SEOSettingsSerializer


class SEOSettingsDetailView(generics.RetrieveUpdateAPIView):
    """
    Retrieve or update SEO settings.
    """
    queryset = SEOSettings.objects.all()
    serializer_class = SEOSettingsSerializer
    permission_classes = [IsAuthenticated, IsContentManagerOrAbove]
    
    def get_object(self):
        """Get or create SEO settings."""
        obj, created = SEOSettings.objects.get_or_create()
        return obj
