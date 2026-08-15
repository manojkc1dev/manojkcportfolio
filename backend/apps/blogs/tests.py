"""
Tests for blogs app.
"""
from django.test import TestCase
from django.contrib.auth import get_user_model
from .models import Blog, BlogCategory, BlogTag
from .selectors import BlogSelector, BlogCategorySelector, BlogTagSelector
from .services import BlogService
from .validators import validate_blog_slug, validate_blog_content

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


class BlogValidatorTest(TestCase):
    """Test Blog validators."""
    
    def test_validate_blog_slug(self):
        """Test validating blog slug."""
        # Unique slug
        validate_blog_slug('unique-slug')
        
        # Duplicate slug
        from django.contrib.auth import get_user_model
        User = get_user_model()
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
