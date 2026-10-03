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
