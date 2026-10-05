"""
URL Routing for Authentication and JWT Endpoints.
"""
from django.urls import path
from .views import (
    PortfolioTokenObtainPairView,
    PortfolioTokenRefreshView,
    PortfolioTokenVerifyView,
    CurrentUserView,
    ChangePasswordView,
    PasswordResetRequestView,
    PasswordResetConfirmView,
    LogoutView,
)

app_name = 'authentication'

urlpatterns = [
    # JWT Lifecycle
    path('token/', PortfolioTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', PortfolioTokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', PortfolioTokenVerifyView.as_view(), name='token_verify'),
    path('logout/', LogoutView.as_view(), name='logout'),

    # Profile & Password Management
    path('me/', CurrentUserView.as_view(), name='current_user'),
    path('change-password/', ChangePasswordView.as_view(), name='change_password'),
    path('password-reset/', PasswordResetRequestView.as_view(), name='password_reset_request'),
    path('password-reset/confirm/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
]
