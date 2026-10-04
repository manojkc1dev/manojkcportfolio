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


class BlogAPITests(TestCase):
    def setUp(self):
        from rest_framework.test import APIClient
        self.client = APIClient()
        self.pub_article = Article.objects.create(
            id='pg-indexing',
            title='Mastering PostgreSQL Indexing',
            slug='pg-indexing',
            excerpt='Indexing article',
            content='## Detailed article markdown',
            visibility='Published'
        )
        self.draft_article = Article.objects.create(
            id='draft-article',
            title='Draft Article',
            slug='draft-article',
            excerpt='Draft excerpt',
            content='Draft content',
            visibility='Draft'
        )

    def test_public_articles_list_returns_published_only(self):
        response = self.client.get('/api/v1/articles/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 1)
        self.assertEqual(response.json()[0]['id'], 'pg-indexing')

    def test_public_article_detail_and_404_for_draft(self):
        response = self.client.get('/api/v1/articles/pg-indexing/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['id'], 'pg-indexing')
        self.assertEqual(response.json()['content'], '## Detailed article markdown')

        draft_resp = self.client.get('/api/v1/articles/draft-article/')
        self.assertEqual(draft_resp.status_code, 404)

    def test_public_articles_filter_by_category(self):
        """Verify ?category=... returns only matching published articles."""
        Article.objects.create(
            id='docker-cicd',
            title='Docker CI/CD Pipelines',
            slug='docker-cicd',
            category='DevOps',
            excerpt='CI/CD guide',
            content='Content',
            visibility='Published'
        )
        response = self.client.get('/api/v1/articles/?category=DevOps')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]['id'], 'docker-cicd')

    def test_public_articles_filter_by_featured(self):
        """Verify ?featured=true returns only matching published articles."""
        Article.objects.create(
            id='featured-post',
            title='Featured Post',
            slug='featured-post',
            excerpt='Featured excerpt',
            content='Content',
            visibility='Published',
            featured=True
        )
        response = self.client.get('/api/v1/articles/?featured=true')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]['id'], 'featured-post')

    def test_public_articles_filter_by_tag(self):
        """Verify ?tag=... returns only matching published articles."""
        Article.objects.create(
            id='redis-caching',
            title='Redis Caching Patterns',
            slug='redis-caching',
            excerpt='Redis guide',
            content='Content',
            visibility='Published',
            tags_list=['Redis', 'Architecture']
        )
        response = self.client.get('/api/v1/articles/?tag=Redis')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]['id'], 'redis-caching')
