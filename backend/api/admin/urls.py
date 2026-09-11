"""
Admin API URL configuration.
All admin-specific endpoints are under /api/v1/admin/
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter

# Import existing app URL configs for admin operations
from apps.projects.urls import urlpatterns as projects_urls
from apps.techstack.urls import urlpatterns as techstack_urls
from apps.skills.urls import urlpatterns as skills_urls
from apps.hero.urls import urlpatterns as hero_urls
from apps.about.urls import urlpatterns as about_urls
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
from apps.media.urls import urlpatterns as media_urls
from apps.settings.urls import urlpatterns as settings_urls

app_name = 'admin_api'

urlpatterns = [
    # Projects
    path('projects/', include(projects_urls)),
    
    # Tech Stack
    path('tech-stack/', include(techstack_urls)),
    
    # Skills
    path('skills/', include(skills_urls)),
    
    # Hero
    path('hero/', include(hero_urls)),
    
    # About
    path('about/', include(about_urls)),
    
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
    
    # Blogs
    path('blogs/', include(blogs_urls)),
    
    # Contact
    path('contact/', include(contact_urls)),
    
    # Resume
    path('resume/', include(resume_urls)),
    
    # Social Links
    path('socials/', include(socials_urls)),
    
    # Media
    path('media/', include(media_urls)),
    
    # Settings
    path('settings/', include(settings_urls)),
]
