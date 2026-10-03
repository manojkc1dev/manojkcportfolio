from django.test import TestCase
from django.db.utils import IntegrityError
from apps.portfolio.models import Project, ProjectMetric, ProjectChallenge, TechChoice


class PortfolioModelTests(TestCase):
    def setUp(self):
        self.project = Project.objects.create(
            id='test-project',
            slug='test-project',
            title='Test Project',
            description='Test Description',
            category='backend',
            year=2026,
            featured=True
        )

    def test_project_creation(self):
        self.assertEqual(self.project.title, 'Test Project')
        self.assertEqual(str(self.project), 'Test Project (test-project)')
        self.assertTrue(self.project.featured)

    def test_project_slug_uniqueness(self):
        with self.assertRaises(IntegrityError):
            Project.objects.create(
                id='another-id',
                slug='test-project',
                title='Duplicate Slug',
                description='Desc'
            )

    def test_project_metrics_relationship(self):
        metric = ProjectMetric.objects.create(
            project=self.project,
            label='Latency',
            value='10ms',
            icon='speed',
            order=1
        )
        self.assertEqual(self.project.metrics_items.count(), 1)
        self.assertEqual(self.project.metrics_items.first().label, 'Latency')
        self.assertIn('Latency = 10ms', str(metric))

    def test_project_challenges_relationship(self):
        challenge = ProjectChallenge.objects.create(
            project=self.project,
            title='Race Condition',
            problem='Concurrency issue',
            approach='Row locking',
            outcome='Resolved',
            order=1
        )
        self.assertEqual(self.project.challenges_items.count(), 1)
        self.assertIn('Race Condition', str(challenge))

    def test_tech_choice_relationship(self):
        tc = TechChoice.objects.create(
            project=self.project,
            layer='Database',
            choice='PostgreSQL 16',
            why='ACID compliance',
            order=1
        )
        self.assertEqual(self.project.tech_choices_items.count(), 1)
        self.assertIn('Database - PostgreSQL 16', str(tc))


class PortfolioSerializerTests(TestCase):
    def setUp(self):
        self.project = Project.objects.create(
            id='agritech',
            slug='agritech',
            title='AgriTech Marketplace Platform',
            tagline='Scalable B2B produce auction API',
            description='Django backend with payment gateways',
            category='backend',
            year=2025,
            status='live',
            featured=True,
            image='/images/agritech.png',
            highlights=['Sub-100ms latency', '10K orders processed'],
            tech=['Django', 'PostgreSQL', 'Redis'],
            what_i_built=['Auction bidding engine', 'Escrow reconciliation'],
            lessons_learned=['Optimistic concurrency control'],
            related_projects=['hospital-management'],
            live_url='https://agritech.example.com',
            github_url='https://github.com/manojkc1dev/agritech',
            case_study_url='/projects/agritech',
            api_docs_url='https://api.agritech.example.com/docs'
        )
        ProjectMetric.objects.create(
            project=self.project,
            label='Latency',
            value='45ms',
            icon='speed',
            order=1
        )
        ProjectChallenge.objects.create(
            project=self.project,
            title='High-concurrency bidding',
            problem='Auction bids collision',
            approach='Redis distributed locks',
            outcome='Zero race conditions',
            order=1
        )
        TechChoice.objects.create(
            project=self.project,
            layer='Cache',
            choice='Redis 7',
            why='Sub-millisecond latency',
            order=1
        )

    def test_project_detail_serializer_camel_case_mappings_and_nested_data(self):
        from apps.portfolio.serializers import ProjectDetailSerializer
        serializer = ProjectDetailSerializer(self.project)
        data = serializer.data

        self.assertEqual(data['id'], 'agritech')
        self.assertEqual(data['title'], 'AgriTech Marketplace Platform')
        self.assertEqual(data['whatIBuilt'], ['Auction bidding engine', 'Escrow reconciliation'])
        self.assertEqual(data['lessonsLearned'], ['Optimistic concurrency control'])
        self.assertEqual(data['relatedProjects'], ['hospital-management'])
        self.assertEqual(data['liveUrl'], 'https://agritech.example.com')
        self.assertEqual(data['githubUrl'], 'https://github.com/manojkc1dev/agritech')
        self.assertEqual(data['caseStudyUrl'], '/projects/agritech')
        self.assertEqual(data['apiDocsUrl'], 'https://api.agritech.example.com/docs')

        # Verify nested structures
        self.assertEqual(len(data['metrics']), 1)
        self.assertEqual(data['metrics'][0]['label'], 'Latency')
        self.assertEqual(data['metrics'][0]['value'], '45ms')

        self.assertEqual(len(data['challenges']), 1)
        self.assertEqual(data['challenges'][0]['title'], 'High-concurrency bidding')

        self.assertEqual(len(data['techStackTable']), 1)
        self.assertEqual(data['techStackTable'][0]['layer'], 'Cache')
        self.assertEqual(data['techStackTable'][0]['choice'], 'Redis 7')


class ProjectAPITests(TestCase):
    def setUp(self):
        from rest_framework.test import APIClient
        self.client = APIClient()
        self.pub_project = Project.objects.create(
            id='agritech',
            slug='agritech',
            title='AgriTech Marketplace Platform',
            tagline='B2B auction system',
            description='Django backend',
            category='backend',
            year=2025,
            status='live',
            visibility='Published',
            featured=True
        )
        self.draft_project = Project.objects.create(
            id='secret-proto',
            slug='secret-proto',
            title='Secret Prototype',
            description='Unreleased project',
            category='tools',
            visibility='Draft',
            featured=False
        )

    def test_public_project_list_returns_published_only(self):
        response = self.client.get('/api/v1/projects/')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]['id'], 'agritech')
        self.assertEqual(data[0]['title'], 'AgriTech Marketplace Platform')

    def test_public_project_filter_by_category_and_featured(self):
        response = self.client.get('/api/v1/projects/?category=backend&featured=true')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]['id'], 'agritech')

        empty_resp = self.client.get('/api/v1/projects/?category=tools')
        self.assertEqual(empty_resp.status_code, 200)
        self.assertEqual(len(empty_resp.json()), 0)

    def test_public_project_detail_by_slug_and_404_for_draft_or_missing(self):
        response = self.client.get('/api/v1/projects/agritech/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['id'], 'agritech')

        # Draft project should not be accessible
        draft_resp = self.client.get('/api/v1/projects/secret-proto/')
        self.assertEqual(draft_resp.status_code, 404)

        # Missing project should return 404
        missing_resp = self.client.get('/api/v1/projects/nonexistent-project/')
        self.assertEqual(missing_resp.status_code, 404)


