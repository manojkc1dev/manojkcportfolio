"""
Serializers for services app.
"""
from rest_framework import serializers
from .models import Service


class ServiceSerializer(serializers.ModelSerializer):
    """
    Serializer for services.
    """
    price_type_display = serializers.CharField(source='get_price_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    created_by = serializers.StringRelatedField(read_only=True)
    updated_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Service
        fields = [
            'id', 'name', 'slug', 'tagline', 'description', 'icon',
            'image', 'color', 'price', 'price_type', 'price_type_display',
            'features', 'process_steps', 'show_on_homepage', 'is_featured',
            'status', 'status_display', 'is_active', 'order',
            'meta_title', 'meta_description', 'meta_keywords', 'og_image',
            'canonical_url', 'no_index', 'no_follow',
            'created_at', 'updated_at', 'created_by', 'updated_by'
        ]
        read_only_fields = [
            'id', 'created_at', 'updated_at', 'created_by', 'updated_by'
        ]

    def validate_slug(self, value):
        """Validate slug is unique."""
        if self.instance:
            if Service.objects.filter(slug=value).exclude(id=self.instance.id).exists():
                raise serializers.ValidationError('Service with this slug already exists.')
        else:
            if Service.objects.filter(slug=value).exists():
                raise serializers.ValidationError('Service with this slug already exists.')
        return value


class ServiceListSerializer(serializers.ModelSerializer):
    """
    Lightweight serializer for service lists.
    """
    price_type_display = serializers.CharField(source='get_price_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Service
        fields = [
            'id', 'name', 'slug', 'tagline', 'icon', 'image',
            'price', 'price_type', 'price_type_display', 'show_on_homepage',
            'is_featured', 'status', 'status_display', 'is_active', 'order'
        ]
