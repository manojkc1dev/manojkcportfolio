"""
Tests for blogs app services.
"""
from django.test import TestCase
from django.contrib.auth import get_user_model
from ..models import Blog, BlogCategory, BlogTag
from ..services import BlogService

User = get_user_model()


class BlogServiceTest(TestCase):
    """Test Blog service."""
    
    def setUp(self):
        """Set up test data."""
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.category = BlogCategory.objects.create(
            name='Technology',
            slug='technology',
            created_by=self.user,
            updated_by=self.user
        )
    
    def test_create_blog(self):
        """Test creating a blog."""
        data = {
            'title': 'New Blog',
            'slug': 'new-blog',
            'excerpt': 'A new blog',
            'content': 'Detailed content',
            'category': self.category
        }
        blog = BlogService.create_blog(data, self.user)
        self.assertEqual(blog.title, 'New Blog')
        self.assertEqual(blog.author, self.user)
    
    def test_create_blog_with_tags(self):
        """Test creating a blog with tags."""
        tag = BlogTag.objects.create(
            name='Python',
            slug='python',
            created_by=self.user,
            updated_by=self.user
        )
        data = {
            'title': 'New Blog',
            'slug': 'new-blog',
            'excerpt': 'A new blog',
            'content': 'Detailed content',
            'category': self.category
        }
        blog = BlogService.create_blog(data, self.user, tag_ids=[tag.id])
        self.assertEqual(blog.tags.count(), 1)
    
    def test_publish_blog(self):
        """Test publishing a blog."""
        blog = Blog.objects.create(
            title='Test Blog',
            slug='test-blog',
            category=self.category,
            author=self.user,
            status='draft',
            created_by=self.user,
            updated_by=self.user
        )
        published_blog = BlogService.publish_blog(blog.id, self.user)
        self.assertEqual(published_blog.status, 'published')
