"""
Custom permissions for accounts app.
"""
from rest_framework import permissions


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Permission to allow only owners to edit their own profile.
    """
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj == request.user


class IsSameUser(permissions.BasePermission):
    """
    Permission to allow only the same user.
    """
    def has_object_permission(self, request, view, obj):
        return obj == request.user


class CanManageUser(permissions.BasePermission):
    """
    Permission to manage users (admin and above).
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        return request.user.is_admin()

    def has_object_permission(self, request, view, obj):
        if request.user.is_super_admin():
            return True
        if request.user.is_admin() and obj.role not in ['super_admin', 'admin']:
            return True
        return obj == request.user
