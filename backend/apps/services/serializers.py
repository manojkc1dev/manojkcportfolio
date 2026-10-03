"""
Serializers for Engineering Services and Deliverable Scopes.
"""
from rest_framework import serializers
from .models import Service


class ServiceSerializer(serializers.ModelSerializer):
    """
    Public serializer for backend engineering services mapping snake_case to frontend camelCase.
    """
    shortSummary = serializers.CharField(source='short_summary', read_only=True)
    detailedScope = serializers.CharField(source='detailed_scope', read_only=True)
    coverImage = serializers.CharField(source='cover_image', read_only=True)
    metaTitle = serializers.CharField(source='meta_title', read_only=True)
    metaDescription = serializers.CharField(source='meta_description', read_only=True)

    class Meta:
        model = Service
        fields = (
            'id',
            'slug',
            'order',
            'title',
            'icon',
            'shortSummary',
            'detailedScope',
            'features',
            'deliverables',
            'technologies',
            'featured',
            'coverImage',
            'metaTitle',
            'metaDescription',
        )
