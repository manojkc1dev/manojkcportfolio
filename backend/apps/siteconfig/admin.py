from django.contrib import admin
from .models import SiteProfile, ProfileStat, SocialLink, UseCategory, UseItem, CurrentItem


class ProfileStatInline(admin.TabularInline):
    model = ProfileStat
    extra = 1


class SocialLinkInline(admin.TabularInline):
    model = SocialLink
    extra = 1


@admin.register(SiteProfile)
class SiteProfileAdmin(admin.ModelAdmin):
    list_display = ('name', 'title', 'location', 'email', 'updated_at')
    inlines = [ProfileStatInline, SocialLinkInline]


class UseItemInline(admin.TabularInline):
    model = UseItem
    extra = 1


@admin.register(UseCategory)
class UseCategoryAdmin(admin.ModelAdmin):
    list_display = ('title', 'order')
    inlines = [UseItemInline]


@admin.register(UseItem)
class UseItemAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'tag', 'order')
    list_filter = ('category',)
    search_fields = ('name', 'why', 'tag')


@admin.register(CurrentItem)
class CurrentItemAdmin(admin.ModelAdmin):
    list_display = ('title', 'id', 'status', 'progress', 'since', 'order')
    list_filter = ('status',)
    search_fields = ('title', 'description', 'related_project_id')
