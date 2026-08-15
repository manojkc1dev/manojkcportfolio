"""
Views for project categories.
"""
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from core.permissions import IsPublicOrAuthenticated, CanPublish
from .models import ProjectCategory
from .serializers import ProjectCategorySerializer


class ProjectCategoryListCreateView(generics.ListCreateAPIView):
    """
    List and create project categories.
    """
    queryset = ProjectCategory.objects.all()
    serializer_class = ProjectCategorySerializer
    permission_classes = [IsPublicOrAuthenticated]
    filterset_fields = ['status', 'is_active', 'is_featured']
    search_fields = ['name', 'description']


class ProjectCategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a project category.
    """
    queryset = ProjectCategory.objects.all()
    serializer_class = ProjectCategorySerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'slug'
