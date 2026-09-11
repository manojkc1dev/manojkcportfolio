"""
Serializers for FAQs app.
"""
from rest_framework import serializers
from .models import FAQ, FAQCategory


class FAQCategorySerializer(serializers.ModelSerializer):
    """
    Serializer for FAQ categories.
    """
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    created_by = serializers.StringRelatedField(read_only=True)
    updated_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = FAQCategory
        fields = [
            'id', 'name', 'slug', 'description', 'icon',
            'status', 'status_display', 'is_active', 'order',
            'created_at', 'updated_at', 'created_by', 'updated_by'
        ]
        read_only_fields = [
            'id', 'created_at', 'updated_at', 'created_by', 'updated_by'
        ]


class FAQSerializer(serializers.ModelSerializer):
    """
    Serializer for FAQs.
    """
    category = FAQCategorySerializer(read_only=True)
    category_id = serializers.UUIDField(write_only=True, required=False, allow_null=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    created_by = serializers.StringRelatedField(read_only=True)
    updated_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = FAQ
        fields = [
            'id', 'question', 'answer', 'category', 'category_id',
            'show_on_homepage', 'is_featured', 'status', 'status_display',
            'is_active', 'order', 'created_at', 'updated_at', 'created_by', 'updated_by'
        ]
        read_only_fields = [
            'id', 'created_at', 'updated_at', 'created_by', 'updated_by'
        ]


class FAQListSerializer(serializers.ModelSerializer):
    """
    Lightweight serializer for FAQ lists.
    """
    category = FAQCategorySerializer(read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = FAQ
        fields = [
            'id', 'question', 'category', 'show_on_homepage',
            'is_featured', 'status', 'status_display', 'is_active', 'order'
        ]
