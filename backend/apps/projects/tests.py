"""
Tests for projects app.
"""
from django.test import TestCase
from django.contrib.auth import get_user_model
from .models import Project
from .selectors import ProjectSelector
from .services import ProjectService
from .validators import validate_project_slug, validate_project_visibility

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


class ProjectValidatorTest(TestCase):
    """Test Project validators."""
    
    def test_validate_project_slug(self):
        """Test validating project slug."""
        # Unique slug
        from django.core.exceptions import ValidationError
        validate_project_slug('unique-slug')
        
        # Duplicate slug
        from django.contrib.auth import get_user_model
        User = get_user_model()
        user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        Project.objects.create(
            title='Test',
            slug='test',
            created_by=user,
            updated_by=user
        )
        with self.assertRaises(ValidationError):
            validate_project_slug('test')
    
    def test_validate_project_visibility(self):
        """Test validating visibility."""
        # Valid visibility
        validate_project_visibility('public')
        
        # Invalid visibility
        from django.core.exceptions import ValidationError
        with self.assertRaises(ValidationError):
            validate_project_visibility('invalid')
