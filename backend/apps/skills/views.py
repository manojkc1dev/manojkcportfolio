"""
Public Read-Only API Views for Skills and Technical Proficiencies.
"""
from rest_framework import generics
from rest_framework.permissions import AllowAny
from .models import SkillCategory
from .serializers import SkillCategorySerializer


class SkillCategoryListView(generics.ListAPIView):
    """List all technical skill categories with preloaded nested skills."""
    permission_classes = [AllowAny]
    serializer_class = SkillCategorySerializer
    pagination_class = None
    queryset = SkillCategory.objects.prefetch_related('skills').all()
