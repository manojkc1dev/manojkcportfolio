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

