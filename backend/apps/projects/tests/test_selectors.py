"""
Tests for projects app selectors.
"""
from django.test import TestCase
from django.contrib.auth import get_user_model
from ..models import Project
from ..selectors import ProjectSelector

User = get_user_model()


class ProjectSelectorTest(TestCase):
    """Test Project selector."""
    
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
            status='published',
            is_active=True,
            visibility='public',
            created_by=self.user,
            updated_by=self.user
        )
    
    def test_get_published_projects(self):
        """Test getting published projects."""
        projects = ProjectSelector.get_published_projects()
        self.assertEqual(projects.count(), 1)
    
    def test_get_featured_projects(self):
        """Test getting featured projects."""
        self.project.is_featured = True
        self.project.save()
        projects = ProjectSelector.get_featured_projects(limit=6)
        self.assertEqual(projects.count(), 1)
    
    def test_get_project_by_slug(self):
        """Test getting project by slug."""
        project = ProjectSelector.get_project_by_slug('test-project')
        self.assertEqual(project.id, self.project.id)
    
    def test_search_projects(self):
        """Test searching projects."""
        projects = ProjectSelector.search_projects('test')
        self.assertEqual(projects.count(), 1)
