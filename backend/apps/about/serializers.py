"""
Serializers for about app.
"""
from rest_framework import serializers
from .models import About


class AboutSerializer(serializers.ModelSerializer):
    """
    Serializer for about section.
    """
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    created_by = serializers.StringRelatedField(read_only=True)
    updated_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = About
        fields = [
            'id', 'photo', 'bio', 'long_description', 'mission', 'vision',
            'years_experience', 'projects_completed', 'happy_clients', 'awards_won',
            'quote', 'quote_author', 'highlights', 'show_on_homepage',
            'status', 'status_display', 'is_active', 'meta_title', 'meta_description',
            'meta_keywords', 'og_image', 'canonical_url', 'no_index', 'no_follow',
            'created_at', 'updated_at', 'created_by', 'updated_by'
        ]
        read_only_fields = [
            'id', 'created_at', 'updated_at', 'created_by', 'updated_by'
        ]


class AboutListSerializer(serializers.ModelSerializer):
    """
    Lightweight serializer for about lists.
    """
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = About
        fields = [
            'id', 'bio', 'years_experience', 'projects_completed',
            'show_on_homepage', 'status', 'status_display', 'is_active', 'created_at'
        ]
