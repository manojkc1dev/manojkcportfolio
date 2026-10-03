"""
Authentication API Views implementing SimpleJWT token pair issuance, refresh,
verification, profile inspection, password rotation, and token revocation.
"""
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

from .serializers import (
    PortfolioTokenObtainPairSerializer,
    UserProfileSerializer,
    ChangePasswordSerializer,
    LogoutSerializer,
)


class PortfolioTokenObtainPairView(TokenObtainPairView):
    """
    Authenticate administrator credentials and return JWT access and refresh token pair.
    """
    permission_classes = [AllowAny]
    serializer_class = PortfolioTokenObtainPairSerializer


class PortfolioTokenRefreshView(TokenRefreshView):
    """
    Issue a new JWT access token using a valid, unexpired refresh token.
    """
    permission_classes = [AllowAny]


class PortfolioTokenVerifyView(TokenVerifyView):
    """
    Verify the cryptographic signature and expiration of a supplied JWT token.
    """
    permission_classes = [AllowAny]


class CurrentUserView(generics.RetrieveAPIView):
    """
    Retrieve the authenticated user's profile metadata.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = UserProfileSerializer

    def get_object(self):
        return self.request.user


class ChangePasswordView(APIView):
    """
    Securely change the current authenticated administrator's password.
    Enforces current password verification and Django password validation suites.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = ChangePasswordSerializer(
            data=request.data,
            context={'request': request}
        )
        serializer.is_valid(raise_exception=True)

        # Update password securely
        user = request.user
        new_password = serializer.validated_data['new_password']
        user.set_password(new_password)
        user.save()

        return Response(
            {"detail": "Password updated successfully."},
            status=status.HTTP_200_OK
        )


class LogoutView(APIView):
    """
    Revoke and blacklist the supplied refresh token, invalidating future refresh attempts.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = LogoutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(
            {"detail": "Successfully logged out."},
            status=status.HTTP_200_OK
        )
