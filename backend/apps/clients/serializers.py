"""
Serializers for clients app.
"""
from rest_framework import serializers
from .models import Client


class ClientSerializer(serializers.ModelSerializer):
    """
    Serializer for clients.
    """
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    created_by = serializers.StringRelatedField(read_only=True)
    updated_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Client
        fields = [
            'id', 'name', 'company', 'designation', 'logo', 'photo',
            'website', 'email', 'linkedin', 'review', 'rating',
            'project_name', 'project_description', 'show_on_homepage',
            'is_featured', 'status', 'status_display', 'is_active', 'order',
            'created_at', 'updated_at', 'created_by', 'updated_by'
        ]
        read_only_fields = [
            'id', 'created_at', 'updated_at', 'created_by', 'updated_by'
        ]


class ClientListSerializer(serializers.ModelSerializer):
    """
    Lightweight serializer for client lists.
    """
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Client
        fields = [
            'id', 'name', 'company', 'designation', 'logo', 'rating',
            'show_on_homepage', 'is_featured', 'status', 'status_display',
            'is_active', 'order'
        ]
