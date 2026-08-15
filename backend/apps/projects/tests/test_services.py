"""
Tests for projects app services.
"""
from django.test import TestCase
from django.contrib.auth import get_user_model
from ..models import Project
from ..services import ProjectService

User = get_user_model()


class ProjectServiceTest(TestCase):
    """Test Project service."""
    
    def setUp(self):
        """Set up test data."""
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
    
    def test_create_project(self):
        """Test creating a project."""
        data = {
            'title': 'New Project',
            'slug': 'new-project',
            'short_description': 'A new project'
        }
        project = ProjectService.create_project(data, self.user)
        self.assertEqual(project.title, 'New Project')
        self.assertEqual(project.created_by, self.user)
    
    def test_update_project(self):
        """Test updating a project."""
        project = Project.objects.create(
            title='Test Project',
            slug='test-project',
            created_by=self.user,
            updated_by=self.user
        )
        data = {'title': 'Updated Project'}
        updated_project = ProjectService.update_project(project.id, data, self.user)
        self.assertEqual(updated_project.title, 'Updated Project')
    
    def test_delete_project(self):
        """Test deleting a project."""
        project = Project.objects.create(
            title='Test Project',
            slug='test-project',
            created_by=self.user,
            updated_by=self.user
        )
        result = ProjectService.delete_project(project.id)
        self.assertTrue(result)
        self.assertFalse(Project.objects.filter(id=project.id).exists())
    
    def test_publish_project(self):
        """Test publishing a project."""
        project = Project.objects.create(
            title='Test Project',
            slug='test-project',
            status='draft',
            created_by=self.user,
            updated_by=self.user
        )
        published_project = ProjectService.publish_project(project.id, self.user)
        self.assertEqual(published_project.status, 'published')
    
    def test_toggle_featured(self):
        """Test toggling featured status."""
        project = Project.objects.create(
            title='Test Project',
            slug='test-project',
            is_featured=False,
            created_by=self.user,
            updated_by=self.user
        )
        featured_project = ProjectService.toggle_featured(project.id, self.user)
        self.assertTrue(featured_project.is_featured)
