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
