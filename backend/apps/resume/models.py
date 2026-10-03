import uuid
from django.db import models


class ResumeDocument(models.Model):
    """
    Physical/binary uploaded PDF resume file streamed to public endpoints.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    file_name = models.CharField(max_length=255, default='Manoj_KC_Resume.pdf')
    mime_type = models.CharField(max_length=100, default='application/pdf')
    file_size = models.PositiveIntegerField(default=0, help_text="Size in bytes")
    file = models.FileField(upload_to='resumes/', blank=True, null=True)
    file_binary = models.BinaryField(blank=True, null=True, help_text="Direct binary payload backup")
    version_tag = models.CharField(max_length=50, blank=True, default='v1.0')
    is_active = models.BooleanField(default=True, db_index=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-uploaded_at']
        verbose_name = 'Resume Document'
        verbose_name_plural = 'Resume Documents'

    def __str__(self):
        active_str = " (Active)" if self.is_active else ""
        return f"{self.file_name} - {self.version_tag}{active_str}"


class ResumeDataRecord(models.Model):
    """
    Structured ATS resume builder state, section layout, and visual customizer parameters.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    version_tag = models.CharField(max_length=50, default='Production-2026')
    target_headline = models.CharField(
        max_length=255,
        default='Backend Software Engineer (Python / Django / PostgreSQL)'
    )
    summary_text = models.TextField(blank=True, default='')
    resume_url = models.CharField(max_length=500, default='/resume.pdf')
    file_name = models.CharField(max_length=255, default='Manoj_KC_Backend_Resume.pdf')

    # Visual customizer options (theme, fonts, spacing, paper format, margins)
    customization = models.JSONField(
        default=dict,
        blank=True,
        help_text="ATS Customization parameters: templateStyle, fontFamily, accentColor, spacingDensity, paperFormat, pageLayout, etc."
    )

    # Complete structured sections (Experience, Education, Projects, Skills, Certifications)
    sections_data = models.JSONField(
        default=list,
        blank=True,
        help_text="Array of ResumeSection objects with items, bullets, and badge tags"
    )

    is_active = models.BooleanField(default=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-is_active', '-updated_at']
        verbose_name = 'Resume Data Record'
        verbose_name_plural = 'Resume Data Records'

    def __str__(self):
        active_str = " (Active)" if self.is_active else ""
        return f"Resume State [{self.version_tag}]{active_str}"
