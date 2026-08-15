"""
Serializers for project categories.
"""
from rest_framework import serializers
from .models import ProjectCategory


class ProjectCategorySerializer(serializers.ModelSerializer):
    """
    Serializer for project categories.
    """
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = ProjectCategory
        fields = [
            'id', 'name', 'slug', 'description', 'icon', 'color',
            'image', 'is_featured', 'status', 'status_display',
            'is_active', 'order', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
