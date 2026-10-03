from django.test import TestCase
from apps.blog.models import Article, ArticleTag


class BlogModelTests(TestCase):
    def test_article_and_tags(self):
        tag = ArticleTag.objects.create(name='Django', slug='django')
        article = Article.objects.create(
            id='test-article',
            title='Test Article Title',
            slug='test-article',
            excerpt='Short summary',
            content='# Heading\nMarkdown text',
            read_time_minutes=4
        )
        article.tags.add(tag)
        self.assertEqual(article.tags.count(), 1)
        self.assertEqual(str(article), 'Test Article Title')
        self.assertEqual(str(tag), 'Django')
