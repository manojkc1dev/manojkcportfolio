"""
Project gallery model for multiple images.
"""
from django.db import models
from core.models import BaseModel


class ProjectGallery(BaseModel):
    """
    Gallery for projects with multiple images.
    """
    project = models.OneToOneField(
        'projects.Project',
        on_delete=models.CASCADE,
        related_name='gallery'
    )
    title = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)

    class Meta:
        db_table = 'project_galleries'
        verbose_name = 'Project Gallery'
        verbose_name_plural = 'Project Galleries'

    def __str__(self):
        return f"{self.project.title} Gallery"
