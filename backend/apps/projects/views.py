"""
Views for projects app.
"""
from core.views import BaseListCreateView, BaseRetrieveUpdateDestroyView
from core.permissions import IsContentManagerOrAbove
from core.responses import StandardResponse
from rest_framework.permissions import BasePermission, SAFE_METHODS
from .models import Project
from .serializers import ProjectSerializer, ProjectListSerializer


class IsPublicReadOrContentManagerWrite(BasePermission):
    """
    Custom permission:
    - Allow anonymous GET/HEAD/OPTIONS (Read-only)
    - Require Content Manager or above for POST/PUT/PATCH/DELETE (Write)
    """
    def has_permission(self, request, view):
        # Allow safe methods (GET, HEAD, OPTIONS) for anyone (including anonymous)
        if request.method in SAFE_METHODS:
            return True
        
        # Require Content Manager or above for write operations
        return IsContentManagerOrAbove().has_permission(request, view)


class ProjectListCreateView(BaseListCreateView):
    """
    List and create projects with standardized API responses.
    """
    queryset = Project.objects.select_related('category')
    # FIXED: Allow anonymous GET, but require Content Manager or above for POST
    permission_classes = [IsPublicReadOrContentManagerWrite]
    filterset_fields = ['status', 'is_active', 'visibility', 'is_featured', 'is_pinned', 'category']
    search_fields = ['title', 'slug', 'description', 'short_description']
    ordering_fields = ['order', 'created_at', 'view_count', 'like_count', 'share_count']

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return ProjectListSerializer
        return ProjectSerializer

    def get_queryset(self):
        """Filter queryset based on user permissions."""
        queryset = super().get_queryset()
        
        if not self.request.user.is_authenticated:
            return queryset.filter(status='published', is_active=True, visibility='public')
        
        if not self.request.user.is_content_manager():
            return queryset.filter(status='published', is_active=True, visibility='public')
        
        return queryset


class ProjectDetailView(BaseRetrieveUpdateDestroyView):
    """
    Retrieve, update or delete a project with standardized API responses.
    """
    queryset = Project.objects.select_related('category')
    serializer_class = ProjectSerializer
    # FIXED: Allow anonymous GET, but require Content Manager or above for write
    permission_classes = [IsPublicReadOrContentManagerWrite]
    lookup_field = 'slug'

    def get_queryset(self):
        """Filter queryset based on user permissions."""
        queryset = super().get_queryset()
        
        if not self.request.user.is_authenticated:
            return queryset.filter(status='published', is_active=True, visibility='public')
        
        if not self.request.user.is_content_manager():
            return queryset.filter(status='published', is_active=True, visibility='public')
        
        return queryset

    def retrieve(self, request, *args, **kwargs):
        """Increment view count on retrieve with standardized response."""
        instance = self.get_object()
        instance.increment_view_count()
        serializer = self.get_serializer(instance)
        return self.get_response(serializer.data, "Success")


def increment_like_count(request, slug):
    """
    Increment like count for a project with standardized response.
    """
    try:
        project = Project.objects.get(slug=slug)
        project.increment_like_count()
        return StandardResponse.success({'like_count': project.like_count}, "Like count incremented")
    except Project.DoesNotExist:
        return StandardResponse.not_found("Project")


def increment_share_count(request, slug):
    """
    Increment share count for a project with standardized response.
    """
    try:
        project = Project.objects.get(slug=slug)
        project.increment_share_count()
        return StandardResponse.success({'share_count': project.share_count}, "Share count incremented")
    except Project.DoesNotExist:
        return StandardResponse.not_found("Project")


def publish_project(request, slug):
    """
    Publish a project with standardized response.
    """
    try:
        project = Project.objects.get(slug=slug)
        project.status = 'published'
        project.save()
        return StandardResponse.success({'status': 'published'}, "Project published successfully")
    except Project.DoesNotExist:
        return StandardResponse.not_found("Project")