"""
Serializers for certifications app.
"""
from rest_framework import serializers
from .models import Certification


class CertificationSerializer(serializers.ModelSerializer):
    """
    Serializer for certifications.
    """
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    created_by = serializers.StringRelatedField(read_only=True)
    updated_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Certification
        fields = [
            'id', 'name', 'issuer', 'credential_id', 'issue_date',
            'expiry_date', 'does_not_expire', 'verification_url', 'is_verified',
            'description', 'skills', 'certificate_image', 'issuer_logo',
            'badge_url', 'certificate_url', 'show_on_homepage', 'is_featured',
            'status', 'status_display', 'is_active', 'order',
            'created_at', 'updated_at', 'created_by', 'updated_by'
        ]
        read_only_fields = [
            'id', 'created_at', 'updated_at', 'created_by', 'updated_by'
        ]


class CertificationListSerializer(serializers.ModelSerializer):
    """
    Lightweight serializer for certification lists.
    """
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Certification
        fields = [
            'id', 'name', 'issuer', 'credential_id', 'issue_date',
            'expiry_date', 'is_verified', 'show_on_homepage', 'is_featured',
            'status', 'status_display', 'is_active', 'order'
        ]
