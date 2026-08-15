"""
Project technologies model for many-to-many relationship.
"""
from django.db import models
from core.models import BaseModel


class ProjectTechnology(BaseModel):
    """
    Technologies used in projects.
    """
    project = models.ForeignKey(
        'projects.Project',
        on_delete=models.CASCADE,
        related_name='technologies'
    )
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=50, blank=True, help_text='e.g., Frontend, Backend, Database')
    version = models.CharField(max_length=50, blank=True)
    icon = models.CharField(max_length=50, blank=True)
    url = models.URLField(blank=True)

    class Meta:
        db_table = 'project_technologies'
        verbose_name = 'Project Technology'
        verbose_name_plural = 'Project Technologies'
        ordering = ['name']

    def __str__(self):
        return f"{self.project.title} - {self.name}"
