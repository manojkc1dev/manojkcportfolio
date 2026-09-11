"""
Resume model for portfolio CMS.
"""
from django.db import models
from core.models import BaseModel, StatusModel


class Resume(BaseModel, StatusModel):
    """
    Resume management with download tracking.
    """
    # File Information
    title = models.CharField(max_length=255, db_index=True)
    description = models.TextField(blank=True)
    
    # Files
    resume_file = models.FileField(upload_to='resumes/')
    file_type = models.CharField(
        max_length=10,
        choices=[
            ('pdf', 'PDF'),
            ('docx', 'DOCX'),
        ],
        default='pdf'
    )
    
    # Version
    version = models.CharField(max_length=20, default='1.0')
    is_default = models.BooleanField(default=False, db_index=True, help_text='Default resume to display')
    
    # Statistics
    download_count = models.PositiveIntegerField(default=0)
    last_downloaded_at = models.DateTimeField(null=True, blank=True)
    
    # Display
    show_on_homepage = models.BooleanField(default=True, db_index=True)
    
    class Meta:
        db_table = 'resumes'
        verbose_name = 'Resume'
        verbose_name_plural = 'Resumes'
        ordering = ['-is_default', '-version', '-created_at']
        indexes = [
            models.Index(fields=['is_default']),
            models.Index(fields=['status', 'is_active']),
        ]

    def __str__(self):
        return self.title

    def increment_download_count(self):
        """Increment download count."""
        from django.utils import timezone
        self.download_count += 1
        self.last_downloaded_at = timezone.now()
        self.save(update_fields=['download_count', 'last_downloaded_at'])
