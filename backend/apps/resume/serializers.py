"""
Serializers for resume app.
"""
from rest_framework import serializers
from .models import Resume


class ResumeSerializer(serializers.ModelSerializer):
    """
    Serializer for resume.
    """
    file_type_display = serializers.CharField(source='get_file_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    created_by = serializers.StringRelatedField(read_only=True)
    updated_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Resume
        fields = [
            'id', 'title', 'description', 'resume_file', 'file_type',
            'file_type_display', 'version', 'is_default', 'download_count',
            'last_downloaded_at', 'show_on_homepage', 'status', 'status_display',
            'is_active', 'created_at', 'updated_at', 'created_by', 'updated_by'
        ]
        read_only_fields = [
            'id', 'download_count', 'last_downloaded_at',
            'created_at', 'updated_at', 'created_by', 'updated_by'
        ]


class ResumeListSerializer(serializers.ModelSerializer):
    """
    Lightweight serializer for resume lists.
    """
    file_type_display = serializers.CharField(source='get_file_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Resume
        fields = [
            'id', 'title', 'version', 'file_type', 'file_type_display',
            'is_default', 'download_count', 'show_on_homepage',
            'status', 'status_display', 'is_active'
        ]
