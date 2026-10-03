"""
Serializers for Skill Categories and Technical Skills.
"""
from rest_framework import serializers
from .models import SkillCategory, SkillItem


class SkillItemSerializer(serializers.ModelSerializer):
    """Specific technical skill item mapping snake_case to frontend camelCase."""
    iconName = serializers.CharField(source='icon_name', read_only=True)

    class Meta:
        model = SkillItem
        fields = (
            'id',
            'name',
            'iconName',
            'highlight',
            'proficiency',
            'level',
            'years',
            'order',
        )


class SkillCategorySerializer(serializers.ModelSerializer):
    """Technical skill category grouping with nested skills list."""
    skills = SkillItemSerializer(many=True, read_only=True)

    class Meta:
        model = SkillCategory
        fields = (
            'id',
            'title',
            'category',
            'description',
            'order',
            'skills',
        )
