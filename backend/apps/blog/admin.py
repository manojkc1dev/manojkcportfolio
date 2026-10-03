from django.contrib import admin
from .models import Article, ArticleTag


@admin.register(ArticleTag)
class ArticleTagAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name',)


@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display = ('title', 'id', 'category', 'visibility', 'featured', 'read_time_minutes', 'published_date')
    list_filter = ('visibility', 'featured', 'category')
    search_fields = ('title', 'excerpt', 'content', 'author_name')
    prepopulated_fields = {'slug': ('id',)}
    filter_horizontal = ('tags',)
