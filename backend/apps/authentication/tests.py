"""
Automated unit and integration test suite for Authentication & Security Subsystem.
"""
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()


class AuthenticationTests(TestCase):
    """Test suite covering JWT lifecycle, permissions, password updates, password reset, and token revocation."""

    def setUp(self):
        self.client = APIClient()
        self.username = 'manojadmin'
        self.email = 'contactmanojkc1.com.np@gmail.com'
        self.password = 'SuperSecureP@ssw0rd2026!'
        self.user = User.objects.create_user(
            username=self.username,
            email=self.email,
            password=self.password,
            is_staff=True,
            is_superuser=True,
            first_name='Manoj',
            last_name='Khatri'
        )

        self.login_url = reverse('v1_auth:token_obtain_pair')
        self.refresh_url = reverse('v1_auth:token_refresh')
        self.verify_url = reverse('v1_auth:token_verify')
        self.me_url = reverse('v1_auth:current_user')
        self.change_password_url = reverse('v1_auth:change_password')
        self.password_reset_url = reverse('v1_auth:password_reset_request')
        self.password_reset_confirm_url = reverse('v1_auth:password_reset_confirm')
        self.logout_url = reverse('v1_auth:logout')

    # -------------------------------------------------------------------------
    # 1. Login / Token Pair Generation
    # -------------------------------------------------------------------------
    def test_login_with_valid_username_returns_jwt_pair_and_user_meta(self):
        response = self.client.post(self.login_url, {
            'username': self.username,
            'password': self.password,
        }, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertIn('access', data)
        self.assertIn('refresh', data)
        self.assertIn('user', data)
        self.assertEqual(data['user']['username'], self.username)
        self.assertEqual(data['user']['email'], self.email)
        self.assertTrue(data['user']['is_staff'])

    def test_login_with_valid_email_returns_jwt_pair(self):
        response = self.client.post(self.login_url, {
            'email': self.email,
            'password': self.password,
        }, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertIn('access', data)
        self.assertIn('refresh', data)
        self.assertEqual(data['user']['username'], self.username)
        self.assertEqual(data['user']['email'], self.email)

    def test_login_with_case_insensitive_email_and_whitespace(self):
        response = self.client.post(self.login_url, {
            'email': f"  {self.email.upper()}  ",
            'password': self.password,
        }, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertIn('access', data)
        self.assertEqual(data['user']['username'], self.username)

    def test_login_with_wrong_password_returns_generic_error(self):
        response = self.client.post(self.login_url, {
            'email': self.email,
            'password': 'WrongPassword123!',
        }, format='json')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        data = response.json()
        self.assertIn('detail', data)
        self.assertEqual(data['detail'], 'Invalid email or password.')

    def test_login_with_nonexistent_email_returns_generic_error(self):
        response = self.client.post(self.login_url, {
            'email': 'unregistered@example.com',
            'password': self.password,
        }, format='json')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        data = response.json()
        self.assertIn('detail', data)
        self.assertEqual(data['detail'], 'Invalid email or password.')

    def test_login_with_missing_credentials_fails(self):
        response = self.client.post(self.login_url, {
            'password': self.password,
        }, format='json')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    # -------------------------------------------------------------------------
    # 2. Token Refresh & Verification
    # -------------------------------------------------------------------------
    def test_token_refresh_lifecycle(self):
        refresh = RefreshToken.for_user(self.user)
        response = self.client.post(self.refresh_url, {
            'refresh': str(refresh),
        }, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertIn('access', data)

    def test_token_verify_endpoint(self):
        refresh = RefreshToken.for_user(self.user)
        access = str(refresh.access_token)

        response = self.client.post(self.verify_url, {
            'token': access,
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Invalid token verification
        bad_response = self.client.post(self.verify_url, {
            'token': 'invalid.token.payload',
        }, format='json')
        self.assertEqual(bad_response.status_code, status.HTTP_401_UNAUTHORIZED)

    # -------------------------------------------------------------------------
    # 3. Current User Endpoint (/api/v1/auth/me/)
    # -------------------------------------------------------------------------
    def test_current_user_unauthenticated_blocked(self):
        response = self.client.get(self.me_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_current_user_authenticated_returns_safe_profile(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.me_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertEqual(data['username'], self.username)
        self.assertEqual(data['email'], self.email)
        self.assertNotIn('password', data)

    # -------------------------------------------------------------------------
    # 4. Password Change Endpoint
    # -------------------------------------------------------------------------
    def test_password_change_success(self):
        self.client.force_authenticate(user=self.user)
        new_pass = 'EvenMoreSecur3P@ssw0rd2026!'

        response = self.client.post(self.change_password_url, {
            'old_password': self.password,
            'new_password': new_pass,
        }, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()['detail'], 'Password updated successfully.')

        # Verify old password no longer works
        self.client.logout()
        old_login = self.client.post(self.login_url, {
            'username': self.username,
            'password': self.password,
        }, format='json')
        self.assertEqual(old_login.status_code, status.HTTP_401_UNAUTHORIZED)

        # Verify new password works
        new_login = self.client.post(self.login_url, {
            'username': self.username,
            'password': new_pass,
        }, format='json')
        self.assertEqual(new_login.status_code, status.HTTP_200_OK)

    def test_password_change_incorrect_old_password_fails(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post(self.change_password_url, {
            'old_password': 'WrongCurrentPassword123!',
            'new_password': 'BrandNewPassword2026!',
        }, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('old_password', response.json())

    # -------------------------------------------------------------------------
    # 5. Password Reset Endpoints
    # -------------------------------------------------------------------------
    def test_password_reset_request_authorized_email_succeeds(self):
        response = self.client.post(self.password_reset_url, {
            'email': self.email,
        }, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('detail', response.json())
        self.assertEqual(response.json()['detail'], 'Password reset instructions have been sent.')

    def test_password_reset_request_unauthorized_email_fails_with_generic_error(self):
        response = self.client.post(self.password_reset_url, {
            'email': 'attacker@example.com',
        }, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.json()['detail'], 'Invalid email or password.')

    def test_password_reset_confirm_flow(self):
        token = default_token_generator.make_token(self.user)
        uid = urlsafe_base64_encode(force_bytes(self.user.pk))
        reset_pass = 'ResetS3cureP@ssword2026!'

        response = self.client.post(self.password_reset_confirm_url, {
            'uid': uid,
            'token': token,
            'new_password': reset_pass,
        }, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Login with newly reset password
        login_resp = self.client.post(self.login_url, {
            'email': self.email,
            'password': reset_pass,
        }, format='json')
        self.assertEqual(login_resp.status_code, status.HTTP_200_OK)

    # -------------------------------------------------------------------------
    # 6. Logout & Token Blacklisting
    # -------------------------------------------------------------------------
    def test_logout_blacklists_refresh_token(self):
        self.client.force_authenticate(user=self.user)
        refresh = RefreshToken.for_user(self.user)
        refresh_str = str(refresh)

        # Logout
        response = self.client.post(self.logout_url, {
            'refresh': refresh_str,
        }, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()['detail'], 'Successfully logged out.')

        # Attempting to refresh with blacklisted token must fail
        refresh_attempt = self.client.post(self.refresh_url, {
            'refresh': refresh_str,
        }, format='json')

        self.assertEqual(refresh_attempt.status_code, status.HTTP_401_UNAUTHORIZED)
