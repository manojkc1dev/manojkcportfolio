"""
Tests for authentication flows: email verification, forgot password, password reset.
"""
from django.test import TestCase, override_settings
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta
from unittest.mock import patch, MagicMock
from rest_framework.test import APIClient
from rest_framework import status
from rest_framework.settings import api_settings
from apps.accounts.models import UserProfile

User = get_user_model()


class EmailVerificationTestCase(TestCase):
    """Test email verification flow."""
    
    def setUp(self):
        """Set up test data."""
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123',
            first_name='John',
            last_name='Doe'
        )
    
    @override_settings(REST_FRAMEWORK={'DEFAULT_THROTTLE_CLASSES': []})
    @patch('apps.accounts.tasks.send_verification_email.delay')
    def test_registration_creates_unverified_user(self, mock_send_verification):
        """Test that registration creates unverified user and queues verification email."""
        response = self.client.post('/api/v1/auth/auth/register/', {
            'username': 'newuser',
            'email': 'new@example.com',
            'password': 'TestPass123!',
            'password_confirm': 'TestPass123!',
            'first_name': 'Jane',
            'last_name': 'Smith'
        })
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(mock_send_verification.called)
        
        new_user = User.objects.get(email='new@example.com')
        self.assertFalse(new_user.is_verified)
    
    def test_generate_verification_token(self):
        """Test verification token generation."""
        token = self.user.generate_verification_token()
        
        self.assertIsNotNone(token)
        self.assertIsNotNone(self.user.verification_token)
        self.assertIsNotNone(self.user.verification_token_expires_at)
        self.assertEqual(token, self.user.verification_token)
    
    def test_verification_token_validity(self):
        """Test verification token validity check."""
        token = self.user.generate_verification_token()
        
        # Valid token
        self.assertTrue(self.user.is_verification_token_valid(token))
        
        # Invalid token
        self.assertFalse(self.user.is_verification_token_valid('invalid_token'))
        
        # Expired token
        self.user.verification_token_expires_at = timezone.now() - timedelta(hours=1)
        self.user.save()
        self.assertFalse(self.user.is_verification_token_valid(token))
    
    @override_settings(REST_FRAMEWORK={'DEFAULT_THROTTLE_CLASSES': []})
    def test_verify_email_with_valid_token(self):
        """Test email verification with valid token."""
        token = self.user.generate_verification_token()
        
        response = self.client.post('/api/v1/auth/auth/verify-email/', {'token': token})
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertTrue(self.user.is_verified)
        self.assertIsNone(self.user.verification_token)
    
    @override_settings(REST_FRAMEWORK={'DEFAULT_THROTTLE_CLASSES': []})
    def test_verify_email_with_invalid_token(self):
        """Test email verification with invalid token."""
        response = self.client.post('/api/v1/auth/auth/verify-email/', {'token': 'invalid_token'})
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)
    
    @override_settings(REST_FRAMEWORK={'DEFAULT_THROTTLE_CLASSES': []})
    def test_verify_email_with_expired_token(self):
        """Test email verification with expired token."""
        token = self.user.generate_verification_token()
        self.user.verification_token_expires_at = timezone.now() - timedelta(hours=1)
        self.user.save()
        
        response = self.client.post('/api/v1/auth/auth/verify-email/', {'token': token})
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)
    
    @override_settings(REST_FRAMEWORK={'DEFAULT_THROTTLE_CLASSES': []})
    def test_verify_already_verified_email(self):
        """Test verifying an already verified email."""
        self.user.is_verified = True
        self.user.save()
        token = self.user.generate_verification_token()
        
        response = self.client.post('/api/v1/auth/auth/verify-email/', {'token': token})
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('already verified', response.data['message'].lower())
    
    @override_settings(REST_FRAMEWORK={'DEFAULT_THROTTLE_CLASSES': []})
    @patch('apps.accounts.tasks.send_verification_email.delay')
    def test_resend_verification_email(self, mock_send_verification):
        """Test resending verification email."""
        response = self.client.post('/api/v1/auth/auth/resend-verification/', {
            'email': self.user.email
        })
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(mock_send_verification.called)
    
    @override_settings(REST_FRAMEWORK={'DEFAULT_THROTTLE_CLASSES': []})
    @patch('apps.accounts.tasks.send_verification_email.delay')
    def test_resend_verification_already_verified(self, mock_send_verification):
        """Test resending verification for already verified user."""
        self.user.is_verified = True
        self.user.save()
        
        response = self.client.post('/api/v1/auth/auth/resend-verification/', {
            'email': self.user.email
        })
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(mock_send_verification.called)
        self.assertIn('already verified', response.data['message'].lower())
    
    @override_settings(REST_FRAMEWORK={'DEFAULT_THROTTLE_CLASSES': []})
    @patch('apps.accounts.tasks.send_verification_email.delay')
    def test_resend_verification_nonexistent_email(self, mock_send_verification):
        """Test resending verification for nonexistent email (no user enumeration)."""
        response = self.client.post('/api/v1/auth/auth/resend-verification/', {
            'email': 'nonexistent@example.com'
        })
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(mock_send_verification.called)
        # Generic response to prevent user enumeration
        self.assertIn('if an account exists', response.data['message'].lower())


class ForgotPasswordTestCase(TestCase):
    """Test forgot password flow."""
    
    def setUp(self):
        """Set up test data."""
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
    
    @override_settings(REST_FRAMEWORK={'DEFAULT_THROTTLE_CLASSES': []})
    @patch('apps.accounts.tasks.send_password_reset_email.delay')
    def test_forgot_password_existing_email(self, mock_send_reset):
        """Test forgot password with existing email."""
        response = self.client.post('/api/v1/auth/auth/forgot-password/', {
            'email': self.user.email
        })
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(mock_send_reset.called)
    
    @override_settings(REST_FRAMEWORK={'DEFAULT_THROTTLE_CLASSES': []})
    @patch('apps.accounts.tasks.send_password_reset_email.delay')
    def test_forgot_password_nonexistent_email(self, mock_send_reset):
        """Test forgot password with nonexistent email (no user enumeration)."""
        response = self.client.post('/api/v1/auth/auth/forgot-password/', {
            'email': 'nonexistent@example.com'
        })
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(mock_send_reset.called)
        # Generic response to prevent user enumeration
        self.assertIn('if an account exists', response.data['message'].lower())
    
    def test_generate_password_reset_token(self):
        """Test password reset token generation."""
        token = self.user.generate_password_reset_token()
        
        self.assertIsNotNone(token)
        self.assertIsNotNone(self.user.password_reset_token)
        self.assertIsNotNone(self.user.password_reset_token_expires_at)
        self.assertEqual(token, self.user.password_reset_token)
    
    def test_password_reset_token_validity(self):
        """Test password reset token validity check."""
        token = self.user.generate_password_reset_token()
        
        # Valid token
        self.assertTrue(self.user.is_password_reset_token_valid(token))
        
        # Invalid token
        self.assertFalse(self.user.is_password_reset_token_valid('invalid_token'))
        
        # Expired token
        self.user.password_reset_token_expires_at = timezone.now() - timedelta(hours=1)
        self.user.save()
        self.assertFalse(self.user.is_password_reset_token_valid(token))


class ResetPasswordTestCase(TestCase):
    """Test password reset confirmation flow."""
    
    def setUp(self):
        """Set up test data."""
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='oldpass123'
        )
    
    @override_settings(REST_FRAMEWORK={'DEFAULT_THROTTLE_CLASSES': []})
    def test_reset_password_with_valid_token(self):
        """Test password reset with valid token."""
        token = self.user.generate_password_reset_token()
        
        response = self.client.post('/api/v1/auth/auth/reset-password/', {
            'token': token,
            'new_password': 'NewSecurePass123!',
            'new_password_confirm': 'NewSecurePass123!'
        })
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password('NewSecurePass123!'))
        self.assertIsNone(self.user.password_reset_token)
    
    @override_settings(REST_FRAMEWORK={'DEFAULT_THROTTLE_CLASSES': []})
    def test_reset_password_with_invalid_token(self):
        """Test password reset with invalid token."""
        response = self.client.post('/api/v1/auth/auth/reset-password/', {
            'token': 'invalid_token',
            'new_password': 'NewSecurePass123!',
            'new_password_confirm': 'NewSecurePass123!'
        })
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)
    
    @override_settings(REST_FRAMEWORK={'DEFAULT_THROTTLE_CLASSES': []})
    def test_reset_password_with_expired_token(self):
        """Test password reset with expired token."""
        token = self.user.generate_password_reset_token()
        self.user.password_reset_token_expires_at = timezone.now() - timedelta(hours=1)
        self.user.save()
        
        response = self.client.post('/api/v1/auth/auth/reset-password/', {
            'token': token,
            'new_password': 'NewSecurePass123!',
            'new_password_confirm': 'NewSecurePass123!'
        })
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)
    
    @override_settings(REST_FRAMEWORK={'DEFAULT_THROTTLE_CLASSES': []})
    def test_reset_password_mismatched_passwords(self):
        """Test password reset with mismatched passwords."""
        token = self.user.generate_password_reset_token()
        
        response = self.client.post('/api/v1/auth/auth/reset-password/', {
            'token': token,
            'new_password': 'NewSecurePass123!',
            'new_password_confirm': 'DifferentSecurePass123!'
        })
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    @override_settings(REST_FRAMEWORK={'DEFAULT_THROTTLE_CLASSES': []})
    def test_reset_password_weak_password(self):
        """Test password reset with weak password."""
        token = self.user.generate_password_reset_token()
        
        response = self.client.post('/api/v1/auth/auth/reset-password/', {
            'token': token,
            'new_password': 'weak',
            'new_password_confirm': 'weak'
        })
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    @override_settings(REST_FRAMEWORK={'DEFAULT_THROTTLE_CLASSES': []})
    def test_reset_password_token_cannot_be_reused(self):
        """Test that password reset token cannot be reused."""
        token = self.user.generate_password_reset_token()
        
        # First reset
        self.client.post('/api/v1/auth/auth/reset-password/', {
            'token': token,
            'new_password': 'NewSecurePass123!',
            'new_password_confirm': 'NewSecurePass123!'
        })
        
        # Try to reuse token
        response = self.client.post('/api/v1/auth/auth/reset-password/', {
            'token': token,
            'new_password': 'AnotherSecurePass123!',
            'new_password_confirm': 'AnotherSecurePass123!'
        })
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class CeleryTasksTestCase(TestCase):
    """Test Celery tasks for authentication emails."""
    
    def setUp(self):
        """Set up test data."""
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
    
    @patch('apps.accounts.tasks.send_mail')
    def test_send_verification_email_task(self, mock_send_mail):
        """Test send_verification_email Celery task."""
        from apps.accounts.tasks import send_verification_email
        
        result = send_verification_email(str(self.user.id))
        
        self.assertEqual(result['status'], 'success')
        self.assertTrue(mock_send_mail.called)
    
    def test_send_verification_email_nonexistent_user(self):
        """Test send_verification_email with nonexistent user."""
        from apps.accounts.tasks import send_verification_email
        
        result = send_verification_email('00000000-0000-0000-0000-000000000000')
        
        self.assertEqual(result['status'], 'error')
        self.assertIn('not found', result['message'].lower())
    
    @patch('apps.accounts.tasks.send_mail')
    def test_send_password_reset_email_task(self, mock_send_mail):
        """Test send_password_reset_email Celery task."""
        from apps.accounts.tasks import send_password_reset_email
        
        result = send_password_reset_email(str(self.user.id))
        
        self.assertEqual(result['status'], 'success')
        self.assertTrue(mock_send_mail.called)
    
    def test_send_password_reset_email_nonexistent_user(self):
        """Test send_password_reset_email with nonexistent user."""
        from apps.accounts.tasks import send_password_reset_email
        
        result = send_password_reset_email('00000000-0000-0000-0000-000000000000')
        
        self.assertEqual(result['status'], 'error')
        self.assertIn('not found', result['message'].lower())


