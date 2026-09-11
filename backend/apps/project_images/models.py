"""
Project images model.
"""
from django.db import models
from core.models import BaseModel, OrderableModel


class ProjectImage(BaseModel, OrderableModel):
    """
    Individual images for projects.
    """
    project = models.ForeignKey(
        'projects.Project',
        on_delete=models.CASCADE,
        related_name='images'
    )
    image = models.ImageField(upload_to='projects/images/')
    alt_text = models.CharField(max_length=255, blank=True)
    caption = models.CharField(max_length=255, blank=True)
    is_cover = models.BooleanField(default=False)

    class Meta:
        db_table = 'project_images'
        verbose_name = 'Project Image'
        verbose_name_plural = 'Project Images'
        ordering = ['order', '-created_at']

    def __str__(self):
        return f"{self.project.title} - Image {self.order}"
