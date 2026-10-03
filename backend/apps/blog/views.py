"""
Public Read-Only API Views for Technical Blog Articles.
"""
from rest_framework import generics
from rest_framework.permissions import AllowAny
from .models import Article
from .serializers import ArticleListSerializer, ArticleDetailSerializer


class ArticleListView(generics.ListAPIView):
    """List published articles with lightweight summary representation."""
    permission_classes = [AllowAny]
    serializer_class = ArticleListSerializer
    pagination_class = None

    def get_queryset(self):
        queryset = Article.objects.filter(visibility='Published')
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category__iexact=category)
        featured = self.request.query_params.get('featured')
        if featured is not None and featured.lower() in ('true', '1'):
            queryset = queryset.filter(featured=True)
        tag = self.request.query_params.get('tag')
        if tag:
            queryset = queryset.filter(tags_list__contains=[tag])
        return queryset


class ArticleDetailView(generics.RetrieveAPIView):
    """Retrieve full published article by slug with full markdown content."""
    permission_classes = [AllowAny]
    serializer_class = ArticleDetailSerializer
    lookup_field = 'slug'

    def get_queryset(self):
        return Article.objects.filter(visibility='Published')
