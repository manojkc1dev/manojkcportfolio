"""
Serializers for accounts app.
"""
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import get_user_model
from .models import UserProfile, LoginLog

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for user model.
    """
    full_name = serializers.SerializerMethodField()
    role_display = serializers.CharField(source='get_role_display', read_only=True)

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'full_name', 'role', 'role_display', 'phone', 'avatar',
            'bio', 'website', 'location', 'github_url', 'linkedin_url',
            'twitter_url', 'is_verified', 'is_active', 'is_staff',
            'date_joined', 'last_login', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'is_verified', 'is_active', 'is_staff',
            'date_joined', 'last_login', 'created_at', 'updated_at'
        ]

    def get_full_name(self, obj):
        return obj.get_full_name()


class UserCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration.
    """
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password]
    )
    password_confirm = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = [
            'username', 'email', 'first_name', 'last_name',
            'password', 'password_confirm', 'phone'
        ]

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({
                "password": "Password fields didn't match."
            })
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        # Create user profile
        UserProfile.objects.create(user=user)
        return user


class UserUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for updating user profile.
    """
    class Meta:
        model = User
        fields = [
            'first_name', 'last_name', 'phone', 'avatar',
            'bio', 'website', 'location', 'github_url',
            'linkedin_url', 'twitter_url'
        ]

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance


class ChangePasswordSerializer(serializers.Serializer):
    """
    Serializer for password change.
    """
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(
        required=True,
        validators=[validate_password]
    )
    new_password_confirm = serializers.CharField(required=True)

    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError({
                "new_password": "Password fields didn't match."
            })
        return attrs

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is incorrect.")
        return value


class UserProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for user profile.
    """
    user = UserSerializer(read_only=True)

    class Meta:
        model = UserProfile
        fields = [
            'id', 'user', 'notification_preferences',
            'theme_preference', 'language_preference',
            'timezone', 'two_factor_enabled'
        ]
        read_only_fields = ['id', 'user', 'two_factor_enabled']


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Custom JWT token serializer with additional user data.
    """
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        
        # Add custom claims
        token['email'] = user.email
        token['role'] = user.role
        token['full_name'] = user.get_full_name()
        token['is_verified'] = user.is_verified
        
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        
        # Check if account is locked
        if self.user.is_locked():
            raise serializers.ValidationError({
                "detail": "Account is temporarily locked due to multiple failed login attempts."
            })
        
        # Add user data to response
        data['user'] = UserSerializer(self.user).data
        
        # Log successful login
        from .services import log_login
        request = self.context.get('request')
        log_login(self.user, request, success=True)
        
        # Reset failed login attempts
        self.user.reset_failed_login()
        
        return data


class LoginLogSerializer(serializers.ModelSerializer):
    """
    Serializer for login logs.
    """
    user = UserSerializer(read_only=True)

    class Meta:
        model = LoginLog
        fields = [
            'id', 'user', 'ip_address', 'user_agent',
            'success', 'failure_reason', 'location',
            'device_type', 'created_at'
        ]
        read_only_fields = fields
