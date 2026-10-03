from django.contrib import admin
from .models import ResumeDocument, ResumeDataRecord


@admin.register(ResumeDocument)
class ResumeDocumentAdmin(admin.ModelAdmin):
    list_display = ('file_name', 'version_tag', 'file_size', 'is_active', 'uploaded_at')
    list_filter = ('is_active', 'uploaded_at')
    search_fields = ('file_name', 'version_tag')


@admin.register(ResumeDataRecord)
class ResumeDataRecordAdmin(admin.ModelAdmin):
    list_display = ('version_tag', 'target_headline', 'is_active', 'updated_at')
    list_filter = ('is_active', 'updated_at')
    search_fields = ('version_tag', 'target_headline', 'summary_text')
