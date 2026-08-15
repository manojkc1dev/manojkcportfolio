"""
Admin configuration for newsletter app.
"""
from django.contrib import admin
from .models import Newsletter


@admin.register(Newsletter)
class NewsletterAdmin(admin.ModelAdmin):
    """
    Admin interface for newsletter subscriptions.
    """
    list_display = [
        'email', 'name', 'is_subscribed', 'is_verified',
        'source', 'created_at'
    ]
    list_filter = [
        'is_subscribed', 'is_verified', 'source', 'created_at'
    ]
    search_fields = ['email', 'name']
    list_editable = ['is_subscribed', 'is_verified']
    readonly_fields = [
        'id', 'verification_token', 'verified_at', 'unsubscribed_at',
        'created_at', 'updated_at', 'created_by', 'updated_by'
    ]
    fieldsets = (
        ('Subscriber Information', {
            'fields': ('email', 'name')
        }),
        ('Status', {
            'fields': ('is_subscribed', 'is_verified')
        }),
        ('Verification', {
            'fields': ('verification_token', 'verified_at')
        }),
        ('Unsubscription', {
            'fields': ('unsubscribed_at', 'unsubscribe_reason')
        }),
        ('Source', {
            'fields': ('source',)
        }),
        ('Metadata', {
            'fields': ('id', 'created_at', 'updated_at', 'created_by', 'updated_by')
        }),
    )
    
    actions = ['export_to_csv']
    
    def export_to_csv(self, request, queryset):
        import csv
        from django.http import HttpResponse
        
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="newsletter_subscribers.csv"'
        
        writer = csv.writer(response)
        writer.writerow(['Email', 'Name', 'Subscribed', 'Verified', 'Source', 'Created At'])
        
        for obj in queryset:
            writer.writerow([
                obj.email, obj.name, obj.is_subscribed,
                obj.is_verified, obj.source, obj.created_at
            ])
        
        return response
    
    export_to_csv.short_description = 'Export selected to CSV'
