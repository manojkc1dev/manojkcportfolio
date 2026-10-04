from django.test import TestCase
from apps.experience.models import Experience


class ExperienceModelTests(TestCase):
    def test_experience_creation(self):
        exp = Experience.objects.create(
            id='sajha-infotech',
            role='Backend Developer Intern',
            company='Sajha Infotech',
            period='Jul 2024 – Dec 2024',
            location='Kathmandu, Nepal',
            type='internship',
            bullets=['Optimized SQL queries by 30%'],
            tech=['Python', 'Django', 'PostgreSQL']
        )
        self.assertEqual(exp.role, 'Backend Developer Intern')
        self.assertEqual(exp.type, 'internship')
        self.assertIn('Backend Developer Intern at Sajha Infotech', str(exp))


class ExperienceSerializerTests(TestCase):
    def test_experience_serializer_camel_case_mappings(self):
        from apps.experience.serializers import ExperienceSerializer
        exp = Experience.objects.create(
            id='tu-bit',
            role='Bachelor of Information Technology',
            company='Tribhuvan University',
            company_url='https://tu.edu.np',
            period='2021 – 2025',
            start='2021',
            end='2025',
            location='Kathmandu, Nepal',
            type='education',
            description='Graduated with distinction in backend systems.',
            bullets=['Graduated with 3.8 GPA', 'Capstone on Distributed Ledgers'],
            tech=['Python', 'Django', 'PostgreSQL'],
            order=2
        )
        serializer = ExperienceSerializer(exp)
        data = serializer.data

        self.assertEqual(data['id'], 'tu-bit')
        self.assertEqual(data['role'], 'Bachelor of Information Technology')
        self.assertEqual(data['company'], 'Tribhuvan University')
        self.assertEqual(data['companyUrl'], 'https://tu.edu.np')
        self.assertEqual(data['type'], 'education')
        self.assertEqual(data['bullets'], ['Graduated with 3.8 GPA', 'Capstone on Distributed Ledgers'])


class ExperienceAPITests(TestCase):
    def setUp(self):
        from rest_framework.test import APIClient
        self.client = APIClient()
        self.exp = Experience.objects.create(
            id='sajha-infotech',
            role='Backend Developer Intern',
            company='Sajha Infotech',
            period='Jul 2024 – Dec 2024',
            location='Kathmandu, Nepal',
            type='internship',
            bullets=['Optimized SQL queries by 30%'],
            tech=['Python', 'Django', 'PostgreSQL']
        )

    def test_public_experience_list_and_filter(self):
        response = self.client.get('/api/v1/experience/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 1)

        filtered = self.client.get('/api/v1/experience/?type=internship')
        self.assertEqual(filtered.status_code, 200)
        self.assertEqual(len(filtered.json()), 1)

    def test_public_experience_detail(self):
        response = self.client.get('/api/v1/experience/sajha-infotech/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['id'], 'sajha-infotech')

    def test_public_experience_detail_404_for_missing_id(self):
        """GET /api/v1/experience/<missing-id>/ must return 404."""
        response = self.client.get('/api/v1/experience/non-existent-id/')
        self.assertEqual(response.status_code, 404)
