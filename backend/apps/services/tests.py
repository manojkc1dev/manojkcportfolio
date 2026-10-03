from django.test import TestCase
from apps.services.models import Service


class ServiceModelTests(TestCase):
    def test_service_creation(self):
        svc = Service.objects.create(
            id='backend-api',
            title='Backend API Development',
            slug='backend-api',
            short_summary='High performance DRF APIs',
            features=['JWT', 'PostgreSQL'],
            deliverables=['Source Code']
        )
        self.assertEqual(svc.title, 'Backend API Development')
        self.assertEqual(str(svc), 'Backend API Development')


class ServiceSerializerTests(TestCase):
    def test_service_serializer_camel_case_mappings(self):
        from apps.services.serializers import ServiceSerializer
        svc = Service.objects.create(
            id='api-arch',
            title='REST API Architecture',
            slug='api-arch',
            icon='Server',
            short_summary='Enterprise REST design',
            detailed_scope='Full OpenAPI 3.0 specification with JWT security',
            features=['Microservices', 'PostgreSQL'],
            deliverables=['API Docs', 'Postman Collection'],
            technologies=['Django', 'Celery', 'Redis'],
            featured=True,
            cover_image='/images/api.png'
        )
        serializer = ServiceSerializer(svc)
        data = serializer.data

        self.assertEqual(data['id'], 'api-arch')
        self.assertEqual(data['shortSummary'], 'Enterprise REST design')
        self.assertEqual(data['detailedScope'], 'Full OpenAPI 3.0 specification with JWT security')
        self.assertEqual(data['coverImage'], '/images/api.png')
        self.assertEqual(data['features'], ['Microservices', 'PostgreSQL'])


class ServiceAPITests(TestCase):
    def setUp(self):
        from rest_framework.test import APIClient
        self.client = APIClient()
        self.pub_svc = Service.objects.create(
            id='api-arch',
            title='REST API Architecture',
            slug='api-arch',
            short_summary='Enterprise REST design',
            visibility='Published'
        )
        self.draft_svc = Service.objects.create(
            id='draft-svc',
            title='Draft Service',
            slug='draft-svc',
            short_summary='Draft',
            visibility='Draft'
        )

    def test_public_service_list_returns_published(self):
        response = self.client.get('/api/v1/services/')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]['id'], 'api-arch')

    def test_public_service_detail_and_404_for_draft(self):
        response = self.client.get('/api/v1/services/api-arch/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['id'], 'api-arch')

        draft_resp = self.client.get('/api/v1/services/draft-svc/')
        self.assertEqual(draft_resp.status_code, 404)


