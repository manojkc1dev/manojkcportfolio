"""
FAQs model for portfolio CMS.
"""
from django.db import models
from core.models import BaseModel, StatusModel, OrderableModel


class FAQCategory(BaseModel, StatusModel, OrderableModel):
    """
    FAQ categories for organizing questions.
    """
    name = models.CharField(max_length=100, db_index=True)
    slug = models.SlugField(max_length=100, unique=True, db_index=True)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, blank=True)
    
    class Meta:
        db_table = 'faq_categories'
        verbose_name = 'FAQ Category'
        verbose_name_plural = 'FAQ Categories'
        ordering = ['order', 'name']
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['status', 'is_active']),
        ]

    def __str__(self):
        return self.name


class FAQ(BaseModel, StatusModel, OrderableModel):
    """
    Frequently asked questions.
    """
    question = models.CharField(max_length=500, db_index=True)
    answer = models.TextField()
    category = models.ForeignKey(
        FAQCategory,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='faqs'
    )
    
    # Display
    show_on_homepage = models.BooleanField(default=True, db_index=True)
    is_featured = models.BooleanField(default=False, db_index=True)
    
    class Meta:
        db_table = 'faqs'
        verbose_name = 'FAQ'
        verbose_name_plural = 'FAQs'
        ordering = ['-is_featured', 'order']
        indexes = [
            models.Index(fields=['category']),
            models.Index(fields=['status', 'is_active']),
            models.Index(fields=['is_featured']),
        ]

    def __str__(self):
        return self.question
