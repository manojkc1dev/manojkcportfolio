"""
Views for techstack app.
"""
from rest_framework import generics
from core.permissions import IsPublicOrAuthenticated
from .models import TechStackItem, TechStackCategory
from .serializers import (
    TechStackItemSerializer, TechStackItemListSerializer,
    TechStackCategorySerializer
)


class TechStackCategoryListCreateView(generics.ListCreateAPIView):
    """
    List and create tech stack categories.
    """
    queryset = TechStackCategory.objects.all()
    serializer_class = TechStackCategorySerializer
    permission_classes = [IsPublicOrAuthenticated]
    filterset_fields = ['category_type', 'status', 'is_active']
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


class TechStackCategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a tech stack category.
    """
    queryset = TechStackCategory.objects.all()
    serializer_class = TechStackCategorySerializer
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


class TechStackItemListCreateView(generics.ListCreateAPIView):
    """
    List and create tech stack items.
    """
    queryset = TechStackItem.objects.select_related('category')
    permission_classes = [IsPublicOrAuthenticated]
    filterset_fields = ['status', 'is_active', 'category', 'skill_level', 'is_featured', 'show_on_homepage']
    search_fields = ['name', 'slug', 'category__name']
    ordering_fields = ['display_order', 'order', 'name']

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return TechStackItemListSerializer
        return TechStackItemSerializer

    def get_queryset(self):
        """Filter queryset based on user permissions."""
        queryset = super().get_queryset()
        
        if not self.request.user.is_authenticated:
            return queryset.filter(status='published', is_active=True, show_on_homepage=True)
        
        if not self.request.user.is_content_manager():
            return queryset.filter(status='published', is_active=True, show_on_homepage=True)
        
        return queryset


class TechStackItemDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a tech stack item.
    """
    queryset = TechStackItem.objects.select_related('category')
    serializer_class = TechStackItemSerializer
    permission_classes = [IsPublicOrAuthenticated]
    lookup_field = 'slug'

    def get_queryset(self):
        """Filter queryset based on user permissions."""
        queryset = super().get_queryset()
        
        if not self.request.user.is_authenticated:
            return queryset.filter(status='published', is_active=True, show_on_homepage=True)
        
        if not self.request.user.is_content_manager():
            return queryset.filter(status='published', is_active=True, show_on_homepage=True)
        
        return queryset
