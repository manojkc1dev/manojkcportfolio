import uuid
from django.db import models


class SiteProfile(models.Model):
    """
    Main site owner identity, biography, contact coordinates, and CMS hero content.
    """
    id = models.CharField(
        max_length=50,
        primary_key=True,
        default='main',
        help_text="Single-instance primary key ('main')"
    )
    name = models.CharField(max_length=150, default='Manoj Khatri')
    title = models.CharField(max_length=200, default='Backend Software Engineer')
    tagline = models.CharField(
        max_length=255,
        default='Backend systems engineered for scale, security, and long-term reliability.'
    )
    bio = models.JSONField(
        default=list,
        blank=True,
        help_text="Array of bio paragraphs"
    )
    photo = models.CharField(max_length=500, default='/images/manoj.jpg')
    location = models.CharField(max_length=150, default='Kathmandu, Nepal')
    email = models.EmailField(default='manojkc1dev@gmail.com')
    phone = models.CharField(max_length=50, blank=True, default='+977 9842203976')
    availability = models.CharField(
        max_length=200,
        default='Open to remote freelance & junior backend roles'
    )
    resume_url = models.CharField(max_length=500, default='/resume.pdf')

    # Admin CMS Site Content extensions
    hero_badge = models.CharField(max_length=150, blank=True, default='')
    hero_title = models.CharField(max_length=255, blank=True, default='')
    hero_subtitle = models.TextField(blank=True, default='')
    primary_cta = models.CharField(max_length=100, blank=True, default='')
    secondary_cta = models.CharField(max_length=100, blank=True, default='')
    pillars = models.JSONField(default=list, blank=True, help_text="Core engineering pillars (title, description, focus)")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Site Profile'
        verbose_name_plural = 'Site Profiles'

    def __str__(self):
        return f"{self.name} - {self.title}"


class ProfileStat(models.Model):
    """Headline numerical achievement metric displayed on the hero/about page."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    profile = models.ForeignKey(SiteProfile, on_delete=models.CASCADE, related_name='stats_items')
    stat_id = models.CharField(max_length=50, help_text="Unique slug key, e.g. 'projects', 'speedup'")
    label = models.CharField(max_length=100)
    value = models.CharField(max_length=100)
    subtext = models.CharField(max_length=150, blank=True, default='')
    icon_name = models.CharField(max_length=50, default='Code2')
    order = models.PositiveIntegerField(default=0, db_index=True)

    class Meta:
        ordering = ['order', 'stat_id']
        verbose_name = 'Profile Stat'
        verbose_name_plural = 'Profile Stats'

    def __str__(self):
        return f"{self.label}: {self.value}"


class SocialLink(models.Model):
    """External social media and platform profiles."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    profile = models.ForeignKey(SiteProfile, on_delete=models.CASCADE, related_name='socials_items')
    name = models.CharField(max_length=100)
    url = models.URLField(max_length=500)
    icon = models.CharField(max_length=50, default='Github')
    handle = models.CharField(max_length=100, blank=True, default='')
    visible = models.BooleanField(default=True, db_index=True)
    order = models.PositiveIntegerField(default=0, db_index=True)

    class Meta:
        ordering = ['order', 'name']
        verbose_name = 'Social Link'
        verbose_name_plural = 'Social Links'

    def __str__(self):
        return f"{self.name} ({self.handle})"


class UseCategory(models.Model):
    """Categorization for workstation, IDE, hardware, and deployment tools."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=150)
    description = models.TextField(blank=True, default='')
    order = models.PositiveIntegerField(default=0, db_index=True)

    class Meta:
        ordering = ['order', 'title']
        verbose_name = 'Uses Category'
        verbose_name_plural = 'Uses Categories'

    def __str__(self):
        return self.title


class UseItem(models.Model):
    """Specific piece of software, hardware, or workflow tool."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    category = models.ForeignKey(UseCategory, on_delete=models.CASCADE, related_name='items')
    name = models.CharField(max_length=150)
    why = models.TextField()
    link = models.URLField(max_length=500, blank=True, default='')
    tag = models.CharField(max_length=100, blank=True, default='')
    order = models.PositiveIntegerField(default=0, db_index=True)

    class Meta:
        ordering = ['order', 'name']
        verbose_name = 'Uses Item'
        verbose_name_plural = 'Uses Items'

    def __str__(self):
        return f"{self.name} ({self.category.title})"


class CurrentItem(models.Model):
    """Currently building roadmap item displayed on homepage and projects view."""
    id = models.CharField(
        max_length=100,
        primary_key=True,
        help_text="Unique slug key (e.g. 'ats-resume-builder', 'portfolio-drf-backend')"
    )
    title = models.CharField(max_length=200)
    description = models.TextField()
    status = models.CharField(
        max_length=50,
        default='active',
        choices=[
            ('active', 'Active'),
            ('planned', 'Planned'),
            ('researching', 'Researching'),
        ],
        db_index=True
    )
    progress = models.PositiveIntegerField(default=0, help_text="Completion percentage (0-100)")
    related_project_id = models.CharField(max_length=100, blank=True, default='')
    since = models.CharField(max_length=50, default='')
    order = models.PositiveIntegerField(default=0, db_index=True)

    class Meta:
        ordering = ['order', 'id']
        verbose_name = 'Currently Building Item'
        verbose_name_plural = 'Currently Building Items'

    def __str__(self):
        return f"{self.title} [{self.status} - {self.progress}%]"
