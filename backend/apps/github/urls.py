"""
URL configuration for GitHub integration app.
"""
from django.urls import path
from .views import (
    GitHubRepositoryListCreateView, GitHubRepositoryDetailView,
    PublicGitHubRepositoryListView, GitHubContributionListCreateView,
    GitHubProfileDetailView, PublicGitHubProfileView, github_stats
)

app_name = 'github'

urlpatterns = [
    # Public endpoints
    path('repositories/featured/', PublicGitHubRepositoryListView.as_view(), name='featured-repos'),
    path('profile/', PublicGitHubProfileView.as_view(), name='public-profile'),
    path('stats/', github_stats, name='github-stats'),
    
    # Admin endpoints
    path('repositories/', GitHubRepositoryListCreateView.as_view(), name='repo-list'),
    path('repositories/<int:repository_id>/', GitHubRepositoryDetailView.as_view(), name='repo-detail'),
    path('contributions/', GitHubContributionListCreateView.as_view(), name='contribution-list'),
    path('profile/manage/', GitHubProfileDetailView.as_view(), name='profile-manage'),
]
