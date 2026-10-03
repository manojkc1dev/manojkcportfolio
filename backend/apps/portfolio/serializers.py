"""
Serializers for Portfolio Projects, Metrics, Challenges, and Architectural Tech Choices.
"""
from rest_framework import serializers
from .models import Project, ProjectMetric, ProjectChallenge, TechChoice


class ProjectMetricSerializer(serializers.ModelSerializer):
    """Specific measurable outcome achieved for a project."""

    class Meta:
        model = ProjectMetric
        fields = ('label', 'value', 'icon')


class ProjectChallengeSerializer(serializers.ModelSerializer):
    """Deep-dive engineering challenge, approach, and outcome."""

    class Meta:
        model = ProjectChallenge
        fields = ('title', 'problem', 'approach', 'outcome')


class TechChoiceSerializer(serializers.ModelSerializer):
    """Architectural rationale behind technology selections."""

    class Meta:
        model = TechChoice
        fields = ('layer', 'choice', 'why')


class ProjectListSerializer(serializers.ModelSerializer):
    """Compact project card serializer for showcase lists and landing page widgets."""

    class Meta:
        model = Project
        fields = (
            'id',
            'slug',
            'title',
            'tagline',
            'description',
            'category',
            'year',
            'status',
            'featured',
            'image',
            'thumbnail',
            'highlights',
            'tech',
            'languages',
            'links',
            'order',
        )


class ProjectDetailSerializer(serializers.ModelSerializer):
    """
    Exhaustive case-study serializer mapping Django snake_case to frontend camelCase
    with nested metrics, challenges, and tech choices.
    """
    metrics = ProjectMetricSerializer(source='metrics_items', many=True, read_only=True)
    challenges = ProjectChallengeSerializer(source='challenges_items', many=True, read_only=True)
    techStackTable = TechChoiceSerializer(source='tech_choices_items', many=True, read_only=True)

    # CamelCase aliases matching src/types.ts: Project interface
    whatIBuilt = serializers.JSONField(source='what_i_built', read_only=True)
    lessonsLearned = serializers.JSONField(source='lessons_learned', read_only=True)
    relatedProjects = serializers.JSONField(source='related_projects', read_only=True)
    liveUrl = serializers.URLField(source='live_url', read_only=True)
    githubUrl = serializers.URLField(source='github_url', read_only=True)
    caseStudyUrl = serializers.CharField(source='case_study_url', read_only=True)
    apiDocsUrl = serializers.URLField(source='api_docs_url', read_only=True)

    class Meta:
        model = Project
        fields = (
            'id',
            'slug',
            'title',
            'tagline',
            'description',
            'category',
            'year',
            'status',
            'featured',
            'image',
            'thumbnail',
            'highlights',
            'tech',
            'languages',
            'links',
            'gallery',
            'proof',
            'role',
            'duration',
            'client',
            'industry',
            'problem',
            'solution',
            'architecture',
            'whatIBuilt',
            'lessonsLearned',
            'relatedProjects',
            'liveUrl',
            'githubUrl',
            'caseStudyUrl',
            'apiDocsUrl',
            'metrics',
            'challenges',
            'techStackTable',
            'order',
        )
