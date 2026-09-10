"""
Celery tasks for dashboard app.
"""
import logging
from celery import shared_task
from django.db.models import Count, Q
from django.utils import timezone
from django.contrib.auth import get_user_model

from .models import DashboardStats
from apps.projects.models import Project
from apps.contact.models import Contact
from apps.newsletter.models import Newsletter
from apps.blogs.models import Blog
from apps.skills.models import Skill
from apps.certifications.models import Certification
from apps.analytics.models import Analytics

logger = logging.getLogger(__name__)
User = get_user_model()


@shared_task(
    bind=True,
    max_retries=3,
    default_retry_delay=60,
)
def calculate_dashboard_stats(self):
    """
    Calculate and store daily dashboard statistics.
    This task is designed to be run by Celery Beat daily.
    """
    try:
        today = timezone.now().date()
        
        # Check if stats already exist for today
        existing_stats = DashboardStats.objects.filter(stats_date=today).first()
        if existing_stats:
            logger.info(f"Dashboard stats already exist for {today}, skipping calculation")
            return {
                'status': 'skipped',
                'message': f'Stats already exist for {today}',
                'stats_date': str(today)
            }
        
        # Calculate project statistics
        project_stats = Project.objects.aggregate(
            total_projects=Count('id'),
            published_projects=Count('id', filter=Q(status='published', is_active=True)),
            draft_projects=Count('id', filter=Q(status='draft', is_active=True))
        )
        
        # Calculate visitor statistics
        visitor_stats = Analytics.objects.filter(
            created_at__date=today
        ).aggregate(
            total_visitors=Count('id'),
            unique_visitors=Count('ip_address', distinct=True)
        )
        
        # Calculate contact statistics
        contact_stats = Contact.objects.aggregate(
            total_contacts=Count('id'),
            pending_contacts=Count('id', filter=Q(contact_status='new'))
        )
        
        # Calculate download statistics (placeholder - no tracking model exists)
        download_stats = {
            'total_downloads': 0,
            'resume_downloads': 0
        }
        
        # Calculate blog statistics
        blog_stats = Blog.objects.aggregate(
            total_blogs=Count('id'),
            published_blogs=Count('id', filter=Q(status='published', is_active=True))
        )
        
        # Calculate skills and certifications
        skills_count = Skill.objects.filter(is_active=True).count()
        certifications_count = Certification.objects.filter(is_active=True).count()
        
        # Calculate newsletter statistics
        newsletter_stats = Newsletter.objects.aggregate(
            total_subscribers=Count('id', filter=Q(is_subscribed=True)),
            active_subscribers=Count('id', filter=Q(is_subscribed=True, is_verified=True))
        )
        
        # Create or update dashboard stats
        dashboard_stats, created = DashboardStats.objects.update_or_create(
            stats_date=today,
            defaults={
                'total_projects': project_stats['total_projects'] or 0,
                'published_projects': project_stats['published_projects'] or 0,
                'draft_projects': project_stats['draft_projects'] or 0,
                'total_visitors': visitor_stats['total_visitors'] or 0,
                'unique_visitors': visitor_stats['unique_visitors'] or 0,
                'total_contacts': contact_stats['total_contacts'] or 0,
                'pending_contacts': contact_stats['pending_contacts'] or 0,
                'total_downloads': download_stats['total_downloads'],
                'resume_downloads': download_stats['resume_downloads'],
                'total_blogs': blog_stats['total_blogs'] or 0,
                'published_blogs': blog_stats['published_blogs'] or 0,
                'total_skills': skills_count,
                'total_certifications': certifications_count,
                'total_subscribers': newsletter_stats['total_subscribers'] or 0,
                'active_subscribers': newsletter_stats['active_subscribers'] or 0,
            }
        )
        
        logger.info(
            f"Dashboard stats {'created' if created else 'updated'} for {today}: "
            f"{project_stats['total_projects']} projects, "
            f"{visitor_stats['total_visitors']} visitors, "
            f"{contact_stats['total_contacts']} contacts"
        )
        
        return {
            'status': 'success',
            'message': f'Dashboard stats calculated for {today}',
            'stats_date': str(today),
            'created': created,
            'metrics': {
                'projects': project_stats['total_projects'],
                'visitors': visitor_stats['total_visitors'],
                'contacts': contact_stats['total_contacts'],
            }
        }
        
    except Exception as exc:
        logger.error(f"Error calculating dashboard stats: {exc}")
        raise self.retry(exc=exc)
