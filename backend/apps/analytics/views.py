"""
Views for analytics app.
"""
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from core.permissions import IsContentManagerOrAbove
from .models import Analytics
from .serializers import AnalyticsSerializer, AnalyticsListSerializer


class AnalyticsListCreateView(generics.ListCreateAPIView):
    """
    List and create analytics entries.
    """
    queryset = Analytics.objects.all()
    permission_classes = [IsAuthenticated, IsContentManagerOrAbove]
    filterset_fields = ['country', 'device_type', 'browser', 'source']
    search_fields = ['ip_address', 'session_id', 'referrer']
    ordering_fields = ['created_at']

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return AnalyticsListSerializer
        return AnalyticsSerializer


class AnalyticsDetailView(generics.RetrieveAPIView):
    """
    Retrieve analytics entry.
    """
    queryset = Analytics.objects.all()
    serializer_class = AnalyticsSerializer
    permission_classes = [IsAuthenticated, IsContentManagerOrAbove]
    lookup_field = 'id'
