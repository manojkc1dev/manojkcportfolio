from django.contrib import admin
from .models import Inquiry


@admin.register(Inquiry)
class InquiryAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'scope_title', 'status', 'read', 'replied', 'created_at')
    list_filter = ('status', 'read', 'replied', 'created_at')
    search_fields = ('name', 'email', 'message', 'company', 'project_title')
    readonly_fields = ('id', 'created_at', 'updated_at', 'ip_address', 'user_agent')
