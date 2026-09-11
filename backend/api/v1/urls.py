"""
API v1 URL configuration.
Routes all API endpoints for version 1 of the API.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter

# Import app URL configs
from apps.accounts.urls import urlpatterns as accounts_urls
from apps.hero.urls import urlpatterns as hero_urls
from apps.about.urls import urlpatterns as about_urls
from apps.skills.urls import urlpatterns as skills_urls
from apps.techstack.urls import urlpatterns as techstack_urls
from apps.projects.urls import urlpatterns as projects_urls
from apps.experience.urls import urlpatterns as experience_urls
from apps.education.urls import urlpatterns as education_urls
from apps.certifications.urls import urlpatterns as certifications_urls
from apps.services.urls import urlpatterns as services_urls
from apps.clients.urls import urlpatterns as clients_urls
from apps.testimonials.urls import urlpatterns as testimonials_urls
from apps.blogs.urls import urlpatterns as blogs_urls
from apps.contact.urls import urlpatterns as contact_urls
from apps.resume.urls import urlpatterns as resume_urls
from apps.socials.urls import urlpatterns as socials_urls
from apps.seo.urls import urlpatterns as seo_urls
from apps.analytics.urls import urlpatterns as analytics_urls
from apps.newsletter.urls import urlpatterns as newsletter_urls
from apps.timeline.urls import urlpatterns as timeline_urls
from apps.faqs.urls import urlpatterns as faqs_urls
from apps.achievements.urls import urlpatterns as achievements_urls
from apps.dashboard.urls import urlpatterns as dashboard_urls
from apps.search.urls import urlpatterns as search_urls
from apps.settings.urls import urlpatterns as settings_urls
from apps.github.urls import urlpatterns as github_urls
# SaaS apps removed - not applicable for single-owner portfolio CMS

app_name = 'api_v1'

urlpatterns = [
    # Authentication & Users
    path('auth/', include(accounts_urls)),
    
    # Hero Section
    path('hero/', include(hero_urls)),
    
    # About Section
    path('about/', include(about_urls)),
    
    # Skills
    path('skills/', include(skills_urls)),
    
    # Tech Stack
    path('tech-stack/', include(techstack_urls)),
    
    # Projects
    path('projects/', include(projects_urls)),
    
    # Experience
    path('experience/', include(experience_urls)),
    
    # Education
    path('education/', include(education_urls)),
    
    # Certifications
    path('certifications/', include(certifications_urls)),
    
    # Services
    path('services/', include(services_urls)),
    
    # Clients
    path('clients/', include(clients_urls)),
    
    # Testimonials
    path('testimonials/', include(testimonials_urls)),
    
    # Blog
    path('blog/', include(blogs_urls)),
    
    # Contact
    path('contact/', include(contact_urls)),
    
    # Resume
    path('resume/', include(resume_urls)),
    
    # Social Links
    path('socials/', include(socials_urls)),
    
    # SEO
    path('seo/', include(seo_urls)),
    
    # Analytics
    path('analytics/', include(analytics_urls)),
    
    # Newsletter
    path('newsletter/', include(newsletter_urls)),
    
    # Timeline
    path('timeline/', include(timeline_urls)),
    
    # FAQs
    path('faqs/', include(faqs_urls)),
    
    # Achievements
    path('achievements/', include(achievements_urls)),
    
    # Dashboard
    path('dashboard/', include(dashboard_urls)),
    
    # Search
    path('search/', include(search_urls)),
    
    # Site Settings
    path('settings/', include(settings_urls)),
    
    # GitHub Integration
    path('github/', include(github_urls)),
    
    # Admin API (separate namespace for admin operations)
    path('admin/', include('api.admin.urls')),
]
