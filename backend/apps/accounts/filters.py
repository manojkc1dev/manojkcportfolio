"""
Filters for accounts app.
"""
import django_filters
from django.contrib.auth import get_user_model
from core.filters import BaseFilter

User = get_user_model()


class UserFilter(BaseFilter):
    """
    Filter for user model.
    """
    role = django_filters.ChoiceFilter(choices=User.ROLE_CHOICES)
    is_active = django_filters.BooleanFilter()
    is_verified = django_filters.BooleanFilter()
    is_staff = django_filters.BooleanFilter()
    search = django_filters.CharFilter(method='filter_search')

    class Meta:
        model = User
        fields = ['role', 'is_active', 'is_verified', 'is_staff', 'search']

    def filter_search(self, queryset, name, value):
        """Search across multiple fields."""
        if value:
            return queryset.filter(
                username__icontains=value
            ) | queryset.filter(
                email__icontains=value
            ) | queryset.filter(
                first_name__icontains=value
            ) | queryset.filter(
                last_name__icontains=value
            )
        return queryset


class LoginLogFilter(BaseFilter):
    """
    Filter for login logs.
    """
    success = django_filters.BooleanFilter()
    user = django_filters.UUIDFilter(field_name='user__id')
    ip_address = django_filters.CharFilter(lookup_expr='icontains')

    class Meta:
        model = LoginLog
        fields = ['success', 'user', 'ip_address']
