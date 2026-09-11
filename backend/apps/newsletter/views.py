"""
Views for newsletter app.
"""
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from core.permissions import IsContentManagerOrAbove
from .models import Newsletter
from .serializers import NewsletterSerializer, NewsletterListSerializer


class NewsletterListCreateView(generics.ListCreateAPIView):
    """
    List and create newsletter subscriptions.
    """
    queryset = Newsletter.objects.all()
    permission_classes = [AllowAny]
    filterset_fields = ['is_subscribed', 'is_verified', 'source']
    search_fields = ['email', 'name']
    ordering_fields = ['created_at']

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return NewsletterListSerializer
        return NewsletterSerializer

    def get_queryset(self):
        """Filter queryset based on user permissions."""
        queryset = super().get_queryset()
        
        if not self.request.user.is_authenticated:
            return queryset.none()
        
        if not self.request.user.is_content_manager():
            return queryset.none()
        
        return queryset


class NewsletterDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a newsletter subscription.
    """
    queryset = Newsletter.objects.all()
    serializer_class = NewsletterSerializer
    permission_classes = [IsAuthenticated, IsContentManagerOrAbove]
    lookup_field = 'id'
