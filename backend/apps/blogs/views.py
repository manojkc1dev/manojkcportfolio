"""
Views for blogs app.
"""
from rest_framework import generics
from rest_framework.response import Response
from core.permissions import IsPublicOrAuthenticated, IsPublicReadOrContentManagerWrite
from .models import Blog, BlogCategory, BlogTag
from .serializers import (
    BlogSerializer, BlogListSerializer,
    BlogCategorySerializer, BlogTagSerializer
)


class BlogCategoryListCreateView(generics.ListCreateAPIView):
    """
    List and create blog categories.
    """
    queryset = BlogCategory.objects.all()
    serializer_class = BlogCategorySerializer
    permission_classes = [IsPublicReadOrContentManagerWrite]
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


class BlogCategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a blog category.
    """
    queryset = BlogCategory.objects.all()
    serializer_class = BlogCategorySerializer
    permission_classes = [IsPublicReadOrContentManagerWrite]
    lookup_field = 'slug'

    def get_queryset(self):
        """Filter queryset based on user permissions."""
        queryset = super().get_queryset()
        
        if not self.request.user.is_authenticated:
            return queryset.filter(status='published', is_active=True)
        
        if not self.request.user.is_content_manager():
            return queryset.filter(status='published', is_active=True)
        
        return queryset


class BlogTagListCreateView(generics.ListCreateAPIView):
    """
    List and create blog tags.
    """
    queryset = BlogTag.objects.all()
    serializer_class = BlogTagSerializer
    permission_classes = [IsPublicReadOrContentManagerWrite]
    search_fields = ['name', 'slug']
    ordering_fields = ['name']

    def get_queryset(self):
        """Filter queryset based on user permissions."""
        queryset = super().get_queryset()
        
        if not self.request.user.is_authenticated:
            return queryset.filter(status='published', is_active=True)
        
        if not self.request.user.is_content_manager():
            return queryset.filter(status='published', is_active=True)
        
        return queryset


class BlogTagDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a blog tag.
    """
    queryset = BlogTag.objects.all()
    serializer_class = BlogTagSerializer
    permission_classes = [IsPublicReadOrContentManagerWrite]
    lookup_field = 'slug'

    def get_queryset(self):
        """Filter queryset based on user permissions."""
        queryset = super().get_queryset()
        
        if not self.request.user.is_authenticated:
            return queryset.filter(status='published', is_active=True)
        
        if not self.request.user.is_content_manager():
            return queryset.filter(status='published', is_active=True)
        
        return queryset


class BlogListCreateView(generics.ListCreateAPIView):
    """
    List and create blog posts.
    """
    queryset = Blog.objects.select_related('category', 'author').prefetch_related('tags')
    permission_classes = [IsPublicReadOrContentManagerWrite]
    filterset_fields = ['status', 'is_active', 'category', 'is_featured', 'allow_comments']
    search_fields = ['title', 'slug', 'excerpt', 'content']
    ordering_fields = ['published_at', 'created_at', 'title', 'view_count', 'like_count']

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return BlogListSerializer
        return BlogSerializer

    def get_queryset(self):
        """Filter queryset based on user permissions."""
        queryset = super().get_queryset()
        
        if not self.request.user.is_authenticated:
            return queryset.filter(status='published', is_active=True)
        
        if not self.request.user.is_content_manager():
            return queryset.filter(status='published', is_active=True)
        
        return queryset


class BlogDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a blog post.
    """
    queryset = Blog.objects.select_related('category', 'author').prefetch_related('tags')
    serializer_class = BlogSerializer
    permission_classes = [IsPublicReadOrContentManagerWrite]
    lookup_field = 'slug'

    def get_queryset(self):
        """Filter queryset based on user permissions."""
        queryset = super().get_queryset()
        
        if not self.request.user.is_authenticated:
            return queryset.filter(status='published', is_active=True)
        
        if not self.request.user.is_content_manager():
            return queryset.filter(status='published', is_active=True)
        
        return queryset

    def retrieve(self, request, *args, **kwargs):
        """Increment view count on retrieve."""
        instance = self.get_object()
        instance.increment_view_count()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
