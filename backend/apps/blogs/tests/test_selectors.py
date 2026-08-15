"""
Tests for blogs app selectors.
"""
from django.test import TestCase
from django.contrib.auth import get_user_model
from ..models import Blog, BlogCategory
from ..selectors import BlogSelector

User = get_user_model()


class BlogSelectorTest(TestCase):
    """Test Blog selector."""
    
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
        self.blog = Blog.objects.create(
            title='Test Blog',
            slug='test-blog',
            excerpt='A test blog',
            content='Detailed content',
            category=self.category,
            author=self.user,
            status='published',
            is_active=True,
            created_by=self.user,
            updated_by=self.user
        )
    
    def test_get_published_blogs(self):
        """Test getting published blogs."""
        blogs = BlogSelector.get_published_blogs()
        self.assertEqual(blogs.count(), 1)
    
    def test_get_featured_blogs(self):
        """Test getting featured blogs."""
        self.blog.is_featured = True
        self.blog.save()
        blogs = BlogSelector.get_featured_blogs(limit=3)
        self.assertEqual(blogs.count(), 1)
    
    def test_get_blog_by_slug(self):
        """Test getting blog by slug."""
        blog = BlogSelector.get_blog_by_slug('test-blog')
        self.assertEqual(blog.id, self.blog.id)
    
    def test_search_blogs(self):
        """Test searching blogs."""
        blogs = BlogSelector.search_blogs('test')
        self.assertEqual(blogs.count(), 1)
