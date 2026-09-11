"""
Project videos model.
"""
from django.db import models
from core.models import BaseModel, OrderableModel


class ProjectVideo(BaseModel, OrderableModel):
    """
    Videos for projects.
    """
    VIDEO_TYPE_CHOICES = [
        ('upload', 'Uploaded'),
        ('youtube', 'YouTube'),
        ('vimeo', 'Vimeo'),
        ('external', 'External URL'),
    ]

    project = models.ForeignKey(
        'projects.Project',
        on_delete=models.CASCADE,
        related_name='videos'
    )
    video_type = models.CharField(max_length=20, choices=VIDEO_TYPE_CHOICES, default='upload')
    video_file = models.FileField(upload_to='projects/videos/', blank=True, null=True)
    video_url = models.URLField(blank=True)
    thumbnail = models.ImageField(upload_to='projects/video_thumbnails/', blank=True, null=True)
    title = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)
    duration = models.CharField(max_length=20, blank=True, help_text='e.g., 5:30')

    class Meta:
        db_table = 'project_videos'
        verbose_name = 'Project Video'
        verbose_name_plural = 'Project Videos'
        ordering = ['order', '-created_at']

    def __str__(self):
        return f"{self.project.title} - {self.title or 'Video'}"
