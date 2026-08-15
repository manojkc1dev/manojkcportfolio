"""
Serializers for newsletter app.
"""
from rest_framework import serializers
from .models import Newsletter


class NewsletterSerializer(serializers.ModelSerializer):
    """
    Serializer for newsletter subscriptions.
    """
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    created_by = serializers.StringRelatedField(read_only=True)
    updated_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Newsletter
        fields = [
            'id', 'email', 'name', 'is_subscribed', 'is_verified',
            'verification_token', 'verified_at', 'unsubscribed_at',
            'unsubscribe_reason', 'source', 'status', 'status_display',
            'is_active', 'created_at', 'updated_at', 'created_by', 'updated_by'
        ]
        read_only_fields = [
            'id', 'verification_token', 'verified_at', 'unsubscribed_at',
            'created_at', 'updated_at', 'created_by', 'updated_by'
        ]


class NewsletterListSerializer(serializers.ModelSerializer):
    """
    Lightweight serializer for newsletter lists.
    """
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Newsletter
        fields = [
            'id', 'email', 'name', 'is_subscribed', 'is_verified',
            'source', 'status', 'status_display', 'is_active', 'created_at'
        ]
