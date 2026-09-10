"""
Contact model for portfolio CMS.
"""
from django.db import models
from core.models import BaseModel, StatusModel


class Contact(BaseModel, StatusModel):
    """
    Contact form submissions with spam detection.
    """
    STATUS_CHOICES = [
        ('new', 'New'),
        ('in_progress', 'In Progress'),
        ('resolved', 'Resolved'),
        ('spam', 'Spam'),
    ]
    
    REPLY_EMAIL_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('sent', 'Sent'),
        ('failed', 'Failed'),
    ]
    
    # Contact Information
    name = models.CharField(max_length=255, db_index=True)
    email = models.EmailField(db_index=True)
    phone = models.CharField(max_length=20, blank=True)
    subject = models.CharField(max_length=255, blank=True)
    message = models.TextField()
    
    # Tracking
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    country = models.CharField(max_length=100, blank=True)
    browser = models.CharField(max_length=255, blank=True)
    device = models.CharField(max_length=100, blank=True)
    user_agent = models.TextField(blank=True)
    
    # Status
    contact_status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new')
    
    # Response
    reply = models.TextField(blank=True)
    replied_at = models.DateTimeField(null=True, blank=True)
    replied_by = models.ForeignKey(
        'accounts.User',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='replied_contacts'
    )
    
    # Email Delivery Tracking
    reply_email_status = models.CharField(
        max_length=20,
        choices=REPLY_EMAIL_STATUS_CHOICES,
        default='pending',
        blank=True
    )
    reply_email_sent_at = models.DateTimeField(null=True, blank=True)
    failure_reason = models.TextField(blank=True)
    
    # Flags
    is_starred = models.BooleanField(default=False, db_index=True)
    is_spam = models.BooleanField(default=False, db_index=True)
    spam_score = models.DecimalField(max_digits=3, decimal_places=2, default=0, help_text='Spam detection score')
    
    class Meta:
        db_table = 'contacts'
        verbose_name = 'Contact'
        verbose_name_plural = 'Contacts'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['contact_status']),
            models.Index(fields=['is_spam']),
            models.Index(fields=['is_starred']),
            models.Index(fields=['created_at']),
        ]

    def __str__(self):
        return f"{self.name} - {self.subject}"
