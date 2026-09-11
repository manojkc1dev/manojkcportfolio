"""
Serializers for socials app.
"""
from rest_framework import serializers
from .models import SocialLink


class SocialLinkSerializer(serializers.ModelSerializer):
    """
    Serializer for social links.
    """
    platform_display = serializers.CharField(source='get_platform_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    created_by = serializers.StringRelatedField(read_only=True)
    updated_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = SocialLink
        fields = [
            'id', 'platform', 'platform_display', 'url', 'username',
            'display_name', 'icon', 'show_on_homepage', 'status',
            'status_display', 'is_active', 'order',
            'created_at', 'updated_at', 'created_by', 'updated_by'
        ]
        read_only_fields = [
            'id', 'created_at', 'updated_at', 'created_by', 'updated_by'
        ]


class SocialLinkListSerializer(serializers.ModelSerializer):
    """
    Lightweight serializer for social link lists.
    """
    platform_display = serializers.CharField(source='get_platform_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = SocialLink
        fields = [
            'id', 'platform', 'platform_display', 'url', 'username',
            'display_name', 'icon', 'show_on_homepage', 'status',
            'status_display', 'is_active', 'order'
        ]
