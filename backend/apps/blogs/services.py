"""
Services for blogs app.
"""
from django.db import transaction
from .models import Blog
from .selectors import BlogSelector


class BlogService:
    """
    Service for Blog business logic.
    """
    
    @staticmethod
    @transaction.atomic
    def create_blog(data, user, tag_ids=None):
        """Create a new blog."""
        blog = Blog.objects.create(
            author=user,
            created_by=user,
            updated_by=user,
            **data
        )
        if tag_ids:
            blog.tags.set(tag_ids)
        return blog
    
    @staticmethod
    @transaction.atomic
    def update_blog(blog_id, data, user, tag_ids=None):
        """Update an existing blog."""
        blog = Blog.objects.filter(id=blog_id).first()
        if not blog:
            return None
        
        for attr, value in data.items():
            setattr(blog, attr, value)
        blog.updated_by = user
        blog.save()
        
        if tag_ids is not None:
            blog.tags.set(tag_ids)
        
        return blog
    
    @staticmethod
    @transaction.atomic
    def delete_blog(blog_id):
        """Delete a blog."""
        blog = Blog.objects.filter(id=blog_id).first()
        if not blog:
            return False
        
        blog.delete()
        return True
    
    @staticmethod
    def increment_view_count(blog):
        """Increment blog view count."""
        blog.view_count += 1
        blog.save(update_fields=['view_count'])
        return blog
    
    @staticmethod
    def increment_like_count(blog):
        """Increment blog like count."""
        blog.like_count += 1
        blog.save(update_fields=['like_count'])
        return blog
    
    @staticmethod
    def increment_share_count(blog):
        """Increment blog share count."""
        blog.share_count += 1
        blog.save(update_fields=['share_count'])
        return blog
    
    @staticmethod
    def publish_blog(blog_id, user):
        """Publish a blog."""
        blog = Blog.objects.filter(id=blog_id).first()
        if not blog:
            return None
        
        blog.status = 'published'
        blog.updated_by = user
        blog.save()
        return blog
    
    @staticmethod
    def toggle_featured(blog_id, user):
        """Toggle featured status."""
        blog = Blog.objects.filter(id=blog_id).first()
        if not blog:
            return None
        
        blog.is_featured = not blog.is_featured
        blog.updated_by = user
        blog.save()
        return blog
