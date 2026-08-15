"""
Views for achievements app.
"""
from rest_framework import generics
from core.permissions import IsPublicOrAuthenticated
from .models import Achievement
from .serializers import AchievementSerializer, AchievementListSerializer


class AchievementListCreateView(generics.ListCreateAPIView):
    """
    List and create achievements.
    """
    queryset = Achievement.objects.all()
    permission_classes = [IsPublicOrAuthenticated]
    filterset_fields = ['status', 'is_active', 'achievement_type', 'is_featured', 'show_on_homepage']
    search_fields = ['title', 'organization', 'description']
    ordering_fields = ['order', 'date', '-date']

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return AchievementListSerializer
        return AchievementSerializer

    def get_queryset(self):
        """Filter queryset based on user permissions."""
        queryset = super().get_queryset()
        
        if not self.request.user.is_authenticated:
            return queryset.filter(status='published', is_active=True, show_on_homepage=True)
        
        if not self.request.user.is_content_manager():
            return queryset.filter(status='published', is_active=True, show_on_homepage=True)
        
        return queryset


class AchievementDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete an achievement.
    """
    queryset = Achievement.objects.all()
    serializer_class = AchievementSerializer
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
