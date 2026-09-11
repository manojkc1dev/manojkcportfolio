"""
Common serializers for Portfolio CMS.
"""
from rest_framework import serializers
from .models import BaseModel, AuditLog


class BaseModelSerializer(serializers.ModelSerializer):
    """
    Base serializer with common fields.
    """
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)
    created_by = serializers.StringRelatedField(read_only=True)
    updated_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = BaseModel
        abstract = True


class AuditLogSerializer(serializers.ModelSerializer):
    """
    Serializer for audit logs.
    """
    user = serializers.StringRelatedField(read_only=True)
    action_display = serializers.CharField(source='get_action_display', read_only=True)

    class Meta:
        model = AuditLog
        fields = [
            'id', 'user', 'action', 'action_display', 'model_name',
            'object_id', 'object_repr', 'changes', 'ip_address',
            'user_agent', 'request_method', 'request_path',
            'extra_data', 'created_at'
        ]
        read_only_fields = fields
