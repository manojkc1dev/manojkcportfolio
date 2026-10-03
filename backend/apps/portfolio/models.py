import uuid
from django.db import models


class Project(models.Model):
    """
    Core project model capturing software engineering case studies,
    architectural highlights, proof badges, and metrics.
    """
    id = models.CharField(
        max_length=100,
        primary_key=True,
        help_text="Unique kebab-case slug identifier matching frontend (e.g., 'agritech')"
    )
    slug = models.SlugField(max_length=100, unique=True, db_index=True)
    title = models.CharField(max_length=255)
    tagline = models.CharField(max_length=255, blank=True, default='')
    description = models.TextField()
    category = models.CharField(max_length=100, default='backend', db_index=True)
    year = models.PositiveIntegerField(null=True, blank=True)
    status = models.CharField(max_length=50, default='live', db_index=True)
    visibility = models.CharField(
        max_length=20,
        choices=[('Published', 'Published'), ('Draft', 'Draft')],
        default='Published',
        db_index=True
    )
    featured = models.BooleanField(default=False, db_index=True)
    image = models.CharField(max_length=500, blank=True, default='')
    thumbnail = models.CharField(max_length=500, blank=True, default='')

    # Lists / Structured Data
    highlights = models.JSONField(default=list, blank=True, help_text="List of 3-5 highlight bullet strings")
    tech = models.JSONField(default=list, blank=True, help_text="List of technology names")
    languages = models.JSONField(default=list, blank=True, help_text="List of programming languages")
    links = models.JSONField(default=dict, blank=True, help_text="Links dictionary: live, github, caseStudy, apiDocs, etc.")
    gallery = models.JSONField(default=list, blank=True, help_text="Screenshot image paths")
    proof = models.JSONField(default=list, blank=True, help_text="Proof badges list")
    what_i_built = models.JSONField(default=list, blank=True)
    lessons_learned = models.JSONField(default=list, blank=True)
    related_projects = models.JSONField(default=list, blank=True)

    # Case Study Detailed Fields
    role = models.CharField(max_length=100, blank=True, default='')
    duration = models.CharField(max_length=100, blank=True, default='')
    client = models.CharField(max_length=255, blank=True, default='')
    industry = models.CharField(max_length=255, blank=True, default='')
    year_duration = models.CharField(max_length=100, blank=True, default='')
    short_description = models.TextField(blank=True, default='')
    full_case_study = models.TextField(blank=True, default='')
    live_url = models.URLField(max_length=500, blank=True, default='')
    github_url = models.URLField(max_length=500, blank=True, default='')
    case_study_url = models.CharField(max_length=255, blank=True, default='')
    api_docs_url = models.URLField(max_length=500, blank=True, default='')
    key_highlights = models.TextField(blank=True, default='')
    problem = models.TextField(blank=True, default='')
    solution = models.TextField(blank=True, default='')
    architecture = models.TextField(blank=True, default='', help_text="Mermaid.js diagram definition string")

    order = models.PositiveIntegerField(default=0, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', '-created_at']
        verbose_name = 'Project'
        verbose_name_plural = 'Projects'

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = self.id
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title} ({self.slug})"


class ProjectMetric(models.Model):
    """Specific measurable outcome achieved for a project."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='metrics_items')
    label = models.CharField(max_length=100)
    value = models.CharField(max_length=100)
    icon = models.CharField(
        max_length=50,
        blank=True,
        default='speed',
        choices=[
            ('speed', 'Speed'),
            ('users', 'Users'),
            ('db', 'Database'),
            ('payment', 'Payment'),
            ('uptime', 'Uptime')
        ]
    )
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'id']
        verbose_name = 'Project Metric'
        verbose_name_plural = 'Project Metrics'

    def __str__(self):
        return f"{self.project.slug}: {self.label} = {self.value}"


class ProjectChallenge(models.Model):
    """Deep-dive engineering challenge, approach, and outcome."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='challenges_items')
    title = models.CharField(max_length=255)
    problem = models.TextField()
    approach = models.TextField()
    outcome = models.TextField()
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'id']
        verbose_name = 'Project Challenge'
        verbose_name_plural = 'Project Challenges'

    def __str__(self):
        return f"{self.project.slug}: {self.title}"


class TechChoice(models.Model):
    """Architectural rationale behind technology selections."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='tech_choices_items')
    layer = models.CharField(max_length=100)
    choice = models.CharField(max_length=255)
    why = models.TextField()
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'id']
        verbose_name = 'Tech Choice'
        verbose_name_plural = 'Tech Choices'

    def __str__(self):
        return f"{self.project.slug}: {self.layer} - {self.choice}"
