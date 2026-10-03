import uuid
from django.db import models


class ArticleTag(models.Model):
    """Topic tag for categorizing technical articles."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=50, unique=True)
    slug = models.SlugField(max_length=50, unique=True)

    class Meta:
        ordering = ['name']
        verbose_name = 'Article Tag'
        verbose_name_plural = 'Article Tags'

    def __str__(self):
        return self.name


class Article(models.Model):
    """
    Technical engineering post, case-study breakdown, or tutorial.
    """
    id = models.CharField(
        max_length=150,
        primary_key=True,
        help_text="Unique slug identifier (e.g. 'django-postgresql-performance')"
    )
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, db_index=True)
    category = models.CharField(max_length=100, default='Backend Architecture', db_index=True)
    date = models.CharField(max_length=50, blank=True, default='', help_text="Display date string")
    published_date = models.DateField(null=True, blank=True)
    visibility = models.CharField(
        max_length=20,
        choices=[('Published', 'Published'), ('Draft', 'Draft')],
        default='Published',
        db_index=True
    )
    featured = models.BooleanField(default=False, db_index=True)
    excerpt = models.TextField(help_text="Short abstract/summary for cards and search")
    content = models.TextField(help_text="Full markdown article content")
    header_image = models.CharField(max_length=500, blank=True, default='')
    author_name = models.CharField(max_length=100, default='Manoj Khatri')
    author_role = models.CharField(max_length=100, default='Backend Software Engineer')
    read_time_minutes = models.PositiveIntegerField(default=5)

    # Tags can be linked relationally or serialized as string list
    tags = models.ManyToManyField(ArticleTag, blank=True, related_name='articles')
    tags_list = models.JSONField(default=list, blank=True, help_text="Cached list of tag names for rapid JSON response")

    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-published_date', '-created_at']
        verbose_name = 'Article'
        verbose_name_plural = 'Articles'

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = self.id
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title
