"""
Views for hero app.
"""
from core.views import BaseListCreateView, BaseRetrieveUpdateDestroyView
from core.permissions import IsPublicOrAuthenticated
from .models import Hero
from .serializers import HeroSerializer, HeroListSerializer


class HeroListCreateView(BaseListCreateView):
    """
    List and create hero sections with standardized API responses.
    """
    queryset = Hero.objects.all()
    permission_classes = [IsPublicOrAuthenticated]
    filterset_fields = ['status', 'is_active', 'availability_status', 'show_on_homepage', 'is_featured']
    search_fields = ['name', 'title', 'subtitle', 'description']
    ordering_fields = ['order', 'created_at']

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return HeroListSerializer
        return HeroSerializer

    def get_queryset(self):
        """Filter queryset based on user permissions."""
        queryset = super().get_queryset()
        
        if not self.request.user.is_authenticated:
            return queryset.filter(status='published', is_active=True, show_on_homepage=True)
        
        if not self.request.user.is_content_manager():
            return queryset.filter(status='published', is_active=True, show_on_homepage=True)
        
        return queryset


class HeroDetailView(BaseRetrieveUpdateDestroyView):
    """
    Retrieve, update or delete a hero section with standardized API responses.
    """
    queryset = Hero.objects.all()
    serializer_class = HeroSerializer
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
