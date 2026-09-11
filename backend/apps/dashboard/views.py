"""
Views for dashboard app.
"""
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Count, Q
from django.utils import timezone
from datetime import timedelta
from django.contrib.auth import get_user_model
from django.core.cache import cache

from .serializers import DashboardAnalyticsSerializer
from .models import DashboardStats
from apps.projects.models import Project
from apps.contact.models import Contact
from apps.newsletter.models import Newsletter
from apps.blogs.models import Blog
from apps.skills.models import Skill
from apps.certifications.models import Certification
from apps.analytics.models import Analytics
from core.permissions import IsAdminOrSuperAdmin

User = get_user_model()


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminOrSuperAdmin])
def dashboard_analytics(request):
    """
    Get dashboard analytics for admin users.
    Returns aggregated statistics from all relevant models.
    Cached for 60 seconds to reduce database load.
    """
    cache_key = 'dashboard_analytics'
    cached_data = cache.get(cache_key)
    
    if cached_data:
        return Response({
            'success': True,
            'data': cached_data,
            'cached': True
        }, status=status.HTTP_200_OK)
    
    today = timezone.now().date()
    week_ago = today - timedelta(days=7)
    
    # Project metrics
    project_stats = Project.objects.aggregate(
        total_projects=Count('id'),
        published_projects=Count('id', filter=Q(status='published', is_active=True)),
        draft_projects=Count('id', filter=Q(status='draft', is_active=True))
    )
    
    # Visitor metrics
    visitor_stats = Analytics.objects.aggregate(
        total_visitors=Count('id'),
        unique_visitors=Count('ip_address', distinct=True)
    )
    
    # Contact metrics
    contact_stats = Contact.objects.aggregate(
        total_contacts=Count('id'),
        new_contacts=Count('id', filter=Q(contact_status='new')),
        replied_contacts=Count('id', filter=~Q(replied_at=None))
    )
    
    # Newsletter metrics
    newsletter_stats = Newsletter.objects.aggregate(
        total_subscribers=Count('id', filter=Q(is_subscribed=True)),
        verified_subscribers=Count('id', filter=Q(is_subscribed=True, is_verified=True))
    )
    
    # Blog metrics
    blog_stats = Blog.objects.aggregate(
        total_blogs=Count('id'),
        published_blogs=Count('id', filter=Q(status='published', is_active=True))
    )
    
    # Skills and certifications
    skills_count = Skill.objects.filter(is_active=True).count()
    certifications_count = Certification.objects.filter(is_active=True).count()
    
    # Geographic distribution (top 10 countries)
    visitor_countries = list(
        Analytics.objects
        .exclude(country='')
        .values('country')
        .annotate(count=Count('id'))
        .order_by('-count')[:10]
    )
    
    # Recent contacts (last 5)
    recent_contacts = list(
        Contact.objects
        .select_related('replied_by')
        .order_by('-created_at')[:5]
        .values(
            'id', 'name', 'email', 'subject', 'contact_status',
            'created_at', 'replied_at'
        )
    )
    
    # Recent projects (last 5)
    recent_projects = list(
        Project.objects
        .filter(is_active=True)
        .order_by('-created_at')[:5]
        .values(
            'id', 'title', 'status', 'visibility', 'is_featured',
            'created_at', 'view_count'
        )
    )
    
    # Recent blogs (last 5)
    recent_blogs = list(
        Blog.objects
        .filter(is_active=True)
        .order_by('-created_at')[:5]
        .values(
            'id', 'title', 'status', 'is_featured',
            'created_at', 'view_count'
        )
    )
    
    # Build response data
    analytics_data = {
        'total_projects': project_stats['total_projects'] or 0,
        'published_projects': project_stats['published_projects'] or 0,
        'draft_projects': project_stats['draft_projects'] or 0,
        'total_visitors': visitor_stats['total_visitors'] or 0,
        'unique_visitors': visitor_stats['unique_visitors'] or 0,
        'total_contacts': contact_stats['total_contacts'] or 0,
        'new_contacts': contact_stats['new_contacts'] or 0,
        'replied_contacts': contact_stats['replied_contacts'] or 0,
        'total_subscribers': newsletter_stats['total_subscribers'] or 0,
        'verified_subscribers': newsletter_stats['verified_subscribers'] or 0,
        'total_blogs': blog_stats['total_blogs'] or 0,
        'published_blogs': blog_stats['published_blogs'] or 0,
        'total_skills': skills_count,
        'total_certifications': certifications_count,
        'visitor_countries': visitor_countries,
        'recent_contacts': recent_contacts,
        'recent_projects': recent_projects,
        'recent_blogs': recent_blogs,
    }
    
    serializer = DashboardAnalyticsSerializer(analytics_data)
    
    # Cache the result for 60 seconds
    cache.set(cache_key, serializer.data, 60)
    
    return Response({
        'success': True,
        'data': serializer.data,
        'cached': False
    }, status=status.HTTP_200_OK)
