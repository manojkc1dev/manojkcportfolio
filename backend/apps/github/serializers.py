"""
Serializers for GitHub integration.
"""
from rest_framework import serializers
from .models import GitHubRepository, GitHubContribution, GitHubProfile


class GitHubRepositorySerializer(serializers.ModelSerializer):
    """
    Serializer for GitHub repositories.
    """

    class Meta:
        model = GitHubRepository
        fields = [
            'id', 'repository_id', 'name', 'full_name', 'description',
            'language', 'primary_language', 'languages',
            'stars', 'forks', 'watchers', 'open_issues',
            'size', 'created_at_github', 'updated_at_github', 'pushed_at',
            'html_url', 'clone_url', 'homepage',
            'is_private', 'is_fork', 'is_archived', 'is_disabled',
            'topics', 'is_featured', 'display_order',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class GitHubContributionSerializer(serializers.ModelSerializer):
    """
    Serializer for GitHub contributions.
    """
    contribution_type_display = serializers.CharField(source='get_contribution_type_display', read_only=True)
    repository_name = serializers.CharField(source='repository.name', read_only=True)

    class Meta:
        model = GitHubContribution
        fields = [
            'id', 'repository', 'repository_name', 'contribution_type',
            'contribution_type_display', 'title', 'description',
            'date', 'url', 'number',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class GitHubProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for GitHub profile.
    """
    class Meta:
        model = GitHubProfile
        fields = [
            'id', 'github_id', 'username', 'name', 'bio',
            'email', 'location', 'company', 'blog',
            'avatar_url', 'followers', 'following',
            'public_repos', 'public_gists',
            'created_at_github', 'updated_at_github', 'html_url',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class PublicGitHubRepositorySerializer(serializers.ModelSerializer):
    """
    Public serializer for featured repositories.
    """
    class Meta:
        model = GitHubRepository
        fields = [
            'name', 'full_name', 'description', 'language',
            'primary_language', 'stars', 'forks', 'open_issues',
            'html_url', 'homepage', 'topics'
        ]
