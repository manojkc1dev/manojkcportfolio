"""
Serializers for search app.
"""
from rest_framework import serializers
from .models import SearchQuery


class SearchQuerySerializer(serializers.ModelSerializer):
    """
    Serializer for search queries.
    """
    search_type_display = serializers.CharField(source='get_search_type_display', read_only=True)
    created_by = serializers.StringRelatedField(read_only=True)
    updated_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = SearchQuery
        fields = [
            'id', 'query', 'results_count', 'ip_address', 'user_agent',
            'search_type', 'search_type_display', 'created_at', 'updated_at',
            'created_by', 'updated_by'
        ]
        read_only_fields = [
            'id', 'query', 'results_count', 'ip_address', 'user_agent',
            'search_type', 'created_at', 'updated_at', 'created_by', 'updated_by'
        ]


class SearchQueryListSerializer(serializers.ModelSerializer):
    """
    Lightweight serializer for search query lists.
    """
    search_type_display = serializers.CharField(source='get_search_type_display', read_only=True)

    class Meta:
        model = SearchQuery
        fields = [
            'id', 'query', 'results_count', 'search_type',
            'search_type_display', 'created_at'
        ]
