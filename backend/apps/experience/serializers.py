"""
Serializers for experience app.
"""
from rest_framework import serializers
from .models import Experience


class ExperienceSerializer(serializers.ModelSerializer):
    """
    Serializer for work experience.
    """
    employment_type_display = serializers.CharField(source='get_employment_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    created_by = serializers.StringRelatedField(read_only=True)
    updated_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Experience
        fields = [
            'id', 'company', 'position', 'employment_type', 'employment_type_display',
            'location', 'start_date', 'end_date', 'is_current', 'description',
            'responsibilities', 'technologies', 'achievements', 'company_website',
            'company_logo', 'show_on_homepage', 'is_featured', 'status', 'status_display',
            'is_active', 'order', 'created_at', 'updated_at', 'created_by', 'updated_by'
        ]
        read_only_fields = [
            'id', 'created_at', 'updated_at', 'created_by', 'updated_by'
        ]


class ExperienceListSerializer(serializers.ModelSerializer):
    """
    Lightweight serializer for experience lists.
    """
    employment_type_display = serializers.CharField(source='get_employment_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Experience
        fields = [
            'id', 'company', 'position', 'employment_type', 'employment_type_display',
            'location', 'start_date', 'end_date', 'is_current', 'show_on_homepage',
            'is_featured', 'status', 'status_display', 'is_active', 'order'
        ]
