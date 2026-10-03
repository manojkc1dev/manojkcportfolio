"""
Serializers for Work History, Internships, and Academic Milestones.
"""
from rest_framework import serializers
from .models import Experience


class ExperienceSerializer(serializers.ModelSerializer):
    """
    Public serializer for career history mapping snake_case fields to frontend camelCase.
    """
    companyUrl = serializers.URLField(source='company_url', read_only=True)

    class Meta:
        model = Experience
        fields = (
            'id',
            'role',
            'company',
            'companyUrl',
            'period',
            'start',
            'end',
            'location',
            'type',
            'description',
            'bullets',
            'tech',
            'order',
        )
