"""
SEO model for portfolio CMS.
"""
from django.db import models
from core.models import BaseModel


class SEOSettings(BaseModel):
    """
    Global SEO settings for the portfolio.
    """
    # Site Information
    site_title = models.CharField(max_length=255, default='Portfolio')
    meta_description = models.TextField(blank=True)
    meta_keywords = models.CharField(max_length=255, blank=True)
    
    # Open Graph
    og_image = models.ImageField(upload_to='seo/og/', blank=True, null=True)
    og_title = models.CharField(max_length=255, blank=True)
    og_description = models.TextField(blank=True)
    
    # Twitter Card
    twitter_card = models.CharField(
        max_length=20,
        choices=[
            ('summary', 'Summary'),
            ('summary_large_image', 'Summary Large Image'),
            ('app', 'App'),
            ('player', 'Player'),
        ],
        default='summary'
    )
    twitter_image = models.ImageField(upload_to='seo/twitter/', blank=True, null=True)
    twitter_title = models.CharField(max_length=255, blank=True)
    twitter_description = models.TextField(blank=True)
    
    # Technical SEO
    canonical_url = models.URLField(blank=True)
    robots_txt = models.TextField(blank=True, help_text='Robots.txt content')
    
    # Schema.org
    schema_org_type = models.CharField(max_length=50, default='Person')
    schema_org_json = models.JSONField(default=dict, blank=True, help_text='Schema.org JSON-LD data')
    
    # Sitemap
    sitemap_enabled = models.BooleanField(default=True)
    
    # Analytics
    google_analytics_id = models.CharField(max_length=50, blank=True)
    google_tag_manager_id = models.CharField(max_length=50, blank=True)
    
    class Meta:
        db_table = 'seo_settings'
        verbose_name = 'SEO Settings'
        verbose_name_plural = 'SEO Settings'

    def __str__(self):
        return self.site_title
