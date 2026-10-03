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


class BlogSerializerTests(TestCase):
    def test_article_list_and_detail_serializers(self):
        from apps.blog.serializers import ArticleListSerializer, ArticleDetailSerializer
        article = Article.objects.create(
            id='pg-indexing',
            title='Mastering PostgreSQL Indexing in Django',
            slug='pg-indexing',
            category='Database Engineering',
            date='Mar 2026',
            excerpt='Deep dive into B-Tree and GIN indexes in PostgreSQL.',
            content='## Detailed article body\n\n```python\n# code here\n```',
            header_image='/images/pg.png',
            author_name='Manoj Khatri',
            author_role='Backend Engineer',
            read_time_minutes=7,
            tags_list=['PostgreSQL', 'Django', 'Performance'],
            featured=True
        )

        list_serializer = ArticleListSerializer(article)
        list_data = list_serializer.data
        self.assertEqual(list_data['id'], 'pg-indexing')
        self.assertEqual(list_data['readingTime'], 7)
        self.assertEqual(list_data['headerImage'], '/images/pg.png')
        self.assertEqual(list_data['authorName'], 'Manoj Khatri')
        self.assertEqual(list_data['tags'], ['PostgreSQL', 'Django', 'Performance'])
        self.assertNotIn('content', list_data)

        detail_serializer = ArticleDetailSerializer(article)
        detail_data = detail_serializer.data
        self.assertEqual(detail_data['content'], '## Detailed article body\n\n```python\n# code here\n```')
        self.assertEqual(detail_data['readingTime'], 7)

