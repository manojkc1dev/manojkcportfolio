from django.contrib import admin
from .models import Experience


@admin.register(Experience)
class ExperienceAdmin(admin.ModelAdmin):
    list_display = ('role', 'company', 'period', 'type', 'order')
    list_filter = ('type',)
    search_fields = ('role', 'company', 'location', 'tech', 'bullets')
