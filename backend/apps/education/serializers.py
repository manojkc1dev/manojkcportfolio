"""
Serializers for education app.
"""
from rest_framework import serializers
from .models import Education


class EducationSerializer(serializers.ModelSerializer):
    """
    Serializer for education.
    """
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    created_by = serializers.StringRelatedField(read_only=True)
    updated_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Education
        fields = [
            'id', 'institution', 'degree', 'major', 'field_of_study',
            'start_date', 'end_date', 'is_current', 'cgpa', 'percentage', 'grade',
            'description', 'coursework', 'achievements', 'institution_website',
            'institution_logo', 'show_on_homepage', 'status', 'status_display',
            'is_active', 'order', 'created_at', 'updated_at', 'created_by', 'updated_by'
        ]
        read_only_fields = [
            'id', 'created_at', 'updated_at', 'created_by', 'updated_by'
        ]


class EducationListSerializer(serializers.ModelSerializer):
    """
    Lightweight serializer for education lists.
    """
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Education
        fields = [
            'id', 'institution', 'degree', 'major', 'start_date',
            'end_date', 'is_current', 'cgpa', 'show_on_homepage',
            'status', 'status_display', 'is_active', 'order'
        ]
