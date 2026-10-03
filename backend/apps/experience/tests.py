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

