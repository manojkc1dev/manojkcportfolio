"""
Social links model for portfolio CMS.
"""
from django.db import models
from core.models import BaseModel, StatusModel


class SocialLink(BaseModel, StatusModel):
    """
    Social media links and profiles.
    """
    PLATFORM_CHOICES = [
        ('github', 'GitHub'),
        ('linkedin', 'LinkedIn'),
        ('twitter', 'Twitter'),
        ('facebook', 'Facebook'),
        ('instagram', 'Instagram'),
        ('medium', 'Medium'),
        ('hashnode', 'Hashnode'),
        ('dev_to', 'Dev.to'),
        ('youtube', 'YouTube'),
        ('leetcode', 'LeetCode'),
        ('hackerrank', 'HackerRank'),
        ('codeforces', 'Codeforces'),
        ('stackoverflow', 'Stack Overflow'),
        ('email', 'Email'),
        ('phone', 'Phone'),
        ('whatsapp', 'WhatsApp'),
        ('telegram', 'Telegram'),
    ]
    
    platform = models.CharField(max_length=20, choices=PLATFORM_CHOICES, unique=True, db_index=True)
    url = models.URLField()
    username = models.CharField(max_length=100, blank=True)
    display_name = models.CharField(max_length=100, blank=True)
    icon = models.CharField(max_length=50, blank=True, help_text='Icon class')
    
    # Display
    show_on_homepage = models.BooleanField(default=True, db_index=True)
    order = models.PositiveIntegerField(default=0)
    
    class Meta:
        db_table = 'social_links'
        verbose_name = 'Social Link'
        verbose_name_plural = 'Social Links'
        ordering = ['order']
        indexes = [
            models.Index(fields=['platform']),
            models.Index(fields=['status', 'is_active']),
        ]

    def __str__(self):
        return self.get_platform_display()
