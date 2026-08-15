"""
Views for timeline app.
"""
from rest_framework import generics
from core.permissions import IsPublicOrAuthenticated
from .models import Timeline
from .serializers import TimelineSerializer, TimelineListSerializer


class TimelineListCreateView(generics.ListCreateAPIView):
    """
    List and create timeline events.
    """
    queryset = Timeline.objects.all()
    permission_classes = [IsPublicOrAuthenticated]
    filterset_fields = ['status', 'is_active', 'event_type', 'show_on_homepage']
    search_fields = ['title', 'description']
    ordering_fields = ['order', 'date', '-date']

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return TimelineListSerializer
        return TimelineSerializer

    def get_queryset(self):
        """Filter queryset based on user permissions."""
        queryset = super().get_queryset()
        
        if not self.request.user.is_authenticated:
            return queryset.filter(status='published', is_active=True, show_on_homepage=True)
        
        if not self.request.user.is_content_manager():
            return queryset.filter(status='published', is_active=True, show_on_homepage=True)
        
        return queryset


class TimelineDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a timeline event.
    """
    queryset = Timeline.objects.all()
    serializer_class = TimelineSerializer
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
