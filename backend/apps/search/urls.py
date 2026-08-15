"""
URL configuration for search app.
"""
from django.urls import path
from .views import SearchQueryListCreateView, SearchQueryDetailView

app_name = 'search'

urlpatterns = [
    path('', SearchQueryListCreateView.as_view(), name='search-query-list'),
    path('<uuid:id>/', SearchQueryDetailView.as_view(), name='search-query-detail'),
]
