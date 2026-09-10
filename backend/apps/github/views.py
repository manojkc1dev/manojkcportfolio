"""
Views for GitHub integration.
"""
from rest_framework import generics, serializers
from rest_framework.decorators import api_view, permission_classes
from drf_spectacular.utils import extend_schema
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from core.permissions import IsAdminOrSuperAdmin
from .models import GitHubRepository, GitHubContribution, GitHubProfile
from .serializers import (
    GitHubRepositorySerializer, GitHubContributionSerializer,
    GitHubProfileSerializer, PublicGitHubRepositorySerializer
)


class GitHubRepositoryListCreateView(generics.ListCreateAPIView):
    """
    List and create GitHub repositories (admin only).
    """
    queryset = GitHubRepository.objects.all()
    serializer_class = GitHubRepositorySerializer
    permission_classes = [IsAdminOrSuperAdmin]
    filterset_fields = ['is_featured', 'is_private', 'is_fork', 'language']
    search_fields = ['name', 'full_name', 'description']


class GitHubRepositoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a GitHub repository (admin only).
    """
    queryset = GitHubRepository.objects.all()
    serializer_class = GitHubRepositorySerializer
    permission_classes = [IsAdminOrSuperAdmin]
    lookup_field = 'repository_id'


class PublicGitHubRepositoryListView(generics.ListAPIView):
    """
    List public featured GitHub repositories.
    """
    queryset = GitHubRepository.objects.filter(is_featured=True, is_private=False)
    serializer_class = PublicGitHubRepositorySerializer
    permission_classes = [AllowAny]
    ordering = ['display_order', '-stars']


class GitHubContributionListCreateView(generics.ListCreateAPIView):
    """
    List and create GitHub contributions (admin only).
    """
    queryset = GitHubContribution.objects.select_related('repository')
    serializer_class = GitHubContributionSerializer
    permission_classes = [IsAdminOrSuperAdmin]
    filterset_fields = ['contribution_type', 'repository', 'date']


class GitHubProfileDetailView(generics.RetrieveUpdateAPIView):
    """
    Retrieve or update GitHub profile (admin only).
    """
    queryset = GitHubProfile.objects.all()
    serializer_class = GitHubProfileSerializer
    permission_classes = [IsAdminOrSuperAdmin]

    def get_object(self):
        """Get the profile instance."""
        profile = GitHubProfile.get_profile()
        if not profile:
            return None
        return profile


class PublicGitHubProfileView(generics.RetrieveAPIView):
    """
    Retrieve public GitHub profile.
    """
    serializer_class = GitHubProfileSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        """Get the profile instance."""
        profile = GitHubProfile.get_profile()
        if not profile:
            # Return empty response if no profile exists
            return None
        return profile

    def retrieve(self, request, *args, **kwargs):
        """Override retrieve to handle missing profile."""
        try:
            return super().retrieve(request, *args, **kwargs)
        except:
            return Response({'detail': 'GitHub profile not configured'}, status=404)


@extend_schema(
    request=None,
    responses={200: None}
)
@api_view(['GET'])
@permission_classes([AllowAny])
def github_stats(request):
    """
    Get aggregated GitHub statistics.
    """
    profile = GitHubProfile.get_profile()
    if not profile:
        return Response({
            'total_repos': 0,
            'total_stars': 0,
            'total_forks': 0,
            'followers': 0,
            'following': 0
        })

    repos = GitHubRepository.objects.filter(is_private=False)
    total_stars = sum(repo.stars for repo in repos)
    total_forks = sum(repo.forks for repo in repos)

    return Response({
        'total_repos': repos.count(),
        'total_stars': total_stars,
        'total_forks': total_forks,
        'followers': profile.followers,
        'following': profile.following,
        'public_repos': profile.public_repos
    })
