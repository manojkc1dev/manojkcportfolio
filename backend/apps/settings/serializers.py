"""
Serializers for settings app.
"""
from rest_framework import serializers
from .models import SiteSettings, HomepageSection


class SiteSettingsSerializer(serializers.ModelSerializer):
    """
    Serializer for site settings.
    """
    theme_display = serializers.CharField(source='get_default_theme_display', read_only=True)

    class Meta:
        model = SiteSettings
        fields = [
            'id', 'site_name', 'tagline', 'logo', 'favicon',
            'default_theme', 'theme_display', 'allow_theme_toggle',
            'email', 'phone', 'location', 'timezone',
            'github_url', 'linkedin_url', 'twitter_url', 'instagram_url', 'youtube_url',
            'footer_text', 'copyright_text', 'show_social_links',
            'meta_title', 'meta_description', 'meta_keywords',
            'google_analytics_id', 'posthog_api_key', 'posthog_host',
            'maintenance_mode', 'maintenance_message',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class HomepageSectionSerializer(serializers.ModelSerializer):
    """
    Serializer for homepage sections.
    """
    section_display = serializers.CharField(source='get_section_type_display', read_only=True)

    class Meta:
        model = HomepageSection
        fields = [
            'id', 'section_type', 'section_display', 'is_enabled',
            'order', 'custom_title', 'display_limit',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class PublicSettingsSerializer(serializers.ModelSerializer):
    """
    Public serializer for site settings (excludes sensitive data).
    """
    theme_display = serializers.CharField(source='get_default_theme_display', read_only=True)
    homepage_sections = serializers.SerializerMethodField()

    class Meta:
        model = SiteSettings
        fields = [
            'site_name', 'tagline', 'logo', 'favicon',
            'default_theme', 'theme_display', 'allow_theme_toggle',
            'email', 'phone', 'location', 'timezone',
            'github_url', 'linkedin_url', 'twitter_url', 'instagram_url', 'youtube_url',
            'footer_text', 'copyright_text', 'show_social_links',
            'meta_title', 'meta_description', 'meta_keywords',
            'maintenance_mode', 'maintenance_message',
            'homepage_sections'
        ]

    def get_homepage_sections(self, obj) -> list:
        """Get enabled homepage sections ordered correctly."""
        sections = HomepageSection.objects.filter(is_enabled=True).order_by('order')
        return HomepageSectionSerializer(sections, many=True).data
