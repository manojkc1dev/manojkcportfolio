import uuid
from django.db import models


class SkillCategory(models.Model):
    """Grouping for technical skills (e.g. Backend & APIs, Databases, DevOps)."""
    id = models.CharField(
        max_length=100,
        primary_key=True,
        help_text="Unique slug identifier (e.g., 'backend', 'databases')"
    )
    title = models.CharField(max_length=150)
    category = models.CharField(max_length=150, blank=True, default='')
    description = models.TextField(blank=True, default='')
    order = models.PositiveIntegerField(default=0, db_index=True)

    class Meta:
        ordering = ['order', 'title']
        verbose_name = 'Skill Category'
        verbose_name_plural = 'Skill Categories'

    def save(self, *args, **kwargs):
        if not self.category:
            self.category = self.title
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class SkillItem(models.Model):
    """Specific skill, library, tool, or runtime."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    category = models.ForeignKey(SkillCategory, on_delete=models.CASCADE, related_name='skills')
    name = models.CharField(max_length=100)
    icon_name = models.CharField(max_length=100, blank=True, default='')
    highlight = models.BooleanField(default=False, db_index=True)
    proficiency = models.CharField(
        max_length=50,
        default='Advanced',
        choices=[
            ('Advanced', 'Advanced'),
            ('Intermediate', 'Intermediate'),
            ('Learning', 'Learning'),
        ]
    )
    level = models.CharField(
        max_length=50,
        default='advanced',
        choices=[
            ('learning', 'Learning'),
            ('intermediate', 'Intermediate'),
            ('advanced', 'Advanced'),
            ('expert', 'Expert'),
        ]
    )
    years = models.FloatField(null=True, blank=True)
    order = models.PositiveIntegerField(default=0, db_index=True)

    class Meta:
        ordering = ['order', 'name']
        verbose_name = 'Skill Item'
        verbose_name_plural = 'Skill Items'

    def __str__(self):
        return f"{self.name} ({self.category.title})"
