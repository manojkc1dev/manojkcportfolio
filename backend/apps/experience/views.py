"""
Public Read-Only API Views for Career Milestones and Work Experience.
"""
from rest_framework import generics
from rest_framework.permissions import AllowAny
from .models import Experience
from .serializers import ExperienceSerializer


class ExperienceListView(generics.ListAPIView):
    """List all career milestones and educational achievements."""
    permission_classes = [AllowAny]
    serializer_class = ExperienceSerializer
    pagination_class = None

    def get_queryset(self):
        queryset = Experience.objects.all()
        exp_type = self.request.query_params.get('type')
        if exp_type:
            queryset = queryset.filter(type__iexact=exp_type)
        return queryset


class ExperienceDetailView(generics.RetrieveAPIView):
    """Retrieve a single experience record by id."""
    permission_classes = [AllowAny]
    serializer_class = ExperienceSerializer
    lookup_field = 'id'
    queryset = Experience.objects.all()
