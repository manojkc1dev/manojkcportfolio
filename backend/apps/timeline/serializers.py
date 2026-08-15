"""
Serializers for timeline app.
"""
from rest_framework import serializers
from .models import Timeline


class TimelineSerializer(serializers.ModelSerializer):
    """
    Serializer for timeline events.
    """
    event_type_display = serializers.CharField(source='get_event_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    created_by = serializers.StringRelatedField(read_only=True)
    updated_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Timeline
        fields = [
            'id', 'title', 'event_type', 'event_type_display', 'date',
            'description', 'details', 'url', 'image', 'icon', 'color',
            'show_on_homepage', 'status', 'status_display', 'is_active', 'order',
            'created_at', 'updated_at', 'created_by', 'updated_by'
        ]
        read_only_fields = [
            'id', 'created_at', 'updated_at', 'created_by', 'updated_by'
        ]


class TimelineListSerializer(serializers.ModelSerializer):
    """
    Lightweight serializer for timeline lists.
    """
    event_type_display = serializers.CharField(source='get_event_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Timeline
        fields = [
            'id', 'title', 'event_type', 'event_type_display', 'date',
            'show_on_homepage', 'status', 'status_display', 'is_active', 'order'
        ]
