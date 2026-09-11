"""
Views for skills app.
"""
from rest_framework import generics
from core.permissions import IsPublicOrAuthenticated
from .models import Skill, SkillCategory
from .serializers import SkillSerializer, SkillListSerializer, SkillCategorySerializer


class SkillCategoryListCreateView(generics.ListCreateAPIView):
    """
    List and create skill categories.
    """
    queryset = SkillCategory.objects.all()
    serializer_class = SkillCategorySerializer
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


class SkillCategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a skill category.
    """
    queryset = SkillCategory.objects.all()
    serializer_class = SkillCategorySerializer
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


class SkillListCreateView(generics.ListCreateAPIView):
    """
    List and create skills.
    """
    queryset = Skill.objects.select_related('category')
    permission_classes = [IsPublicOrAuthenticated]
    filterset_fields = ['status', 'is_active', 'category', 'is_featured', 'show_on_homepage']
    search_fields = ['name', 'slug', 'category__name']
    ordering_fields = ['priority', 'order', 'percentage', 'name']

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return SkillListSerializer
        return SkillSerializer

    def get_queryset(self):
        """Filter queryset based on user permissions."""
        queryset = super().get_queryset()
        
        if not self.request.user.is_authenticated:
            return queryset.filter(status='published', is_active=True, show_on_homepage=True)
        
        if not self.request.user.is_content_manager():
            return queryset.filter(status='published', is_active=True, show_on_homepage=True)
        
        return queryset


class SkillDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a skill.
    """
    queryset = Skill.objects.select_related('category')
    serializer_class = SkillSerializer
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
