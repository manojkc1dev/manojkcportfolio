"""
Views for FAQs app.
"""
from rest_framework import generics
from core.permissions import IsPublicOrAuthenticated
from .models import FAQ, FAQCategory
from .serializers import FAQSerializer, FAQListSerializer, FAQCategorySerializer


class FAQCategoryListCreateView(generics.ListCreateAPIView):
    """
    List and create FAQ categories.
    """
    queryset = FAQCategory.objects.all()
    serializer_class = FAQCategorySerializer
    permission_classes = [IsPublicOrAuthenticated]
    filterset_fields = ['status', 'is_active']
    search_fields = ['name', 'slug', 'description']
    ordering_fields = ['order', 'name']

    def get_queryset(self):
        """Filter queryset based on user permissions."""
        queryset = super().get_queryset()
        
        if not self.request.user.is_authenticated:
            return queryset.filter(status='published', is_active=True)
        
        if not self.request.user.is_content_manager():
            return queryset.filter(status='published', is_active=True)
        
        return queryset


class FAQCategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete an FAQ category.
    """
    queryset = FAQCategory.objects.all()
    serializer_class = FAQCategorySerializer
    permission_classes = [IsPublicOrAuthenticated]
    lookup_field = 'slug'

    def get_queryset(self):
        """Filter queryset based on user permissions."""
        queryset = super().get_queryset()
        
        if not self.request.user.is_authenticated:
            return queryset.filter(status='published', is_active=True)
        
        if not self.request.user.is_content_manager():
            return queryset.filter(status='published', is_active=True)
        
        return queryset


class FAQListCreateView(generics.ListCreateAPIView):
    """
    List and create FAQs.
    """
    queryset = FAQ.objects.select_related('category')
    permission_classes = [IsPublicOrAuthenticated]
    filterset_fields = ['status', 'is_active', 'category', 'is_featured', 'show_on_homepage']
    search_fields = ['question', 'answer']
    ordering_fields = ['order']

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return FAQListSerializer
        return FAQSerializer

    def get_queryset(self):
        """Filter queryset based on user permissions."""
        queryset = super().get_queryset()
        
        if not self.request.user.is_authenticated:
            return queryset.filter(status='published', is_active=True, show_on_homepage=True)
        
        if not self.request.user.is_content_manager():
            return queryset.filter(status='published', is_active=True, show_on_homepage=True)
        
        return queryset


class FAQDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete an FAQ.
    """
    queryset = FAQ.objects.select_related('category')
    serializer_class = FAQSerializer
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
