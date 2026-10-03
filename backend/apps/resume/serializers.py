"""
Serializers for Resume Data Records and Resume Document Metadata.
"""
from rest_framework import serializers
from .models import ResumeDataRecord, ResumeDocument


class ResumeDataRecordSerializer(serializers.ModelSerializer):
    """
    Public serializer for ATS Resume Studio state, sections, and customizer configuration.
    """
    versionTag = serializers.CharField(source='version_tag', read_only=True)
    targetHeadline = serializers.CharField(source='target_headline', read_only=True)
    summaryText = serializers.CharField(source='summary_text', read_only=True)
    resumeUrl = serializers.CharField(source='resume_url', read_only=True)
    fileName = serializers.CharField(source='file_name', read_only=True)
    sectionsData = serializers.JSONField(source='sections_data', read_only=True)
    isActive = serializers.BooleanField(source='is_active', read_only=True)
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)
    updatedAt = serializers.DateTimeField(source='updated_at', read_only=True)

    class Meta:
        model = ResumeDataRecord
        fields = (
            'id',
            'versionTag',
            'targetHeadline',
            'summaryText',
            'resumeUrl',
            'fileName',
            'customization',
            'sectionsData',
            'isActive',
            'createdAt',
            'updatedAt',
        )


class ResumeDocumentMetadataSerializer(serializers.ModelSerializer):
    """Metadata serializer for binary PDF resume documents."""
    fileName = serializers.CharField(source='file_name', read_only=True)
    mimeType = serializers.CharField(source='mime_type', read_only=True)
    fileSize = serializers.IntegerField(source='file_size', read_only=True)
    versionTag = serializers.CharField(source='version_tag', read_only=True)
    isActive = serializers.BooleanField(source='is_active', read_only=True)
    uploadedAt = serializers.DateTimeField(source='uploaded_at', read_only=True)

    class Meta:
        model = ResumeDocument
        fields = (
            'id',
            'fileName',
            'mimeType',
            'fileSize',
            'versionTag',
            'isActive',
            'uploadedAt',
        )
