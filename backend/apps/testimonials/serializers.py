"""
Serializers for testimonials app.
"""
from rest_framework import serializers
from .models import Testimonial


class TestimonialSerializer(serializers.ModelSerializer):
    """
    Serializer for testimonials.
    """
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    created_by = serializers.StringRelatedField(read_only=True)
    updated_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Testimonial
        fields = [
            'id', 'client_name', 'client_designation', 'client_company',
            'client_photo', 'company_logo', 'review', 'rating',
            'linkedin_url', 'website_url', 'project_name', 'project_url',
            'show_on_homepage', 'is_featured', 'status', 'status_display',
            'is_active', 'order', 'created_at', 'updated_at', 'created_by', 'updated_by'
        ]
        read_only_fields = [
            'id', 'created_at', 'updated_at', 'created_by', 'updated_by'
        ]


class TestimonialListSerializer(serializers.ModelSerializer):
    """
    Lightweight serializer for testimonial lists.
    """
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Testimonial
        fields = [
            'id', 'client_name', 'client_company', 'rating',
            'show_on_homepage', 'is_featured', 'status', 'status_display',
            'is_active', 'order'
        ]
