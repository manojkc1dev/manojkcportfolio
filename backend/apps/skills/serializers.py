"""
Serializers for skills app.
"""
from rest_framework import serializers
from .models import Skill, SkillCategory


class SkillCategorySerializer(serializers.ModelSerializer):
    """
    Serializer for skill categories.
    """
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    created_by = serializers.StringRelatedField(read_only=True)
    updated_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = SkillCategory
        fields = [
            'id', 'name', 'slug', 'description', 'icon', 'color',
            'status', 'status_display', 'is_active', 'order',
            'created_at', 'updated_at', 'created_by', 'updated_by'
        ]
        read_only_fields = [
            'id', 'created_at', 'updated_at', 'created_by', 'updated_by'
        ]


class SkillSerializer(serializers.ModelSerializer):
    """
    Serializer for skills.
    """
    category = SkillCategorySerializer(read_only=True)
    category_id = serializers.UUIDField(write_only=True, required=False, allow_null=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    created_by = serializers.StringRelatedField(read_only=True)
    updated_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Skill
        fields = [
            'id', 'name', 'slug', 'category', 'category_id',
            'percentage', 'experience_years', 'icon', 'image',
            'priority', 'is_featured', 'show_on_homepage',
            'status', 'status_display', 'is_active', 'order',
            'created_at', 'updated_at', 'created_by', 'updated_by'
        ]
        read_only_fields = [
            'id', 'created_at', 'updated_at', 'created_by', 'updated_by'
        ]

    def validate_slug(self, value):
        """Validate slug is unique."""
        if self.instance:
            if Skill.objects.filter(slug=value).exclude(id=self.instance.id).exists():
                raise serializers.ValidationError('Skill with this slug already exists.')
        else:
            if Skill.objects.filter(slug=value).exists():
                raise serializers.ValidationError('Skill with this slug already exists.')
        return value


class SkillListSerializer(serializers.ModelSerializer):
    """
    Lightweight serializer for skill lists.
    """
    category = SkillCategorySerializer(read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Skill
        fields = [
            'id', 'name', 'slug', 'category', 'percentage',
            'experience_years', 'icon', 'priority', 'is_featured',
            'show_on_homepage', 'status', 'status_display', 'is_active', 'order'
        ]
