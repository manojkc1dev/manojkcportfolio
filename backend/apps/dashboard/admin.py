"""
Admin configuration for dashboard app.
"""
from django.contrib import admin
from django.utils.html import format_html
from .models import DashboardStats


@admin.register(DashboardStats)
class DashboardStatsAdmin(admin.ModelAdmin):
    """
    Admin interface for dashboard statistics.
    """
    list_display = [
        'stats_date', 'total_projects', 'published_projects', 'total_visitors',
        'total_contacts', 'total_downloads', 'total_subscribers'
    ]
    list_filter = ['stats_date']
    readonly_fields = [
        'id', 'stats_date', 'total_projects', 'published_projects', 'draft_projects',
        'total_visitors', 'unique_visitors', 'total_contacts', 'pending_contacts',
        'total_downloads', 'resume_downloads', 'total_blogs', 'published_blogs',
        'total_skills', 'total_certifications', 'total_subscribers', 'active_subscribers',
        'created_at', 'updated_at', 'created_by', 'updated_by'
    ]
    date_hierarchy = 'stats_date'
    
    def has_add_permission(self, request):
        return False
    
    def has_change_permission(self, request, obj=None):
        return False
    
    def has_delete_permission(self, request, obj=None):
        return request.user.is_superuser


class DashboardAdminSite(admin.AdminSite):
    """
    Custom admin site with dashboard overview.
    """
    site_header = 'Portfolio CMS'
    site_title = 'Portfolio CMS Admin'
    index_title = 'Welcome to Portfolio CMS'
    
    def index(self, request, extra_context=None):
        from apps.projects.models import Project
        from apps.blogs.models import Blog
        from apps.contact.models import Contact
        from apps.newsletter.models import Newsletter
        from apps.analytics.models import Analytics
        from django.utils import timezone
        from datetime import timedelta
        
        # Calculate statistics
        today = timezone.now().date()
        week_ago = today - timedelta(days=7)
        
        context = {
            'total_projects': Project.objects.filter(status='published').count(),
            'draft_projects': Project.objects.filter(status='draft').count(),
            'published_blogs': Blog.objects.filter(status='published').count(),
            'pending_contacts': Contact.objects.filter(contact_status='new').count(),
            'total_subscribers': Newsletter.objects.filter(is_subscribed=True).count(),
            'weekly_visitors': Analytics.objects.filter(created_at__gte=week_ago).count(),
        }
        
        extra_context = extra_context or {}
        extra_context.update(context)
        
        return super().index(request, extra_context)
