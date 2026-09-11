"""
Project features model.
"""
from django.db import models
from core.models import BaseModel, OrderableModel


class ProjectFeature(BaseModel, OrderableModel):
    """
    Features for projects.
    """
    project = models.ForeignKey(
        'projects.Project',
        on_delete=models.CASCADE,
        related_name='features'
    )
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, blank=True, help_text='Icon class or emoji')

    class Meta:
        db_table = 'project_features'
        verbose_name = 'Project Feature'
        verbose_name_plural = 'Project Features'
        ordering = ['order', '-created_at']

    def __str__(self):
        return f"{self.project.title} - {self.title}"
