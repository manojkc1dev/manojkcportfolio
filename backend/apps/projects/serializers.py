"""
Serializers for projects app.
"""
from rest_framework import serializers
from .models import Project
from apps.project_categories.serializers import ProjectCategorySerializer


class ProjectSerializer(serializers.ModelSerializer):
    """
    Serializer for projects.
    """
    category = ProjectCategorySerializer(read_only=True)
    category_id = serializers.UUIDField(write_only=True, required=False, allow_null=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    visibility_display = serializers.CharField(source='get_visibility_display', read_only=True)
    created_by = serializers.StringRelatedField(read_only=True)
    updated_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Project
        fields = [
            'id', 'title', 'slug', 'category', 'category_id',
            'thumbnail', 'cover_image', 'short_description', 'description',
            'problem', 'solution', 'architecture', 'role', 'client',
            'company', 'duration', 'team_size', 'responsibilities',
            'programming_language', 'framework', 'database', 'api',
            'authentication', 'deployment', 'github_url', 'live_demo_url',
            'documentation_url', 'figma_url', 'case_study_url',
            'visibility', 'visibility_display', 'is_featured', 'is_pinned',
            'challenges', 'future_improvements', 'view_count', 'like_count',
            'share_count', 'status', 'status_display', 'is_active',
            'order', 'meta_title', 'meta_description', 'meta_keywords',
            'og_image', 'canonical_url', 'no_index', 'no_follow',
            'created_at', 'updated_at', 'created_by', 'updated_by'
        ]
        read_only_fields = [
            'id', 'view_count', 'like_count', 'share_count',
            'created_at', 'updated_at', 'created_by', 'updated_by'
        ]

    def validate_slug(self, value):
        """Validate slug is unique."""
        if self.instance:
            if Project.objects.filter(slug=value).exclude(id=self.instance.id).exists():
                raise serializers.ValidationError('Project with this slug already exists.')
        else:
            if Project.objects.filter(slug=value).exists():
                raise serializers.ValidationError('Project with this slug already exists.')
        return value


class ProjectListSerializer(serializers.ModelSerializer):
    """
    Lightweight serializer for project lists.
    """
    category = ProjectCategorySerializer(read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Project
        fields = [
            'id', 'title', 'slug', 'category', 'thumbnail',
            'short_description', 'visibility', 'is_featured',
            'is_pinned', 'view_count', 'like_count', 'share_count',
            'status', 'status_display', 'is_active', 'order', 'created_at'
        ]
