"""
GitHub integration models for repositories and contribution activity.
"""
from django.db import models
from core.models import BaseModel


class GitHubRepository(BaseModel):
    """
    GitHub repository information.
    """
    # Repository Basic Info
    repository_id = models.BigIntegerField(unique=True, db_index=True)
    name = models.CharField(max_length=255, db_index=True)
    full_name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True)
    
    # Repository Details
    language = models.CharField(max_length=100, blank=True)
    primary_language = models.CharField(max_length=100, blank=True)
    languages = models.JSONField(default=dict, blank=True)
    
    # Statistics
    stars = models.PositiveIntegerField(default=0)
    forks = models.PositiveIntegerField(default=0)
    watchers = models.PositiveIntegerField(default=0)
    open_issues = models.PositiveIntegerField(default=0)
    
    # Size and Dates
    size = models.PositiveIntegerField(default=0)
    created_at_github = models.DateTimeField()
    updated_at_github = models.DateTimeField()
    pushed_at = models.DateTimeField()
    
    # URLs
    html_url = models.URLField()
    clone_url = models.URLField()
    homepage = models.URLField(blank=True)
    
    # Visibility
    is_private = models.BooleanField(default=False)
    is_fork = models.BooleanField(default=False)
    is_archived = models.BooleanField(default=False)
    is_disabled = models.BooleanField(default=False)
    
    # Topics
    topics = models.JSONField(default=list, blank=True)
    
    # Display Settings
    is_featured = models.BooleanField(default=False, db_index=True)
    display_order = models.PositiveIntegerField(default=0, db_index=True)
    
    class Meta:
        db_table = 'github_repositories'
        verbose_name = 'GitHub Repository'
        verbose_name_plural = 'GitHub Repositories'
        ordering = ['-is_featured', 'display_order', '-stars', '-updated_at_github']
        indexes = [
            models.Index(fields=['repository_id']),
            models.Index(fields=['is_featured', 'display_order']),
        ]

    def __str__(self):
        return self.full_name


class GitHubContribution(BaseModel):
    """
    GitHub contribution activity.
    """
    CONTRIBUTION_TYPES = [
        ('commit', 'Commit'),
        ('pr', 'Pull Request'),
        ('issue', 'Issue'),
        ('review', 'Code Review'),
        ('release', 'Release'),
    ]

    repository = models.ForeignKey(GitHubRepository, on_delete=models.CASCADE, related_name='contributions')
    contribution_type = models.CharField(max_length=20, choices=CONTRIBUTION_TYPES)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    
    # Dates
    date = models.DateField(db_index=True)
    
    # Metadata
    url = models.URLField(blank=True)
    number = models.PositiveIntegerField(blank=True, null=True)
    
    class Meta:
        db_table = 'github_contributions'
        verbose_name = 'GitHub Contribution'
        verbose_name_plural = 'GitHub Contributions'
        ordering = ['-date', '-created_at']
        indexes = [
            models.Index(fields=['date']),
            models.Index(fields=['contribution_type']),
        ]

    def __str__(self):
        return f"{self.repository.name} - {self.title}"


class GitHubProfile(BaseModel):
    """
    GitHub profile information.
    """
    # Profile Basic Info
    github_id = models.BigIntegerField(unique=True, db_index=True)
    username = models.CharField(max_length=100, unique=True)
    name = models.CharField(max_length=255, blank=True)
    bio = models.TextField(blank=True)
    email = models.EmailField(blank=True)
    location = models.CharField(max_length=255, blank=True)
    company = models.CharField(max_length=255, blank=True)
    blog = models.URLField(blank=True)
    
    # Avatar
    avatar_url = models.URLField()
    
    # Statistics
    followers = models.PositiveIntegerField(default=0)
    following = models.PositiveIntegerField(default=0)
    public_repos = models.PositiveIntegerField(default=0)
    public_gists = models.PositiveIntegerField(default=0)
    
    # Dates
    created_at_github = models.DateTimeField()
    updated_at_github = models.DateTimeField()
    
    # URLs
    html_url = models.URLField()
    
    class Meta:
        db_table = 'github_profile'
        verbose_name = 'GitHub Profile'
        verbose_name_plural = 'GitHub Profiles'

    def __str__(self):
        return f"@{self.username}"

    @classmethod
    def get_profile(cls):
        """Get the singleton profile instance."""
        return cls.objects.first()
