"""
Serializers for analytics app.
"""
from rest_framework import serializers
from .models import Analytics


class AnalyticsSerializer(serializers.ModelSerializer):
    """
    Serializer for analytics.
    """
    created_by = serializers.StringRelatedField(read_only=True)
    updated_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Analytics
        fields = [
            'id', 'ip_address', 'user_agent', 'country', 'city', 'region',
            'device_type', 'browser', 'os', 'session_id', 'referrer',
            'landing_page', 'exit_page', 'duration', 'page_views',
            'source', 'medium', 'campaign', 'created_at', 'updated_at',
            'created_by', 'updated_by'
        ]
        read_only_fields = [
            'id', 'ip_address', 'user_agent', 'country', 'city', 'region',
            'device_type', 'browser', 'os', 'session_id', 'referrer',
            'landing_page', 'exit_page', 'duration', 'page_views',
            'source', 'medium', 'campaign', 'created_at', 'updated_at',
            'created_by', 'updated_by'
        ]


class AnalyticsListSerializer(serializers.ModelSerializer):
    """
    Lightweight serializer for analytics lists.
    """
    class Meta:
        model = Analytics
        fields = [
            'id', 'ip_address', 'country', 'device_type', 'browser',
            'page_views', 'duration', 'created_at'
        ]
