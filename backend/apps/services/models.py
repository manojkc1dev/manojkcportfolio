from django.db import models


class Service(models.Model):
    """
    Professional backend engineering service offering.
    """
    id = models.CharField(
        max_length=100,
        primary_key=True,
        help_text="Unique slug identifier (e.g. 'backend-engineering', 'api-architecture')"
    )
    order = models.PositiveIntegerField(default=0, db_index=True)
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True, db_index=True)
    icon = models.CharField(max_length=100, default='Server')
    short_summary = models.TextField()
    detailed_scope = models.TextField(blank=True, default='')
    features = models.JSONField(default=list, blank=True, help_text="List of feature bullet points")
    deliverables = models.JSONField(default=list, blank=True, help_text="List of tangible deliverables")
    technologies = models.JSONField(default=list, blank=True, help_text="Relevant technologies list")
    visibility = models.CharField(
        max_length=20,
        choices=[('Published', 'Published'), ('Draft', 'Draft')],
        default='Published',
        db_index=True
    )
    featured = models.BooleanField(default=False, db_index=True)
    cover_image = models.CharField(max_length=500, blank=True, default='')
    meta_title = models.CharField(max_length=255, blank=True, default='')
    meta_description = models.TextField(blank=True, default='')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', 'title']
        verbose_name = 'Service'
        verbose_name_plural = 'Services'

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = self.id
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title
