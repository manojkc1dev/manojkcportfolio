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
