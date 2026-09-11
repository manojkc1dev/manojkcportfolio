"""
Project categories model.
"""
from django.db import models
from core.models import BaseModel, StatusModel, OrderableModel


class ProjectCategory(BaseModel, StatusModel, OrderableModel):
    """
    Categories for organizing projects.
    """
    name = models.CharField(max_length=100, unique=True, db_index=True)
    slug = models.SlugField(max_length=100, unique=True, db_index=True)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, blank=True, help_text='Icon class or emoji')
    color = models.CharField(max_length=7, blank=True, help_text='Hex color code')
    image = models.ImageField(upload_to='project_categories/', blank=True, null=True)
    is_featured = models.BooleanField(default=False, db_index=True)

    class Meta:
        db_table = 'project_categories'
        verbose_name = 'Project Category'
        verbose_name_plural = 'Project Categories'
        ordering = ['order', 'name']
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['status', 'is_active']),
        ]

    def __str__(self):
        return self.name
