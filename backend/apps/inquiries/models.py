import uuid
from django.db import models


class Inquiry(models.Model):
    """
    Client inquiry submitted via the public contact form or project case-study CTA.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    email = models.EmailField(max_length=254)
    company = models.CharField(max_length=200, blank=True, default='')
    phone = models.CharField(max_length=50, blank=True, default='')
    has_whatsapp = models.BooleanField(default=True)
    scope_title = models.CharField(max_length=255, blank=True, default='Website Contact Inquiry')
    budget_range = models.CharField(max_length=100, blank=True, default='Standard Project')
    timeline = models.CharField(max_length=100, blank=True, default='Flexible')
    message = models.TextField()

    # Status Workflow
    status = models.CharField(
        max_length=50,
        default='New',
        choices=[
            ('New', 'New'),
            ('In Progress', 'In Progress'),
            ('Closed', 'Closed'),
            ('Won', 'Won'),
        ],
        db_index=True
    )
    read = models.BooleanField(default=False, db_index=True)
    replied = models.BooleanField(default=False, db_index=True)

    # Project Context
    project_id = models.CharField(max_length=100, blank=True, null=True, help_text="Referenced project slug")
    project_title = models.CharField(max_length=255, blank=True, default='')
    project_tag = models.CharField(max_length=100, blank=True, default='')
    source_page = models.CharField(max_length=500, blank=True, default='')

    # Security & Audit
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True, default='')

    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Inquiry'
        verbose_name_plural = 'Inquiries'

    def __str__(self):
        return f"{self.name} <{self.email}> - {self.scope_title} ({self.status})"
