"""
Tests for accounts app.
"""
from django.test import TestCase
from django.contrib.auth import get_user_model
from apps.accounts.models import UserProfile, LoginLog

User = get_user_model()


class UserModelTestCase(TestCase):
    """Test User model methods."""
    
    def setUp(self):
        """Set up test data."""
        self.viewer = User.objects.create_user(
            username='viewer',
            email='viewer@example.com',
            password='testpass123',
            role='viewer'
        )
        self.admin = User.objects.create_user(
            username='admin',
            email='admin@example.com',
            password='testpass123',
            role='admin'
        )
        self.super_admin = User.objects.create_superuser(
            username='superadmin',
            email='superadmin@example.com',
            password='testpass123'
        )
        self.super_admin.role = 'super_admin'
        self.super_admin.save()
    
    def test_viewer_role(self):
        """Test viewer role permissions."""
        self.assertFalse(self.viewer.is_admin())
        self.assertFalse(self.viewer.is_content_manager())
        self.assertFalse(self.viewer.is_super_admin())
        self.assertEqual(self.viewer.role, 'viewer')
    
    def test_admin_role(self):
        """Test admin role permissions."""
        self.assertTrue(self.admin.is_admin())
        self.assertTrue(self.admin.is_content_manager())
        self.assertFalse(self.admin.is_super_admin())
        self.assertEqual(self.admin.role, 'admin')
    
    def test_super_admin_role(self):
        """Test super admin role permissions."""
        self.assertTrue(self.super_admin.is_admin())
        self.assertTrue(self.super_admin.is_content_manager())
        self.assertTrue(self.super_admin.is_super_admin())
        self.assertEqual(self.super_admin.role, 'super_admin')
    
    def test_get_full_name(self):
        """Test get_full_name method."""
        self.viewer.first_name = 'John'
        self.viewer.last_name = 'Doe'
        self.viewer.save()
        self.assertEqual(self.viewer.get_full_name(), 'John Doe')
    
    def test_failed_login_increment(self):
        """Test failed login increment."""
        initial_attempts = self.viewer.failed_login_attempts
        self.viewer.increment_failed_login()
        self.assertEqual(self.viewer.failed_login_attempts, initial_attempts + 1)
    
    def test_account_lock(self):
        """Test account locking after 5 failed attempts."""
        from django.utils import timezone
        for _ in range(5):
            self.viewer.increment_failed_login()
        self.assertTrue(self.viewer.is_locked())


class LoginLogTestCase(TestCase):
    """Test LoginLog model."""
    
    def setUp(self):
        """Set up test data."""
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123',
            role='viewer'
        )
    
    def test_login_log_creation(self):
        """Test that login log can be created."""
        initial_count = LoginLog.objects.count()
        LoginLog.objects.create(
            user=self.user,
            ip_address='127.0.0.1',
            user_agent='TestAgent',
            success=True
        )
        self.assertEqual(LoginLog.objects.count(), initial_count + 1)
    
    def test_login_log_str(self):
        """Test LoginLog string representation."""
        log = LoginLog.objects.create(
            user=self.user,
            ip_address='127.0.0.1',
            user_agent='TestAgent',
            success=True
        )
        self.assertIn(str(self.user), str(log))
