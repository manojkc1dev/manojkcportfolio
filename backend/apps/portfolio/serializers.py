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


class ProjectAdminSerializer(serializers.ModelSerializer):
    """
    Comprehensive serializer for administrative Project creation, updates, and case study management.
    Supports nested metrics, challenges, and tech choices, plus camelCase and snake_case field mappings.
    """
    metrics = ProjectMetricSerializer(source='metrics_items', many=True, required=False)
    challenges = ProjectChallengeSerializer(source='challenges_items', many=True, required=False)
    techStackTable = TechChoiceSerializer(source='tech_choices_items', many=True, required=False)

    shortDescription = serializers.CharField(source='short_description', required=False, allow_blank=True)
    fullCaseStudy = serializers.CharField(source='full_case_study', required=False, allow_blank=True)
    liveUrl = serializers.CharField(source='live_url', required=False, allow_blank=True)
    githubUrl = serializers.CharField(source='github_url', required=False, allow_blank=True)
    caseStudyUrl = serializers.CharField(source='case_study_url', required=False, allow_blank=True)
    apiDocsUrl = serializers.CharField(source='api_docs_url', required=False, allow_blank=True)
    yearDuration = serializers.CharField(source='year_duration', required=False, allow_blank=True)
    keyHighlights = serializers.CharField(source='key_highlights', required=False, allow_blank=True)

    class Meta:
        model = Project
        fields = (
            'id',
            'slug',
            'title',
            'tagline',
            'description',
            'short_description',
            'shortDescription',
            'full_case_study',
            'fullCaseStudy',
            'category',
            'year',
            'status',
            'visibility',
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
            'year_duration',
            'yearDuration',
            'live_url',
            'liveUrl',
            'github_url',
            'githubUrl',
            'case_study_url',
            'caseStudyUrl',
            'api_docs_url',
            'apiDocsUrl',
            'key_highlights',
            'keyHighlights',
            'problem',
            'solution',
            'architecture',
            'what_i_built',
            'lessons_learned',
            'related_projects',
            'metrics',
            'challenges',
            'techStackTable',
            'order',
            'created_at',
            'updated_at',
        )

    def create(self, validated_data):
        metrics_data = validated_data.pop('metrics_items', [])
        challenges_data = validated_data.pop('challenges_items', [])
        tech_choices_data = validated_data.pop('tech_choices_items', [])

        if not validated_data.get('slug'):
            validated_data['slug'] = validated_data.get('id', '')

        project = Project.objects.create(**validated_data)

        for m in metrics_data:
            ProjectMetric.objects.create(project=project, **m)
        for c in challenges_data:
            ProjectChallenge.objects.create(project=project, **c)
        for tc in tech_choices_data:
            TechChoice.objects.create(project=project, **tc)

        return project

    def update(self, instance, validated_data):
        metrics_data = validated_data.pop('metrics_items', None)
        challenges_data = validated_data.pop('challenges_items', None)
        tech_choices_data = validated_data.pop('tech_choices_items', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if metrics_data is not None:
            instance.metrics_items.all().delete()
            for m in metrics_data:
                ProjectMetric.objects.create(project=instance, **m)

        if challenges_data is not None:
            instance.challenges_items.all().delete()
            for c in challenges_data:
                ProjectChallenge.objects.create(project=instance, **c)

        if tech_choices_data is not None:
            instance.tech_choices_items.all().delete()
            for tc in tech_choices_data:
                TechChoice.objects.create(project=instance, **tc)

        return instance

