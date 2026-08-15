"""
Admin configuration for GitHub integration.
"""
from django.contrib import admin
from .models import GitHubRepository, GitHubContribution, GitHubProfile


@admin.register(GitHubRepository)
class GitHubRepositoryAdmin(admin.ModelAdmin):
    """
    Admin interface for GitHub repositories.
    """
    list_display = [
        'name', 'full_name', 'language', 'stars', 'forks',
        'is_featured', 'display_order', 'is_private', 'is_fork', 'updated_at_github'
    ]
    list_filter = [
        'is_featured', 'is_private', 'is_fork', 'is_archived', 'language'
    ]
    search_fields = ['name', 'full_name', 'description']
    list_editable = ['is_featured', 'display_order']
    readonly_fields = [
        'id', 'repository_id', 'created_at', 'updated_at',
        'created_at_github', 'updated_at_github', 'pushed_at'
    ]

    fieldsets = (
        ('Repository Information', {
            'fields': ('repository_id', 'name', 'full_name', 'description')
        }),
        ('Language & Topics', {
            'fields': ('language', 'primary_language', 'languages', 'topics')
        }),
        ('Statistics', {
            'fields': ('stars', 'forks', 'watchers', 'open_issues', 'size')
        }),
        ('URLs', {
            'fields': ('html_url', 'clone_url', 'homepage')
        }),
        ('Visibility', {
            'fields': ('is_private', 'is_fork', 'is_archived', 'is_disabled')
        }),
        ('Display Settings', {
            'fields': ('is_featured', 'display_order')
        }),
        ('Dates', {
            'fields': ('created_at_github', 'updated_at_github', 'pushed_at')
        }),
        ('Metadata', {
            'fields': ('id', 'created_at', 'updated_at')
        }),
    )


@admin.register(GitHubContribution)
class GitHubContributionAdmin(admin.ModelAdmin):
    """
    Admin interface for GitHub contributions.
    """
    list_display = ['repository', 'contribution_type', 'title', 'date', 'number']
    list_filter = ['contribution_type', 'date']
    search_fields = ['title', 'description']
    readonly_fields = ['id', 'created_at', 'updated_at']


@admin.register(GitHubProfile)
class GitHubProfileAdmin(admin.ModelAdmin):
    """
    Admin interface for GitHub profile.
    """
    list_display = ['username', 'name', 'followers', 'following', 'public_repos']
    search_fields = ['username', 'name', 'email']
    readonly_fields = [
        'id', 'github_id', 'created_at', 'updated_at',
        'created_at_github', 'updated_at_github'
    ]

    def has_add_permission(self, request):
        """Prevent adding multiple profiles."""
        return not GitHubProfile.objects.exists()

    fieldsets = (
        ('Profile Information', {
            'fields': ('github_id', 'username', 'name', 'bio', 'email')
        }),
        ('Additional Info', {
            'fields': ('location', 'company', 'blog')
        }),
        ('Avatar', {
            'fields': ('avatar_url',)
        }),
        ('Statistics', {
            'fields': ('followers', 'following', 'public_repos', 'public_gists')
        }),
        ('URLs', {
            'fields': ('html_url',)
        }),
        ('Dates', {
            'fields': ('created_at_github', 'updated_at_github')
        }),
        ('Metadata', {
            'fields': ('id', 'created_at', 'updated_at')
        }),
    )
