"""
Public Read-Only API Views for Portfolio Projects and Case Studies.
"""
from rest_framework import generics
from rest_framework.permissions import AllowAny
from rest_framework.exceptions import NotFound
from .models import Project
from .serializers import ProjectListSerializer, ProjectDetailSerializer


class ProjectListView(generics.ListAPIView):
    """List published portfolio projects with preloaded relational data."""
    permission_classes = [AllowAny]
    serializer_class = ProjectListSerializer
    pagination_class = None

    def get_queryset(self):
        queryset = Project.objects.filter(visibility='Published').prefetch_related(
            'metrics_items', 'challenges_items', 'tech_choices_items'
        )
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category__iexact=category)
        featured = self.request.query_params.get('featured')
        if featured is not None and featured.lower() in ('true', '1'):
            queryset = queryset.filter(featured=True)
        return queryset


class ProjectDetailView(generics.RetrieveAPIView):
    """Retrieve a single published project case study by slug or id."""
    permission_classes = [AllowAny]
    serializer_class = ProjectDetailSerializer
    lookup_field = 'slug'

    def get_queryset(self):
        return Project.objects.filter(visibility='Published').prefetch_related(
            'metrics_items', 'challenges_items', 'tech_choices_items'
        )

    def get_object(self):
        lookup_url_kwarg = self.lookup_url_kwarg or self.lookup_field
        lookup_value = self.kwargs[lookup_url_kwarg]
        queryset = self.get_queryset()
        obj = queryset.filter(slug=lookup_value).first() or queryset.filter(id=lookup_value).first()
        if obj is None:
            raise NotFound(f"Project '{lookup_value}' not found.")
        self.check_object_permissions(self.request, obj)
        return obj
