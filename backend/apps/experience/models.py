from django.db import models


class Experience(models.Model):
    """
    Work history, internships, freelance engagements, and academic degrees.
    """
    id = models.CharField(
        max_length=100,
        primary_key=True,
        help_text="Unique slug identifier (e.g., 'sajha-infotech', 'tu-bit')"
    )
    role = models.CharField(max_length=200)
    company = models.CharField(max_length=200)
    company_url = models.URLField(max_length=500, blank=True, default='')
    period = models.CharField(max_length=100, help_text="Display date range, e.g. 'Jul 2024 – Dec 2024'")
    start = models.CharField(max_length=50, blank=True, default='')
    end = models.CharField(max_length=50, blank=True, default='present')
    location = models.CharField(max_length=150, default='Kathmandu, Nepal')
    type = models.CharField(
        max_length=50,
        default='fulltime',
        choices=[
            ('fulltime', 'Full Time'),
            ('internship', 'Internship'),
            ('freelance', 'Freelance'),
            ('education', 'Education'),
        ],
        db_index=True
    )
    description = models.TextField(blank=True, default='')
    bullets = models.JSONField(default=list, blank=True, help_text="List of achievement bullet points")
    tech = models.JSONField(default=list, blank=True, help_text="List of technologies used")
    order = models.PositiveIntegerField(default=0, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', '-created_at']
        verbose_name = 'Experience'
        verbose_name_plural = 'Experiences'

    def __str__(self):
        return f"{self.role} at {self.company} ({self.period})"
