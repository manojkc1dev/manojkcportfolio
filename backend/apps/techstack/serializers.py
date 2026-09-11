"""
Serializers for techstack app.
"""
from rest_framework import serializers
from .models import TechStackItem, TechStackCategory


class TechStackCategorySerializer(serializers.ModelSerializer):
    """
    Serializer for tech stack categories.
    """
    category_type_display = serializers.CharField(source='get_category_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    created_by = serializers.StringRelatedField(read_only=True)
    updated_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = TechStackCategory
        fields = [
            'id', 'name', 'slug', 'category_type', 'category_type_display',
            'description', 'icon', 'color', 'status', 'status_display',
            'is_active', 'order', 'created_at', 'updated_at', 'created_by', 'updated_by'
        ]
        read_only_fields = [
            'id', 'created_at', 'updated_at', 'created_by', 'updated_by'
        ]


class TechStackItemSerializer(serializers.ModelSerializer):
    """
    Serializer for tech stack items.
    """
    category = TechStackCategorySerializer(read_only=True)
    category_id = serializers.UUIDField(write_only=True, required=False, allow_null=True)
    skill_level_display = serializers.CharField(source='get_skill_level_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    created_by = serializers.StringRelatedField(read_only=True)
    updated_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = TechStackItem
        fields = [
            'id', 'name', 'slug', 'category', 'category_id',
            'icon', 'svg', 'image', 'color', 'official_website',
            'documentation_url', 'skill_level', 'skill_level_display',
            'experience_years', 'display_order', 'is_featured',
            'show_on_homepage', 'status', 'status_display', 'is_active', 'order',
            'created_at', 'updated_at', 'created_by', 'updated_by'
        ]
        read_only_fields = [
            'id', 'created_at', 'updated_at', 'created_by', 'updated_by'
        ]

    def validate_slug(self, value):
        """Validate slug is unique."""
        if self.instance:
            if TechStackItem.objects.filter(slug=value).exclude(id=self.instance.id).exists():
                raise serializers.ValidationError('Tech stack item with this slug already exists.')
        else:
            if TechStackItem.objects.filter(slug=value).exists():
                raise serializers.ValidationError('Tech stack item with this slug already exists.')
        return value


class TechStackItemListSerializer(serializers.ModelSerializer):
    """
    Lightweight serializer for tech stack item lists.
    """
    category = TechStackCategorySerializer(read_only=True)
    skill_level_display = serializers.CharField(source='get_skill_level_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = TechStackItem
        fields = [
            'id', 'name', 'slug', 'category', 'icon', 'color',
            'skill_level', 'skill_level_display', 'experience_years',
            'display_order', 'is_featured', 'show_on_homepage',
            'status', 'status_display', 'is_active', 'order'
        ]
