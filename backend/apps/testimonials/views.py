"""
Views for testimonials app.
"""
from rest_framework import generics
from core.permissions import IsPublicOrAuthenticated
from .models import Testimonial
from .serializers import TestimonialSerializer, TestimonialListSerializer


class TestimonialListCreateView(generics.ListCreateAPIView):
    """
    List and create testimonials.
    """
    queryset = Testimonial.objects.all()
    permission_classes = [IsPublicOrAuthenticated]
    filterset_fields = ['status', 'is_active', 'is_featured', 'show_on_homepage', 'rating']
    search_fields = ['client_name', 'client_company', 'review']
    ordering_fields = ['order', 'rating']

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return TestimonialListSerializer
        return TestimonialSerializer

    def get_queryset(self):
        """Filter queryset based on user permissions."""
        queryset = super().get_queryset()
        
        if not self.request.user.is_authenticated:
            return queryset.filter(status='published', is_active=True, show_on_homepage=True)
        
        if not self.request.user.is_content_manager():
            return queryset.filter(status='published', is_active=True, show_on_homepage=True)
        
        return queryset


class TestimonialDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a testimonial.
    """
    queryset = Testimonial.objects.all()
    serializer_class = TestimonialSerializer
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
