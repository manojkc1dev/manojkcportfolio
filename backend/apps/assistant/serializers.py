"""
Assistant Serializers

Input/output schemas for the three assistant API endpoints.
"""
from rest_framework import serializers


# ── Query endpoint ─────────────────────────────────────────────────────────────

class AssistantQueryInputSerializer(serializers.Serializer):
    """POST /api/v1/assistant/query/"""
    query = serializers.CharField(
        min_length=1,
        max_length=500,
        trim_whitespace=True,
        help_text='User question text (max 500 chars).',
    )


class SuggestedActionSerializer(serializers.Serializer):
    label = serializers.CharField()
    action_type = serializers.ChoiceField(choices=['link', 'query'])
    target = serializers.CharField()


class AssistantQueryResponseSerializer(serializers.Serializer):
    intent = serializers.CharField()
    answer = serializers.CharField()
    confidence = serializers.FloatField()
    suggested_actions = SuggestedActionSerializer(many=True)
    data_source = serializers.ChoiceField(choices=['live_db', 'static_fallback'])


# ── Context endpoint ───────────────────────────────────────────────────────────

class AssistantContextResponseSerializer(serializers.Serializer):
    """GET /api/v1/assistant/context/"""
    profile = serializers.DictField(required=False)
    skills = serializers.ListField(required=False)
    projects = serializers.ListField(required=False)
    experience = serializers.ListField(required=False)
    services = serializers.ListField(required=False)


# ── Feedback endpoint ──────────────────────────────────────────────────────────

class AssistantFeedbackInputSerializer(serializers.Serializer):
    """POST /api/v1/assistant/feedback/"""
    query = serializers.CharField(max_length=500, trim_whitespace=True)
    intent = serializers.CharField(max_length=100)
    rating = serializers.ChoiceField(
        choices=['helpful', 'not_helpful'],
        help_text="'helpful' or 'not_helpful'",
    )
    comment = serializers.CharField(
        max_length=1000,
        required=False,
        allow_blank=True,
        trim_whitespace=True,
    )
