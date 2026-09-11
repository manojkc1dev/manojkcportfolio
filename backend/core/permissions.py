"""
Custom permissions for Portfolio CMS.
"""
from rest_framework import permissions
from rest_framework.permissions import BasePermission, SAFE_METHODS

from core.permissions import IsContentManagerOrAbove


class IsAdminUser(permissions.BasePermission):
    """
    Permission for admin users only.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'admin'


class IsSuperAdmin(permissions.BasePermission):
    """
    Permission for super admin only.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'super_admin'


class IsAdminOrSuperAdmin(permissions.BasePermission):
    """
    Permission for admin or super admin users.
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        return request.user.role in ['admin', 'super_admin']


class IsEditorOrAbove(permissions.BasePermission):
    """
    Permission for editors and above.
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        return request.user.role in ['editor', 'admin', 'super_admin']


class IsPublicReadOrContentManagerWrite(permissions.BasePermission):
    """
    Allow anonymous users read-only access (GET/HEAD/OPTIONS).
    Require Content Manager or above for writes.
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        from .permissions import IsContentManagerOrAbove
        return IsContentManagerOrAbove().has_permission(request, view)


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Permission to allow only owners to edit.
    """
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.created_by == request.user


class IsPublicOrAuthenticated(permissions.BasePermission):
    """
    Permission to allow public access for GET, authenticated for others.
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_authenticated


class CanPublish(permissions.BasePermission):
    """
    Permission to publish content.
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        return request.user.role in ['editor', 'admin', 'super_admin']


class CanDelete(permissions.BasePermission):
    """
    Permission to delete content.
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        return request.user.role in ['admin', 'super_admin']


class CanExport(permissions.BasePermission):
    """
    Permission to export data.
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        return request.user.role in ['content_manager', 'editor', 'admin', 'super_admin']


class IsViewerOrAbove(permissions.BasePermission):
    """
    Permission for viewers and above (all authenticated users).
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated


class CanManageUsers(permissions.BasePermission):
    """
    Permission to manage users (admin and super admin only).
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        return request.user.role in ['admin', 'super_admin']


class CanViewAnalytics(permissions.BasePermission):
    """
    Permission to view analytics (content manager and above).
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        return request.user.role in ['content_manager', 'editor', 'admin', 'super_admin']


class CanManageSettings(permissions.BasePermission):
    """
    Permission to manage system settings (super admin only).
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        return request.user.role == 'super_admin'
