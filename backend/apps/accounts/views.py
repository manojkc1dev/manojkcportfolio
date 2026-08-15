"""
Views for accounts app.
"""
from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from .models import UserProfile, LoginLog
from .serializers import (
    UserSerializer, UserCreateSerializer, UserUpdateSerializer,
    ChangePasswordSerializer, UserProfileSerializer,
    CustomTokenObtainPairSerializer, LoginLogSerializer
)
from .permissions import IsOwnerOrReadOnly, CanManageUser
from core.permissions import IsSuperAdmin, IsAdminUser
from .services import log_login

User = get_user_model()


class CustomTokenObtainPairView(TokenObtainPairView):
    """
    Custom token obtain view with enhanced logging and HttpOnly cookie support.
    """
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        try:
            response = super().post(request, *args, **kwargs)
            
            # Set refresh token as HttpOnly cookie for security
            refresh_token = response.data.get('refresh')
            if refresh_token:
                from django.conf import settings
                response.set_cookie(
                    'refresh_token',
                    refresh_token,
                    max_age=7 * 24 * 60 * 60,  # 7 days
                    httponly=True,
                    secure=not settings.DEBUG,
                    samesite='Lax',
                    path='/'
                )
                # Remove refresh token from response body (it's now in cookie)
                response.data.pop('refresh', None)
            
            return response
        except Exception as e:
            # Log failed login attempt
            email = request.data.get('email', request.data.get('username', ''))
            try:
                user = User.objects.get(email=email)
                user.increment_failed_login()
                log_login(user, request, success=False, failure_reason=str(e))
            except User.DoesNotExist:
                pass
            raise


class CustomTokenRefreshView(TokenRefreshView):
    """
    Custom token refresh view that reads refresh token from HttpOnly cookie.
    """
    def post(self, request, *args, **kwargs):
        # Try to get refresh token from cookie first
        refresh_token = request.COOKIES.get('refresh_token')
        if refresh_token:
            request.data['refresh'] = refresh_token
        
        response = super().post(request, *args, **kwargs)
        
        # If new refresh token is generated (rotation), set it as cookie
        if 'refresh' in response.data:
            from django.conf import settings
            response.set_cookie(
                'refresh_token',
                response.data['refresh'],
                max_age=7 * 24 * 60 * 60,  # 7 days
                httponly=True,
                secure=not settings.DEBUG,
                samesite='Lax',
                path='/'
            )
            response.data.pop('refresh', None)
        
        return response


class RegisterView(generics.CreateAPIView):
    """
    User registration endpoint.
    """
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = UserCreateSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        return Response({
            'message': 'User registered successfully',
            'user': UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)


class UserListView(generics.ListAPIView):
    """
    List all users (admin only).
    """
    queryset = User.objects.all()
    permission_classes = [IsAdminUser]
    serializer_class = UserSerializer
    filterset_fields = ['role', 'is_active', 'is_verified']
    search_fields = ['email', 'username', 'first_name', 'last_name']


class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a user.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH']:
            return [IsOwnerOrReadOnly()]
        if self.request.method == 'DELETE':
            return [IsSuperAdmin()]
        return [permissions.IsAuthenticated()]

    def destroy(self, request, *args, **kwargs):
        """Soft delete user."""
        user = self.get_object()
        user.is_active = False
        user.save()
        return Response({'message': 'User deactivated successfully'}, status=status.HTTP_200_OK)


class CurrentUserView(generics.RetrieveUpdateAPIView):
    """
    Get or update current user profile.
    """
    serializer_class = UserUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return UserSerializer
        return UserUpdateSerializer


class ChangePasswordView(generics.UpdateAPIView):
    """
    Change user password.
    """
    serializer_class = ChangePasswordSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = self.get_object()
        user.set_password(serializer.validated_data['new_password'])
        user.save()
        
        return Response({'message': 'Password changed successfully'}, status=status.HTTP_200_OK)


class LogoutView(generics.GenericAPIView):
    """
    Logout user by blacklisting refresh token and clearing cookie.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            # Try to get refresh token from cookie first, then from body
            refresh_token = request.COOKIES.get('refresh_token') or request.data.get('refresh_token')
            
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            
            # Log logout
            from .services import log_logout
            log_logout(request.user, request)
            
            # Clear the refresh token cookie
            response = Response({'message': 'Logged out successfully'}, status=status.HTTP_200_OK)
            response.delete_cookie('refresh_token', path='/')
            
            return response
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class UserProfileView(generics.RetrieveUpdateAPIView):
    """
    Get or update user profile.
    """
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        profile, created = UserProfile.objects.get_or_create(user=self.request.user)
        return profile


class LoginLogListView(generics.ListAPIView):
    """
    List login logs for current user.
    """
    serializer_class = LoginLogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_admin():
            return LoginLog.objects.all()
        return LoginLog.objects.filter(user=self.request.user)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def verify_email(request):
    """
    Verify user email (placeholder for email verification).
    """
    return Response({'message': 'Email verification endpoint'}, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def forgot_password(request):
    """
    Request password reset (placeholder for email sending).
    """
    email = request.data.get('email')
    if not email:
        return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    # TODO: Implement password reset email sending
    return Response({'message': 'Password reset email sent if account exists'}, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def reset_password(request):
    """
    Reset password with token (placeholder).
    """
    # TODO: Implement password reset with token
    return Response({'message': 'Password reset endpoint'}, status=status.HTTP_200_OK)
