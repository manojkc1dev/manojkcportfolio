"""
Serializers for Site Profile, Stats, Socials, Uses Categories, and Currently Building Roadmap.
"""
from rest_framework import serializers
from .models import SiteProfile, ProfileStat, SocialLink, UseCategory, UseItem, CurrentItem


class ProfileStatSerializer(serializers.ModelSerializer):
    """Headline numerical achievement metric mapping snake_case to frontend camelCase."""
    id = serializers.CharField(source='stat_id', read_only=True)
    iconName = serializers.CharField(source='icon_name', read_only=True)

    class Meta:
        model = ProfileStat
        fields = ('id', 'label', 'value', 'subtext', 'iconName', 'order')


class SocialLinkSerializer(serializers.ModelSerializer):
    """External social media and platform profile link."""

    class Meta:
        model = SocialLink
        fields = ('name', 'url', 'icon', 'handle', 'visible', 'order')


class SiteProfileSerializer(serializers.ModelSerializer):
    """
    Main site owner identity, biography, and nested stats and social platforms.
    """
    resumeUrl = serializers.CharField(source='resume_url', read_only=True)
    heroBadge = serializers.CharField(source='hero_badge', read_only=True)
    heroTitle = serializers.CharField(source='hero_title', read_only=True)
    heroSubtitle = serializers.CharField(source='hero_subtitle', read_only=True)
    primaryCta = serializers.CharField(source='primary_cta', read_only=True)
    secondaryCta = serializers.CharField(source='secondary_cta', read_only=True)

    stats = ProfileStatSerializer(source='stats_items', many=True, read_only=True)
    socials = SocialLinkSerializer(source='socials_items', many=True, read_only=True)

    class Meta:
        model = SiteProfile
        fields = (
            'id',
            'name',
            'title',
            'tagline',
            'bio',
            'photo',
            'location',
            'email',
            'phone',
            'availability',
            'resumeUrl',
            'heroBadge',
            'heroTitle',
            'heroSubtitle',
            'primaryCta',
            'secondaryCta',
            'pillars',
            'stats',
            'socials',
        )


class UseItemSerializer(serializers.ModelSerializer):
    """Specific workstation, software tool, or hardware piece."""

    class Meta:
        model = UseItem
        fields = ('name', 'why', 'link', 'tag', 'order')


class UseCategorySerializer(serializers.ModelSerializer):
    """Workstation and workflow category grouping with nested items."""
    items = UseItemSerializer(many=True, read_only=True)

    class Meta:
        model = UseCategory
        fields = ('title', 'description', 'order', 'items')


class CurrentItemSerializer(serializers.ModelSerializer):
    """Active development roadmap item mapping snake_case to frontend camelCase."""
    relatedProjectId = serializers.CharField(source='related_project_id', read_only=True)

    class Meta:
        model = CurrentItem
        fields = (
            'id',
            'title',
            'description',
            'status',
            'progress',
            'relatedProjectId',
            'since',
            'order',
        )
