"""
Tests for blogs app validators.
"""
from django.test import TestCase
from django.contrib.auth import get_user_model
from ..models import Blog
from ..validators import validate_blog_slug, validate_blog_content

User = get_user_model()


class BlogValidatorTest(TestCase):
    """Test Blog validators."""
    
    def test_validate_blog_slug(self):
        """Test validating blog slug."""
        # Unique slug
        validate_blog_slug('unique-slug')
        
        # Duplicate slug
        user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        Blog.objects.create(
            title='Test',
            slug='test',
            author=user,
            created_by=user,
            updated_by=user
        )
        from django.core.exceptions import ValidationError
        with self.assertRaises(ValidationError):
            validate_blog_slug('test')
    
    def test_validate_blog_content(self):
        """Test validating blog content."""
        # Missing title
        data = {'content': 'Some content'}
        from django.core.exceptions import ValidationError
        with self.assertRaises(ValidationError):
            validate_blog_content(data)
        
        # Valid content
        data = {'title': 'Test', 'content': 'Content'}
        result = validate_blog_content(data)
        self.assertEqual(result, data)
