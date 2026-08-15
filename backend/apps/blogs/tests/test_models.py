"""
Tests for blogs app models.
"""
from django.test import TestCase
from django.contrib.auth import get_user_model
from ..models import Blog, BlogCategory, BlogTag

User = get_user_model()


class BlogModelTest(TestCase):
    """Test Blog model."""
    
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
            created_by=self.user,
            updated_by=self.user
        )
    
    def test_blog_creation(self):
        """Test blog creation."""
        self.assertEqual(self.blog.title, 'Test Blog')
        self.assertEqual(self.blog.slug, 'test-blog')
        self.assertEqual(self.blog.status, 'draft')
    
    def test_blog_str(self):
        """Test blog string representation."""
        self.assertEqual(str(self.blog), 'Test Blog')
    
    def test_increment_view_count(self):
        """Test incrementing view count."""
        initial_count = self.blog.view_count
        self.blog.increment_view_count()
        self.assertEqual(self.blog.view_count, initial_count + 1)
