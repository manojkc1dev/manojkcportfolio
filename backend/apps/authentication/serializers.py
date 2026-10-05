"""
Serializers for authentication, JWT token issuance, user inspection, and password management.
"""
from django.conf import settings
from django.contrib.auth import get_user_model, authenticate
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth.password_validation import validate_password
from django.core.mail import send_mail
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from rest_framework import serializers
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken, TokenError

User = get_user_model()

# Authorized administrator login email
AUTHORIZED_ADMIN_EMAIL = getattr(settings, 'ADMIN_LOGIN_EMAIL', 'contactmanojkc1.com.np@gmail.com')


class UserProfileSerializer(serializers.ModelSerializer):
    """Safe serializer exposing only public/administrative profile properties."""

    class Meta:
        model = User
        fields = (
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'is_staff',
            'is_superuser',
            'date_joined',
        )
        read_only_fields = fields


class PortfolioTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Custom JWT serializer supporting authentication via either username or email,
    returning access & refresh tokens along with safe user metadata.
    Enforces a strict single generic error message ('Invalid email or password.') to prevent enumeration.
    """

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields[self.username_field] = serializers.CharField(
            required=False,
            allow_blank=True,
            write_only=True,
            help_text="Username or email address."
        )
        self.fields['email'] = serializers.CharField(
            required=False,
            allow_blank=True,
            write_only=True,
            help_text="Optional explicit email field for email-based login."
        )

    def validate(self, attrs):
        request = self.context.get('request')
        raw_username = attrs.get('username')
        raw_email = attrs.get('email')
        password = attrs.get('password')

        username_or_email = (
            (raw_username.strip() if isinstance(raw_username, str) and raw_username.strip() else None)
            or (raw_email.strip() if isinstance(raw_email, str) and raw_email.strip() else None)
        )

        if not username_or_email or not password:
            raise AuthenticationFailed('Invalid email or password.')

        user = None

        # 1. Try authenticating as username
        user = authenticate(request=request, username=username_or_email, password=password)

        # 2. If unsuccessful, try resolving user by email
        if user is None:
            try:
                user_obj = User.objects.get(email__iexact=username_or_email)
                user = authenticate(request=request, username=user_obj.username, password=password)
            except (User.DoesNotExist, User.MultipleObjectsReturned):
                user = None

        if user is None:
            raise AuthenticationFailed('Invalid email or password.')

        if not user.is_active:
            raise AuthenticationFailed('Invalid email or password.')

        self.user = user

        # Issue standard JWT tokens
        refresh = self.get_token(user)

        # Custom claims on token
        refresh['username'] = user.username
        refresh['email'] = user.email
        refresh['is_staff'] = user.is_staff

        data = {
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': UserProfileSerializer(user).data,
        }

        return data


class PasswordResetRequestSerializer(serializers.Serializer):
    """
    Serializer for initiating an administrative password reset.
    Strictly restricted to the authorized admin email (contactmanojkc1.com.np@gmail.com).
    Returns a generic 'Invalid email or password.' on unauthorized/non-existent addresses.
    """

    email = serializers.EmailField(required=True, help_text="Authorized administrator email address.")

    def validate_email(self, value):
        clean_email = value.strip().lower()
        if clean_email != AUTHORIZED_ADMIN_EMAIL.lower():
            raise serializers.ValidationError("Invalid email or password.")
        return clean_email

    def save(self):
        email = self.validated_data['email']
        user = User.objects.filter(email__iexact=email, is_active=True).first()
        if not user:
            raise serializers.ValidationError({"email": ["Invalid email or password."]})

        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))

        frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:3000').rstrip('/')
        reset_link = f"{frontend_url}/mkc-admin-z?tab=reset-password&uid={uid}&token={token}"

        subject = "Reset your Manoj Khatri Portfolio Admin password"
        message = (
            f"Hello {user.first_name or user.username},\n\n"
            f"A password reset was requested for your Portfolio Admin account.\n\n"
            f"Use the secure link below to create a new password:\n\n"
            f"{reset_link}\n\n"
            f"This link expires in 24 hours.\n\n"
            f"If you did not request this change, you can safely ignore this email.\n\n"
            f"Best regards,\n"
            f"Manoj Khatri Portfolio Security Subsystem"
        )
        from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', 'Manoj Khatri <contact@manojkc1.com.np>')

        try:
            send_mail(
                subject=subject,
                message=message,
                from_email=from_email,
                recipient_list=[user.email],
                fail_silently=False,
            )
        except Exception as e:
            # Re-raise in production if fail_silently is false, or pass in offline test
            if not getattr(settings, 'DEBUG', True):
                raise serializers.ValidationError({"detail": f"Failed to deliver reset email: {str(e)}"})

        return {"detail": "Password reset instructions have been sent."}


class PasswordResetConfirmSerializer(serializers.Serializer):
    """
    Serializer for confirming password reset with uidb64 and token.
    """

    uid = serializers.CharField(required=True)
    token = serializers.CharField(required=True)
    new_password = serializers.CharField(
        required=True,
        write_only=True,
        style={'input_type': 'password'},
        help_text="New password."
    )

    def validate(self, attrs):
        try:
            uid = force_str(urlsafe_base64_decode(attrs['uid']))
            user = User.objects.get(pk=uid, is_active=True)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            raise serializers.ValidationError({'detail': 'Invalid or expired password reset link.'})

        if not default_token_generator.check_token(user, attrs['token']):
            raise serializers.ValidationError({'detail': 'Invalid or expired password reset link.'})

        validate_password(attrs['new_password'], user=user)
        self.user = user
        return attrs

    def save(self):
        self.user.set_password(self.validated_data['new_password'])
        self.user.save(update_fields=['password'])
        return {"detail": "Password has been reset successfully."}


class ChangePasswordSerializer(serializers.Serializer):
    """Serializer for authenticated administrator password change."""

    old_password = serializers.CharField(
        required=True,
        write_only=True,
        style={'input_type': 'password'},
        help_text="Current administrative password."
    )
    new_password = serializers.CharField(
        required=True,
        write_only=True,
        style={'input_type': 'password'},
        help_text="New password (minimum 8 characters, subject to Django password rules)."
    )

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Current password is incorrect.")
        return value

    def validate_new_password(self, value):
        user = self.context['request'].user
        # Enforce Django password validation suite
        validate_password(value, user=user)
        return value

    def validate(self, attrs):
        if attrs['old_password'] == attrs['new_password']:
            raise serializers.ValidationError(
                {"new_password": "New password must be different from your current password."}
            )
        return attrs


class LogoutSerializer(serializers.Serializer):
    """Serializer for revoking and blacklisting refresh tokens."""

    refresh = serializers.CharField(required=True, help_text="Refresh token to blacklist.")

    def validate(self, attrs):
        self.token = attrs['refresh']
        return attrs

    def save(self, **kwargs):
        try:
            RefreshToken(self.token).blacklist()
        except TokenError:
            raise serializers.ValidationError({'detail': 'Token is invalid or already expired.'})
