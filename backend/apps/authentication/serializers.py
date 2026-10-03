"""
Serializers for authentication, JWT token issuance, user inspection, and password management.
"""
from django.contrib.auth import get_user_model, authenticate
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken, TokenError

User = get_user_model()


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
            raise serializers.ValidationError('Both username/email and password are required.')

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
            raise serializers.ValidationError(
                {'detail': 'No active account found with the given credentials.'}
            )

        if not user.is_active:
            raise serializers.ValidationError(
                {'detail': 'User account is disabled.'}
            )

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
