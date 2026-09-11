"""
Tests for projects app models.
"""
from django.test import TestCase
from django.contrib.auth import get_user_model
from ..models import Project

User = get_user_model()


class ProjectModelTest(TestCase):
    """Test Project model."""
    
    def setUp(self):
        """Set up test data."""
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.project = Project.objects.create(
            title='Test Project',
            slug='test-project',
            short_description='A test project',
            description='Detailed description',
            created_by=self.user,
            updated_by=self.user
        )
    
    def test_project_creation(self):
        """Test project creation."""
        self.assertEqual(self.project.title, 'Test Project')
        self.assertEqual(self.project.slug, 'test-project')
        self.assertEqual(self.project.status, 'draft')
    
    def test_project_str(self):
        """Test project string representation."""
        self.assertEqual(str(self.project), 'Test Project')
    
    def test_increment_view_count(self):
        """Test incrementing view count."""
        initial_count = self.project.view_count
        self.project.increment_view_count()
        self.assertEqual(self.project.view_count, initial_count + 1)
