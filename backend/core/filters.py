"""
Common filters for Portfolio CMS.
"""
import django_filters
from django.db import models


class BaseFilter(django_filters.FilterSet):
    """
    Base filter with common functionality.
    """
    created_at = django_filters.DateTimeFromToRangeFilter()
    updated_at = django_filters.DateTimeFromToRangeFilter()
    is_active = django_filters.BooleanFilter()

    class Meta:
        abstract = True


class StatusFilter(django_filters.FilterSet):
    """
    Filter for models with status field.
    """
    status = django_filters.ChoiceFilter(choices=[
        ('draft', 'Draft'),
        ('published', 'Published'),
        ('archived', 'Archived'),
    ])
    is_active = django_filters.BooleanFilter()

    class Meta:
        abstract = True


class SearchFilter(django_filters.FilterSet):
    """
    Filter with search functionality.
    """
    search = django_filters.CharFilter(method='filter_search')

    def filter_search(self, queryset, name, value):
        """Custom search filter."""
        if value:
            return queryset.filter(
                models.Q(title__icontains=value) |
                models.Q(description__icontains=value) |
                models.Q(name__icontains=value)
            )
        return queryset

    class Meta:
        abstract = True
