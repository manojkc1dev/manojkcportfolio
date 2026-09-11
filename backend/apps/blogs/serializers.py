"""
Serializers for blogs app.
"""
from rest_framework import serializers
from .models import Blog, BlogCategory, BlogTag


class BlogCategorySerializer(serializers.ModelSerializer):
    """
    Serializer for blog categories.
    """
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    created_by = serializers.StringRelatedField(read_only=True)
    updated_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = BlogCategory
        fields = [
            'id', 'name', 'slug', 'description', 'icon', 'color',
            'status', 'status_display', 'is_active', 'order',
            'created_at', 'updated_at', 'created_by', 'updated_by'
        ]
        read_only_fields = [
            'id', 'created_at', 'updated_at', 'created_by', 'updated_by'
        ]


class BlogTagSerializer(serializers.ModelSerializer):
    """
    Serializer for blog tags.
    """
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    created_by = serializers.StringRelatedField(read_only=True)
    updated_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = BlogTag
        fields = [
            'id', 'name', 'slug', 'status', 'status_display',
            'is_active', 'created_at', 'updated_at', 'created_by', 'updated_by'
        ]
        read_only_fields = [
            'id', 'created_at', 'updated_at', 'created_by', 'updated_by'
        ]


class BlogSerializer(serializers.ModelSerializer):
    """
    Serializer for blog posts.
    """
    category = BlogCategorySerializer(read_only=True)
    category_id = serializers.UUIDField(write_only=True, required=False, allow_null=True)
    tags = BlogTagSerializer(many=True, read_only=True)
    tag_ids = serializers.ListField(
        child=serializers.UUIDField(),
        write_only=True,
        required=False,
        allow_empty=True
    )
    author = serializers.StringRelatedField(read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    created_by = serializers.StringRelatedField(read_only=True)
    updated_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Blog
        fields = [
            'id', 'title', 'slug', 'excerpt', 'content',
            'category', 'category_id', 'tags', 'tag_ids',
            'featured_image', 'author', 'reading_time',
            'published_at', 'scheduled_at', 'view_count',
            'like_count', 'comment_count', 'share_count',
            'is_featured', 'allow_comments', 'status', 'status_display',
            'is_active', 'order', 'meta_title', 'meta_description',
            'meta_keywords', 'og_image', 'canonical_url', 'no_index', 'no_follow',
            'created_at', 'updated_at', 'created_by', 'updated_by'
        ]
        read_only_fields = [
            'id', 'view_count', 'like_count', 'comment_count', 'share_count',
            'created_at', 'updated_at', 'created_by', 'updated_by'
        ]

    def validate_slug(self, value):
        """Validate slug is unique."""
        if self.instance:
            if Blog.objects.filter(slug=value).exclude(id=self.instance.id).exists():
                raise serializers.ValidationError('Blog with this slug already exists.')
        else:
            if Blog.objects.filter(slug=value).exists():
                raise serializers.ValidationError('Blog with this slug already exists.')
        return value

    def create(self, validated_data):
        """Create blog with tags."""
        tag_ids = validated_data.pop('tag_ids', [])
        blog = Blog.objects.create(**validated_data)
        if tag_ids:
            blog.tags.set(tag_ids)
        return blog

    def update(self, instance, validated_data):
        """Update blog with tags."""
        tag_ids = validated_data.pop('tag_ids', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if tag_ids is not None:
            instance.tags.set(tag_ids)
        return instance


class BlogListSerializer(serializers.ModelSerializer):
    """
    Lightweight serializer for blog lists.
    """
    category = BlogCategorySerializer(read_only=True)
    author = serializers.StringRelatedField(read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Blog
        fields = [
            'id', 'title', 'slug', 'excerpt', 'category',
            'featured_image', 'author', 'reading_time',
            'published_at', 'view_count', 'like_count',
            'is_featured', 'status', 'status_display', 'is_active', 'order'
        ]
