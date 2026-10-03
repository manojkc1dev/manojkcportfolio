"""
Serializers for Inbound Client Inquiries and Public Contact Form Submissions.
"""
from rest_framework import serializers
from .models import Inquiry


class InquiryCreateSerializer(serializers.ModelSerializer):
    """
    Public serializer for contact form submissions with honeypot anti-spam defense,
    name/email sanitization, and project referral tagging.
    """
    projectId = serializers.CharField(
        source='project_id',
        required=False,
        allow_blank=True,
        allow_null=True
    )
    projectTitle = serializers.CharField(
        source='project_title',
        required=False,
        allow_blank=True
    )
    sourcePage = serializers.CharField(
        source='source_page',
        required=False,
        allow_blank=True
    )

    # Honeypot fields for anti-spam (must remain blank on legitimate human submission)
    hp_field = serializers.CharField(required=False, allow_blank=True, write_only=True)
    _hp = serializers.CharField(required=False, allow_blank=True, write_only=True)

    class Meta:
        model = Inquiry
        fields = (
            'name',
            'email',
            'message',
            'projectId',
            'projectTitle',
            'sourcePage',
            'hp_field',
            '_hp',
        )

    def validate_name(self, value):
        trimmed = value.strip()
        if not trimmed:
            raise serializers.ValidationError('Please enter your name.')
        return trimmed

    def validate_email(self, value):
        trimmed = value.strip()
        if not trimmed:
            raise serializers.ValidationError('Please enter your email address.')
        return trimmed

    def validate_message(self, value):
        trimmed = value.strip()
        if not trimmed:
            raise serializers.ValidationError('Please enter a message.')
        if len(trimmed) < 10:
            raise serializers.ValidationError('Message must be at least 10 characters long.')
        if len(trimmed) > 2000:
            raise serializers.ValidationError('Message must not exceed 2,000 characters.')
        return trimmed

    def validate(self, attrs):
        # Honeypot bot protection
        hp1 = attrs.pop('hp_field', '') or ''
        hp2 = attrs.pop('_hp', '') or ''
        if hp1.strip() or hp2.strip():
            raise serializers.ValidationError({'detail': 'Spam submission detected.'})

        return attrs

    def create(self, validated_data):
        # Derive scope title if tagged with project
        project_title = validated_data.get('project_title', '')
        if project_title and not validated_data.get('scope_title'):
            validated_data['scope_title'] = f"Inquiry regarding {project_title}"

        return super().create(validated_data)


class InquiryDetailSerializer(serializers.ModelSerializer):
    """Serializer for administrative inquiry inspection."""
    projectId = serializers.CharField(source='project_id', read_only=True)
    projectTitle = serializers.CharField(source='project_title', read_only=True)
    sourcePage = serializers.CharField(source='source_page', read_only=True)
    hasWhatsApp = serializers.BooleanField(source='has_whatsapp', read_only=True)
    scopeTitle = serializers.CharField(source='scope_title', read_only=True)
    budgetRange = serializers.CharField(source='budget_range', read_only=True)
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)

    class Meta:
        model = Inquiry
        fields = (
            'id',
            'name',
            'email',
            'company',
            'phone',
            'hasWhatsApp',
            'scopeTitle',
            'budgetRange',
            'timeline',
            'message',
            'status',
            'read',
            'replied',
            'projectId',
            'projectTitle',
            'sourcePage',
            'createdAt',
        )
