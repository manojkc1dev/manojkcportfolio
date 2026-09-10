"""
Tests for contact app views.
"""
from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from unittest.mock import patch, MagicMock
from ..models import Contact

User = get_user_model()


class ContactReplyViewTest(TestCase):
    """Test ContactReplyView."""
    
    def setUp(self):
        """Set up test data."""
        self.client = APIClient()
        
        # Create users with different roles
        self.super_admin = User.objects.create_user(
            username='superadmin',
            email='superadmin@example.com',
            password='testpass123',
            role='super_admin'
        )
        self.admin = User.objects.create_user(
            username='admin',
            email='admin@example.com',
            password='testpass123',
            role='admin'
        )
        self.content_manager = User.objects.create_user(
            username='cm',
            email='cm@example.com',
            password='testpass123',
            role='content_manager'
        )
        self.viewer = User.objects.create_user(
            username='viewer',
            email='viewer@example.com',
            password='testpass123',
            role='viewer'
        )
        
        # Create a contact
        self.contact = Contact.objects.create(
            name='John Doe',
            email='john@example.com',
            subject='Test Subject',
            message='This is a test message'
        )
    
    def test_unauthenticated_user_cannot_reply(self):
        """Test that unauthenticated user cannot reply."""
        response = self.client.post(
            f'/api/v1/contact/{self.contact.id}/reply/',
            {'reply': 'Test reply'}
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_unauthorized_role_cannot_reply(self):
        """Test that viewer role cannot reply."""
        self.client.force_authenticate(user=self.viewer)
        response = self.client.post(
            f'/api/v1/contact/{self.contact.id}/reply/',
            {'reply': 'Test reply'}
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    def test_content_manager_can_reply(self):
        """Test that content manager can reply."""
        self.client.force_authenticate(user=self.content_manager)
        with patch('apps.contact.tasks.send_contact_reply_email.delay') as mock_task:
            mock_task.return_value = MagicMock(id='task-123')
            
            response = self.client.post(
                f'/api/v1/contact/{self.contact.id}/reply/',
                {'reply': 'Test reply message'}
            )
            
            self.assertEqual(response.status_code, status.HTTP_202_ACCEPTED)
            self.assertTrue(mock_task.called)
            mock_task.assert_called_once()
    
    def test_admin_can_reply(self):
        """Test that admin can reply."""
        self.client.force_authenticate(user=self.admin)
        with patch('apps.contact.tasks.send_contact_reply_email.delay') as mock_task:
            mock_task.return_value = MagicMock(id='task-123')
            
            response = self.client.post(
                f'/api/v1/contact/{self.contact.id}/reply/',
                {'reply': 'Test reply message'}
            )
            
            self.assertEqual(response.status_code, status.HTTP_202_ACCEPTED)
    
    def test_super_admin_can_reply(self):
        """Test that super admin can reply."""
        self.client.force_authenticate(user=self.super_admin)
        with patch('apps.contact.tasks.send_contact_reply_email.delay') as mock_task:
            mock_task.return_value = MagicMock(id='task-123')
            
            response = self.client.post(
                f'/api/v1/contact/{self.contact.id}/reply/',
                {'reply': 'Test reply message'}
            )
            
            self.assertEqual(response.status_code, status.HTTP_202_ACCEPTED)
    
    def test_empty_reply_rejected(self):
        """Test that empty reply is rejected."""
        self.client.force_authenticate(user=self.content_manager)
        response = self.client.post(
            f'/api/v1/contact/{self.contact.id}/reply/',
            {'reply': ''}
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_whitespace_only_reply_rejected(self):
        """Test that whitespace-only reply is rejected."""
        self.client.force_authenticate(user=self.content_manager)
        response = self.client.post(
            f'/api/v1/contact/{self.contact.id}/reply/',
            {'reply': '   '}
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_nonexistent_contact_returns_404(self):
        """Test that nonexistent contact returns 404."""
        self.client.force_authenticate(user=self.content_manager)
        fake_id = '00000000-0000-0000-0000-000000000000'
        response = self.client.post(
            f'/api/v1/contact/{fake_id}/reply/',
            {'reply': 'Test reply'}
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
    
    def test_reply_updates_contact_state(self):
        """Test that reply updates contact state correctly."""
        self.client.force_authenticate(user=self.content_manager)
        with patch('apps.contact.tasks.send_contact_reply_email.delay') as mock_task:
            mock_task.return_value = MagicMock(id='task-123')
            
            response = self.client.post(
                f'/api/v1/contact/{self.contact.id}/reply/',
                {'reply': 'Test reply message'}
            )
            
            self.assertEqual(response.status_code, status.HTTP_202_ACCEPTED)
            
            # Refresh contact from database
            self.contact.refresh_from_db()
            
            self.assertEqual(self.contact.reply, 'Test reply message')
            self.assertEqual(self.contact.replied_by, self.content_manager)
            self.assertEqual(self.contact.contact_status, 'in_progress')
            self.assertEqual(self.contact.reply_email_status, 'pending')
            self.assertIsNotNone(self.contact.replied_at)
    
    def test_reply_too_long_rejected(self):
        """Test that reply exceeding max length is rejected."""
        self.client.force_authenticate(user=self.content_manager)
        long_reply = 'a' * 5001
        response = self.client.post(
            f'/api/v1/contact/{self.contact.id}/reply/',
            {'reply': long_reply}
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_celery_task_is_queued(self):
        """Test that Celery task is queued with correct parameters."""
        self.client.force_authenticate(user=self.content_manager)
        with patch('apps.contact.tasks.send_contact_reply_email.delay') as mock_task:
            mock_task.return_value = MagicMock(id='task-123')
            
            response = self.client.post(
                f'/api/v1/contact/{self.contact.id}/reply/',
                {'reply': 'Test reply message'}
            )
            
            self.assertEqual(response.status_code, status.HTTP_202_ACCEPTED)
            mock_task.assert_called_once_with(str(self.contact.id), 'Test reply message')
    
    def test_response_includes_task_id(self):
        """Test that response includes Celery task ID."""
        self.client.force_authenticate(user=self.content_manager)
        with patch('apps.contact.tasks.send_contact_reply_email.delay') as mock_task:
            mock_task.return_value = MagicMock(id='task-123')
            
            response = self.client.post(
                f'/api/v1/contact/{self.contact.id}/reply/',
                {'reply': 'Test reply message'}
            )
            
            self.assertEqual(response.status_code, status.HTTP_202_ACCEPTED)
            data = response.json()
            self.assertIn('data', data)
            self.assertIn('task_id', data['data'])
            self.assertEqual(data['data']['task_id'], 'task-123')
    
    def test_rate_limiting_enforced(self):
        """Test that rate limiting is enforced on reply endpoint."""
        self.client.force_authenticate(user=self.content_manager)
        with patch('apps.contact.tasks.send_contact_reply_email.delay') as mock_task:
            mock_task.return_value = MagicMock(id='task-123')
            
            # Make 11 requests (exceeds 10/min limit)
            responses = []
            for i in range(11):
                response = self.client.post(
                    f'/api/v1/contact/{self.contact.id}/reply/',
                    {'reply': f'Test reply message {i}'}
                )
                responses.append(response.status_code)
            
            # First 10 should succeed, 11th should be rate limited
            success_count = sum(1 for status_code in responses if status_code == status.HTTP_202_ACCEPTED)
            throttled_count = sum(1 for status_code in responses if status_code == status.HTTP_429_TOO_MANY_REQUESTS)
            
            self.assertEqual(success_count, 10, "First 10 requests should succeed")
            self.assertEqual(throttled_count, 1, "11th request should be rate limited")
