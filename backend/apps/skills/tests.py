from django.test import TestCase
from apps.skills.models import SkillCategory, SkillItem


class SkillsModelTests(TestCase):
    def setUp(self):
        self.category = SkillCategory.objects.create(
            id='backend',
            title='Backend & APIs',
            description='Server-side development',
            order=1
        )

    def test_skill_category_creation(self):
        self.assertEqual(str(self.category), 'Backend & APIs')
        self.assertEqual(self.category.category, 'Backend & APIs')

    def test_skill_item_relationship(self):
        skill = SkillItem.objects.create(
            category=self.category,
            name='Python',
            proficiency='Advanced',
            level='advanced',
            highlight=True,
            years=3.0,
            order=1
        )
        self.assertEqual(self.category.skills.count(), 1)
        self.assertEqual(self.category.skills.first().name, 'Python')
        self.assertIn('Python (Backend & APIs)', str(skill))


class SkillSerializerTests(TestCase):
    def test_skill_category_nested_serialization(self):
        from apps.skills.serializers import SkillCategorySerializer
        category = SkillCategory.objects.create(
            id='databases',
            title='Databases & Caching',
            description='PostgreSQL and Redis',
            order=2
        )
        SkillItem.objects.create(
            category=category,
            name='PostgreSQL 16',
            icon_name='Database',
            highlight=True,
            proficiency='Advanced',
            level='expert',
            years=3.0,
            order=1
        )
        serializer = SkillCategorySerializer(category)
        data = serializer.data

        self.assertEqual(data['id'], 'databases')
        self.assertEqual(data['title'], 'Databases & Caching')
        self.assertEqual(len(data['skills']), 1)
        self.assertEqual(data['skills'][0]['name'], 'PostgreSQL 16')
        self.assertEqual(data['skills'][0]['iconName'], 'Database')
        self.assertTrue(data['skills'][0]['highlight'])


class SkillAPITests(TestCase):
    def setUp(self):
        from rest_framework.test import APIClient
        self.client = APIClient()
        self.cat = SkillCategory.objects.create(
            id='backend',
            title='Backend & APIs',
            order=1
        )
        SkillItem.objects.create(
            category=self.cat,
            name='Python',
            icon_name='Code',
            highlight=True,
            proficiency='Advanced',
            level='advanced',
            years=3.0,
            order=1
        )

    def test_public_skills_list_endpoint(self):
        response = self.client.get('/api/v1/skills/')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]['id'], 'backend')
        self.assertEqual(len(data[0]['skills']), 1)
        self.assertEqual(data[0]['skills'][0]['name'], 'Python')


