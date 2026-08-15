"""
URL configuration for accounts app.
"""
from django.urls import path
from .views import (
    CustomTokenObtainPairView, CustomTokenRefreshView, RegisterView, UserListView,
    UserDetailView, CurrentUserView, ChangePasswordView,
    LogoutView, UserProfileView, LoginLogListView,
    verify_email, forgot_password, reset_password
)

app_name = 'accounts'

urlpatterns = [
    # Authentication
    path('auth/login/', CustomTokenObtainPairView.as_view(), name='login'),
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('auth/refresh/', CustomTokenRefreshView.as_view(), name='token-refresh'),
    path('auth/verify-email/', verify_email, name='verify-email'),
    path('auth/forgot-password/', forgot_password, name='forgot-password'),
    path('auth/reset-password/', reset_password, name='reset-password'),
    
    # User Management
    path('users/', UserListView.as_view(), name='user-list'),
    path('users/me/', CurrentUserView.as_view(), name='current-user'),
    path('users/<uuid:pk>/', UserDetailView.as_view(), name='user-detail'),
    path('users/me/change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('users/me/profile/', UserProfileView.as_view(), name='user-profile'),
    
    # Login Logs
    path('login-logs/', LoginLogListView.as_view(), name='login-logs'),
]
