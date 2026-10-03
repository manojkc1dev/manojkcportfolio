"""
Serializers for Engineering Articles, Technical Case Studies, and Topic Tags.
"""
from rest_framework import serializers
from .models import Article, ArticleTag


class ArticleTagSerializer(serializers.ModelSerializer):
    """Article topic tag serializer."""

    class Meta:
        model = ArticleTag
        fields = ('name', 'slug')


class ArticleListSerializer(serializers.ModelSerializer):
    """
    Compact article serializer for blog listings and search views.
    Omits large full markdown content for performance.
    """
    readingTime = serializers.IntegerField(source='read_time_minutes', read_only=True)
    headerImage = serializers.CharField(source='header_image', read_only=True)
    authorName = serializers.CharField(source='author_name', read_only=True)
    authorRole = serializers.CharField(source='author_role', read_only=True)
    publishedDate = serializers.DateField(source='published_date', read_only=True)
    tags = serializers.JSONField(source='tags_list', read_only=True)

    class Meta:
        model = Article
        fields = (
            'id',
            'slug',
            'title',
            'category',
            'date',
            'publishedDate',
            'featured',
            'excerpt',
            'headerImage',
            'authorName',
            'authorRole',
            'readingTime',
            'tags',
        )


class ArticleDetailSerializer(serializers.ModelSerializer):
    """
    Full article serializer including complete markdown content.
    """
    readingTime = serializers.IntegerField(source='read_time_minutes', read_only=True)
    headerImage = serializers.CharField(source='header_image', read_only=True)
    authorName = serializers.CharField(source='author_name', read_only=True)
    authorRole = serializers.CharField(source='author_role', read_only=True)
    publishedDate = serializers.DateField(source='published_date', read_only=True)
    tags = serializers.JSONField(source='tags_list', read_only=True)

    class Meta:
        model = Article
        fields = (
            'id',
            'slug',
            'title',
            'category',
            'date',
            'publishedDate',
            'featured',
            'excerpt',
            'content',
            'headerImage',
            'authorName',
            'authorRole',
            'readingTime',
            'tags',
        )
