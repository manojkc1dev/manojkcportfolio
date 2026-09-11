"""
Views for about app.
"""
from core.views import BaseListCreateView, BaseRetrieveUpdateDestroyView
from core.permissions import IsPublicOrAuthenticated
from .models import About
from .serializers import AboutSerializer, AboutListSerializer


class AboutListCreateView(BaseListCreateView):
    """
    List and create about sections with standardized API responses.
    """
    queryset = About.objects.all()
    permission_classes = [IsPublicOrAuthenticated]
    filterset_fields = ['status', 'is_active', 'show_on_homepage']
    search_fields = ['bio', 'long_description', 'mission', 'vision']
    ordering_fields = ['created_at']

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return AboutListSerializer
        return AboutSerializer

    def get_queryset(self):
        """Filter queryset based on user permissions."""
        queryset = super().get_queryset()
        
        if not self.request.user.is_authenticated:
            return queryset.filter(status='published', is_active=True, show_on_homepage=True)
        
        if not self.request.user.is_content_manager():
            return queryset.filter(status='published', is_active=True, show_on_homepage=True)
        
        return queryset


class AboutDetailView(BaseRetrieveUpdateDestroyView):
    """
    Retrieve, update or delete an about section with standardized API responses.
    """
    queryset = About.objects.all()
    serializer_class = AboutSerializer
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
