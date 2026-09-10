"""
Celery tasks for contact app.
"""
from celery import shared_task
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils import timezone
from django.conf import settings
import logging

logger = logging.getLogger(__name__)


@shared_task(
    bind=True,
    max_retries=3,
    default_retry_delay=60,
)
def send_contact_reply_email(self, contact_id, reply_message):
    """
    Send reply email to contact via Celery task.
    
    Args:
        contact_id: UUID of the contact record
        reply_message: Reply message to send
        
    Returns:
        dict: Status of email sending
    """
    from .models import Contact
    
    try:
        contact = Contact.objects.get(id=contact_id)
    except Contact.DoesNotExist:
        logger.error(f"Contact with id {contact_id} does not exist")
        return {'status': 'error', 'message': 'Contact not found'}
    
    # Prepare email context
    context = {
        'contact_name': contact.name,
        'original_subject': contact.subject,
        'original_message': contact.message,
        'reply_message': reply_message,
        'site_name': getattr(settings, 'SITE_NAME', 'Portfolio'),
    }
    
    # Render email templates
    try:
        html_message = render_to_string('contact/reply_email.html', context)
        plain_message = render_to_string('contact/reply_email.txt', context)
    except Exception as e:
        logger.error(f"Failed to render email templates: {str(e)}")
        # Update contact with failure
        contact.reply_email_status = 'failed'
        contact.failure_reason = f"Template rendering failed: {str(e)}"
        contact.save(update_fields=['reply_email_status', 'failure_reason'])
        return {'status': 'error', 'message': 'Template rendering failed'}
    
    # Send email
    try:
        # Sanitize subject to prevent email header injection
        safe_subject = (contact.subject or 'Your inquiry')
        # Remove CR/LF characters
        safe_subject = safe_subject.replace('\r', '').replace('\n', '')
        # Remove common email header injection keywords
        injection_keywords = ['Bcc:', 'Cc:', 'To:', 'Reply-To:', 'Content-Type:', 'MIME-Version:']
        for keyword in injection_keywords:
            safe_subject = safe_subject.split(keyword)[0]
        # Limit subject length
        safe_subject = safe_subject[:200].strip()
        
        send_mail(
            subject=f"Re: {safe_subject}",
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[contact.email],
            html_message=html_message,
            fail_silently=False,
        )
        
        # Update contact with success
        contact.reply_email_status = 'sent'
        contact.reply_email_sent_at = timezone.now()
        contact.failure_reason = ''
        contact.save(update_fields=['reply_email_status', 'reply_email_sent_at', 'failure_reason'])
        
        logger.info(f"Successfully sent reply email to {contact.email} for contact {contact_id}")
        return {'status': 'success', 'message': 'Email sent successfully'}
        
    except Exception as e:
        logger.error(f"Failed to send email to {contact.email}: {str(e)}")
        
        # Update contact with failure
        contact.reply_email_status = 'failed'
        contact.failure_reason = str(e)
        contact.save(update_fields=['reply_email_status', 'failure_reason'])
        
        # Retry on transient failures
        if self.request.retries < self.max_retries:
            logger.info(f"Retrying email send for contact {contact_id}, attempt {self.request.retries + 1}")
            raise self.retry(exc=e)
        
        return {'status': 'error', 'message': str(e)}
