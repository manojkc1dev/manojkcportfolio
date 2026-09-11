"""
Serializers for hero app.
"""
from rest_framework import serializers
from .models import Hero


class HeroSerializer(serializers.ModelSerializer):
    """
    Serializer for hero section.
    """
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    availability_status_display = serializers.CharField(source='get_availability_status_display', read_only=True)
    created_by = serializers.StringRelatedField(read_only=True)
    updated_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Hero
        fields = [
            'id', 'name', 'title', 'subtitle', 'description',
            'availability_badge', 'availability_status', 'availability_status_display',
            'location', 'profile_image', 'background_image',
            'resume_button_text', 'resume_button_url',
            'hire_me_button_text', 'hire_me_button_url',
            'github_button_text', 'github_button_url',
            'linkedin_button_text', 'linkedin_button_url',
            'email_button_text', 'email_button_url',
            'whatsapp_button_text', 'whatsapp_button_url',
            'typing_animation_texts', 'typing_animation_enabled',
            'show_on_homepage', 'is_featured', 'status', 'status_display',
            'is_active', 'order', 'meta_title', 'meta_description',
            'meta_keywords', 'og_image', 'canonical_url', 'no_index', 'no_follow',
            'created_at', 'updated_at', 'created_by', 'updated_by'
        ]
        read_only_fields = [
            'id', 'created_at', 'updated_at', 'created_by', 'updated_by'
        ]


class HeroListSerializer(serializers.ModelSerializer):
    """
    Lightweight serializer for hero lists.
    """
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    availability_status_display = serializers.CharField(source='get_availability_status_display', read_only=True)

    class Meta:
        model = Hero
        fields = [
            'id', 'name', 'title', 'subtitle', 'availability_status',
            'availability_status_display', 'show_on_homepage', 'is_featured',
            'status', 'status_display', 'is_active', 'order', 'created_at'
        ]
