from django.contrib import admin
from .models import Project, ProjectMetric, ProjectChallenge, TechChoice


class ProjectMetricInline(admin.TabularInline):
    model = ProjectMetric
    extra = 1


class ProjectChallengeInline(admin.StackedInline):
    model = ProjectChallenge
    extra = 1


class TechChoiceInline(admin.TabularInline):
    model = TechChoice
    extra = 1


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'id', 'category', 'status', 'visibility', 'featured', 'order')
    list_filter = ('category', 'status', 'visibility', 'featured')
    search_fields = ('title', 'id', 'description', 'tech')
    prepopulated_fields = {'slug': ('id',)}
    inlines = [ProjectMetricInline, ProjectChallengeInline, TechChoiceInline]


@admin.register(ProjectMetric)
class ProjectMetricAdmin(admin.ModelAdmin):
    list_display = ('project', 'label', 'value', 'icon', 'order')
    list_filter = ('icon',)
    search_fields = ('label', 'value', 'project__title')


@admin.register(ProjectChallenge)
class ProjectChallengeAdmin(admin.ModelAdmin):
    list_display = ('project', 'title', 'order')
    search_fields = ('title', 'problem', 'project__title')


@admin.register(TechChoice)
class TechChoiceAdmin(admin.ModelAdmin):
    list_display = ('project', 'layer', 'choice', 'order')
    search_fields = ('layer', 'choice', 'project__title')
