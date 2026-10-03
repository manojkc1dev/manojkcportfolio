"""
Public Read-Only API Views for Site Profile, Workstation Setup, and Active Building Roadmap.
"""
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from .models import SiteProfile, UseCategory, CurrentItem
from .serializers import SiteProfileSerializer, UseCategorySerializer, CurrentItemSerializer


class SiteProfileView(APIView):
    """Retrieve site owner profile with preloaded achievement stats and social platforms."""
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        profile = (
            SiteProfile.objects.prefetch_related('stats_items', 'socials_items')
            .filter(id='main')
            .first()
        )
        if not profile:
            profile = SiteProfile.objects.prefetch_related('stats_items', 'socials_items').first()
        if not profile:
            return Response({'detail': 'Site profile not configured.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = SiteProfileSerializer(profile)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UseCategoryListView(generics.ListAPIView):
    """List workstation categories with preloaded items."""
    permission_classes = [AllowAny]
    serializer_class = UseCategorySerializer
    pagination_class = None
    queryset = UseCategory.objects.prefetch_related('items').all()


class CurrentItemListView(generics.ListAPIView):
    """List active development initiatives."""
    permission_classes = [AllowAny]
    serializer_class = CurrentItemSerializer
    pagination_class = None

    def get_queryset(self):
        queryset = CurrentItem.objects.all()
        item_status = self.request.query_params.get('status')
        if item_status:
            queryset = queryset.filter(status__iexact=item_status)
        return queryset
