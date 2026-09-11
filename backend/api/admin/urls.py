"""
Admin API URL configuration.

⚠️  This module intentionally does NOT re-include any app urls.py.

Reasons:
- The previous implementation re-mounted every public viewset under
  /api/v1/admin/, exposing admin actions (create/update/delete) at
  URLs that were not protected by IsAdminUser.
- Duplicating the same viewset at two URL prefixes means a single
  permission_classes mistake becomes a public vulnerability twice over.
- Admin-only actions are already gated by DRF permission_classes on
  the viewsets themselves. The URL namespace is not the security
  boundary — permission_classes are.

If you need an admin-only endpoint, define it explicitly below with
permission_classes=[IsAdminUser] (or a custom RBAC permission).
"""
from django.urls import path
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response

app_name = 'admin_api'


@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_ping(request):
    """
    Lightweight health check for the admin API surface.

    Confirms:
    - JWT authentication is working
    - The authenticated user has staff/admin privileges
    """
    return Response({
        'status': 'ok',
        'user': request.user.email,
        'role': getattr(request.user, 'role', None),
        'is_staff': request.user.is_staff,
        'is_superuser': request.user.is_superuser,
    })


urlpatterns = [
    path('ping/', admin_ping, name='admin-ping'),
]