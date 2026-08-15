"""
Tech Stack model for portfolio CMS.
"""
from django.db import models
from core.models import BaseModel, StatusModel, OrderableModel


class TechStackCategory(BaseModel, StatusModel, OrderableModel):
    """
    Categories for organizing technology stack items.
    """
    CATEGORY_TYPES = [
        ('language', 'Programming Language'),
        ('framework', 'Framework'),
        ('library', 'Library'),
        ('database', 'Database'),
        ('cloud', 'Cloud Service'),
        ('devops', 'DevOps Tool'),
        ('tool', 'Tool'),
        ('testing', 'Testing Tool'),
        ('ai', 'AI/ML'),
        ('data', 'Data Science'),
    ]
    
    name = models.CharField(max_length=100, db_index=True)
    slug = models.SlugField(max_length=100, unique=True, db_index=True)
    category_type = models.CharField(max_length=20, choices=CATEGORY_TYPES, default='tool')
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, blank=True)
    color = models.CharField(max_length=7, blank=True, help_text='Hex color code')
    
    class Meta:
        db_table = 'tech_stack_categories'
        verbose_name = 'Tech Stack Category'
        verbose_name_plural = 'Tech Stack Categories'
        ordering = ['order', 'name']
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['category_type']),
        ]

    def __str__(self):
        return self.name


class TechStackItem(BaseModel, StatusModel, OrderableModel):
    """
    Individual technology stack item.
    """
    name = models.CharField(max_length=100, db_index=True)
    slug = models.SlugField(max_length=100, unique=True, db_index=True)
    category = models.ForeignKey(
        TechStackCategory,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='items'
    )
    
    # Visual
    icon = models.CharField(max_length=50, blank=True, help_text='Icon class')
    svg = models.TextField(blank=True, help_text='SVG code')
    image = models.ImageField(upload_to='techstack/', blank=True, null=True)
    color = models.CharField(max_length=7, blank=True, help_text='Hex color code')
    
    # Links
    official_website = models.URLField(blank=True)
    documentation_url = models.URLField(blank=True)
    
    # Experience
    skill_level = models.CharField(
        max_length=20,
        choices=[
            ('beginner', 'Beginner'),
            ('intermediate', 'Intermediate'),
            ('advanced', 'Advanced'),
            ('expert', 'Expert'),
        ],
        default='intermediate'
    )
    experience_years = models.PositiveIntegerField(default=0)
    
    # Display
    display_order = models.PositiveIntegerField(default=0)
    show_on_homepage = models.BooleanField(default=True, db_index=True)
    is_featured = models.BooleanField(default=False, db_index=True)
    
    class Meta:
        db_table = 'tech_stack_items'
        verbose_name = 'Tech Stack Item'
        verbose_name_plural = 'Tech Stack Items'
        ordering = ['-is_featured', 'display_order', 'order']
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['category']),
            models.Index(fields=['status', 'is_active']),
            models.Index(fields=['is_featured']),
            models.Index(fields=['status', 'show_on_homepage', 'is_active']),
            models.Index(fields=['skill_level']),
        ]

    def __str__(self):
        return self.name
