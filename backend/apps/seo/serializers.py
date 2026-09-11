"""
Serializers for SEO app.
"""
from rest_framework import serializers
from .models import SEOSettings


class SEOSettingsSerializer(serializers.ModelSerializer):
    """
    Serializer for SEO settings.
    """
    twitter_card_display = serializers.CharField(source='get_twitter_card_display', read_only=True)
    created_by = serializers.StringRelatedField(read_only=True)
    updated_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = SEOSettings
        fields = [
            'id', 'site_title', 'meta_description', 'meta_keywords',
            'og_image', 'og_title', 'og_description', 'twitter_card',
            'twitter_card_display', 'twitter_image', 'twitter_title',
            'twitter_description', 'canonical_url', 'robots_txt',
            'schema_org_type', 'schema_org_json', 'sitemap_enabled',
            'google_analytics_id', 'google_tag_manager_id',
            'created_at', 'updated_at', 'created_by', 'updated_by'
        ]
        read_only_fields = [
            'id', 'created_at', 'updated_at', 'created_by', 'updated_by'
        ]
