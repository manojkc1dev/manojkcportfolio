from django.contrib import admin
from .models import Service


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('title', 'id', 'order', 'visibility', 'featured', 'icon')
    list_filter = ('visibility', 'featured')
    search_fields = ('title', 'short_summary', 'technologies')
    prepopulated_fields = {'slug': ('id',)}
