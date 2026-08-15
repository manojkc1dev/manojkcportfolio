"""
Serializers for achievements app.
"""
from rest_framework import serializers
from .models import Achievement


class AchievementSerializer(serializers.ModelSerializer):
    """
    Serializer for achievements.
    """
    achievement_type_display = serializers.CharField(source='get_achievement_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    created_by = serializers.StringRelatedField(read_only=True)
    updated_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Achievement
        fields = [
            'id', 'title', 'achievement_type', 'achievement_type_display',
            'description', 'date', 'organization', 'organization_url',
            'organization_logo', 'certificate_image', 'badge_url', 'url',
            'show_on_homepage', 'is_featured', 'status', 'status_display',
            'is_active', 'order', 'created_at', 'updated_at', 'created_by', 'updated_by'
        ]
        read_only_fields = [
            'id', 'created_at', 'updated_at', 'created_by', 'updated_by'
        ]


class AchievementListSerializer(serializers.ModelSerializer):
    """
    Lightweight serializer for achievement lists.
    """
    achievement_type_display = serializers.CharField(source='get_achievement_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Achievement
        fields = [
            'id', 'title', 'achievement_type', 'achievement_type_display',
            'date', 'organization', 'show_on_homepage', 'is_featured',
            'status', 'status_display', 'is_active', 'order'
        ]
