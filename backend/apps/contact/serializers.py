"""
Serializers for contact app.
"""
from rest_framework import serializers
from .models import Contact


class ContactSerializer(serializers.ModelSerializer):
    """
    Serializer for contact form submissions.
    """
    contact_status_display = serializers.CharField(source='get_contact_status_display', read_only=True)
    replied_by = serializers.StringRelatedField(read_only=True)
    created_by = serializers.StringRelatedField(read_only=True)
    updated_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Contact
        fields = [
            'id', 'name', 'email', 'phone', 'subject', 'message',
            'ip_address', 'country', 'browser', 'device', 'user_agent',
            'contact_status', 'contact_status_display', 'reply',
            'replied_at', 'replied_by', 'is_starred', 'is_spam', 'spam_score',
            'status', 'is_active', 'created_at', 'updated_at', 'created_by', 'updated_by'
        ]
        read_only_fields = [
            'id', 'ip_address', 'country', 'browser', 'device',
            'user_agent', 'spam_score', 'created_at', 'updated_at',
            'created_by', 'updated_by'
        ]


class ContactListSerializer(serializers.ModelSerializer):
    """
    Lightweight serializer for contact lists.
    """
    contact_status_display = serializers.CharField(source='get_contact_status_display', read_only=True)

    class Meta:
        model = Contact
        fields = [
            'id', 'name', 'email', 'subject', 'contact_status',
            'contact_status_display', 'is_starred', 'is_spam', 'created_at'
        ]
