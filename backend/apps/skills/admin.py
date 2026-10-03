from django.contrib import admin
from .models import SkillCategory, SkillItem


class SkillItemInline(admin.TabularInline):
    model = SkillItem
    extra = 2


@admin.register(SkillCategory)
class SkillCategoryAdmin(admin.ModelAdmin):
    list_display = ('title', 'id', 'order')
    search_fields = ('title', 'id', 'description')
    inlines = [SkillItemInline]


@admin.register(SkillItem)
class SkillItemAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'proficiency', 'level', 'highlight', 'years', 'order')
    list_filter = ('category', 'proficiency', 'level', 'highlight')
    search_fields = ('name', 'category__title')
