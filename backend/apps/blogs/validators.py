"""
Validators for blogs app.
"""
from django.core.exceptions import ValidationError
from .models import Blog


def validate_blog_slug(slug, instance=None):
    """Validate blog slug is unique."""
    queryset = Blog.objects.filter(slug=slug)
    if instance:
        queryset = queryset.exclude(id=instance.id)
    
    if queryset.exists():
        raise ValidationError('Blog with this slug already exists.')


def validate_blog_content(data):
    """Validate blog has required content."""
    if not data.get('title'):
        raise ValidationError('Title is required.')
    if not data.get('content'):
        raise ValidationError('Content is required.')
    return data


def validate_blog_publishing(data):
    """Validate publishing requirements."""
    if data.get('status') == 'published' and not data.get('published_at'):
        from django.utils import timezone
        data['published_at'] = timezone.now()
    return data


def validate_reading_time(content):
    """Calculate and validate reading time."""
    if content:
        words_per_minute = 200
        word_count = len(content.split())
        reading_time = max(1, word_count // words_per_minute)
        return reading_time
    return 1
