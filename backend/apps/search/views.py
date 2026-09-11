"""
Views for search app.
"""
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from core.permissions import IsContentManagerOrAbove
from .models import SearchQuery
from .serializers import SearchQuerySerializer, SearchQueryListSerializer


class SearchQueryListCreateView(generics.ListCreateAPIView):
    """
    List and create search queries.
    """
    queryset = SearchQuery.objects.all()
    permission_classes = [IsAuthenticated, IsContentManagerOrAbove]
    filterset_fields = ['search_type']
    search_fields = ['query']
    ordering_fields = ['created_at']

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return SearchQueryListSerializer
        return SearchQuerySerializer


class SearchQueryDetailView(generics.RetrieveAPIView):
    """
    Retrieve search query.
    """
    queryset = SearchQuery.objects.all()
    serializer_class = SearchQuerySerializer
    permission_classes = [IsAuthenticated, IsContentManagerOrAbove]
    lookup_field = 'id'
