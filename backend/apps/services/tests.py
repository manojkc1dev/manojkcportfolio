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
