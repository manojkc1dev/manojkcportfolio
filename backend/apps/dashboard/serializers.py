"""
Serializers for dashboard app.
"""
from rest_framework import serializers
from .models import DashboardStats


class DashboardAnalyticsSerializer(serializers.Serializer):
    """Serializer for dashboard analytics response."""
    
    # Overview metrics
    total_projects = serializers.IntegerField()
    published_projects = serializers.IntegerField()
    draft_projects = serializers.IntegerField()
    total_visitors = serializers.IntegerField()
    unique_visitors = serializers.IntegerField()
    total_contacts = serializers.IntegerField()
    new_contacts = serializers.IntegerField()
    replied_contacts = serializers.IntegerField()
    total_subscribers = serializers.IntegerField()
    verified_subscribers = serializers.IntegerField()
    total_blogs = serializers.IntegerField()
    published_blogs = serializers.IntegerField()
    total_skills = serializers.IntegerField()
    total_certifications = serializers.IntegerField()
    
    # Geographic data
    visitor_countries = serializers.ListField(child=serializers.DictField())
    
    # Recent activity
    recent_contacts = serializers.ListField(child=serializers.DictField())
    recent_projects = serializers.ListField(child=serializers.DictField())
    recent_blogs = serializers.ListField(child=serializers.DictField())


class DashboardStatsSerializer(serializers.ModelSerializer):
    """Serializer for DashboardStats model."""
    
    class Meta:
        model = DashboardStats
        fields = [
            'id', 'stats_date',
            'total_projects', 'published_projects', 'draft_projects',
            'total_visitors', 'unique_visitors',
            'total_contacts', 'pending_contacts',
            'total_downloads', 'resume_downloads',
            'total_blogs', 'published_blogs',
            'total_skills', 'total_certifications',
            'total_subscribers', 'active_subscribers',
            'created_at', 'updated_at'
        ]
        read_only_fields = fields
