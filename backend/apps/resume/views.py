"""
Views for resume app.
"""
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from core.permissions import IsContentManagerOrAbove
from .models import Resume
from .serializers import ResumeSerializer, ResumeListSerializer


class ResumeListCreateView(generics.ListCreateAPIView):
    """
    List and create resumes.
    """
    queryset = Resume.objects.all()
    permission_classes = [AllowAny]
    filterset_fields = ['status', 'is_active', 'file_type', 'is_default', 'show_on_homepage']
    search_fields = ['title', 'description']
    ordering_fields = ['is_default', '-version', '-created_at']

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return ResumeListSerializer
        return ResumeSerializer

    def get_queryset(self):
        """Filter queryset based on user permissions."""
        queryset = super().get_queryset()
        
        if not self.request.user.is_authenticated:
            return queryset.filter(status='published', is_active=True, show_on_homepage=True)
        
        if not self.request.user.is_content_manager():
            return queryset.filter(status='published', is_active=True, show_on_homepage=True)
        
        return queryset


class ResumeDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a resume.
    """
    queryset = Resume.objects.all()
    serializer_class = ResumeSerializer
    permission_classes = [IsAuthenticated, IsContentManagerOrAbove]
    lookup_field = 'id'
