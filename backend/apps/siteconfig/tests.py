from django.test import TestCase
from django.core.management import call_command
from apps.siteconfig.models import (
    SiteProfile,
    ProfileStat,
    SocialLink,
    UseCategory,
    UseItem,
    CurrentItem,
)
from apps.portfolio.models import Project


class SiteConfigModelTests(TestCase):
    def test_site_profile_and_relations(self):
        profile = SiteProfile.objects.create(
            id='main',
            name='Manoj Khatri',
            title='Backend Software Engineer',
            email='manojkc1dev@gmail.com'
        )
        stat = ProfileStat.objects.create(
            profile=profile,
            stat_id='projects',
            label='Production Projects',
            value='3+',
            order=1
        )
        soc = SocialLink.objects.create(
            profile=profile,
            name='GitHub',
            url='https://github.com/manojkc1dev',
            order=1
        )
        self.assertEqual(profile.stats_items.count(), 1)
        self.assertEqual(profile.socials_items.count(), 1)
        self.assertIn('Manoj Khatri', str(profile))
        self.assertIn('Production Projects: 3+', str(stat))
        self.assertIn('GitHub', str(soc))

    def test_uses_and_current_item(self):
        cat = UseCategory.objects.create(title='Backend Tools', order=1)
        item = UseItem.objects.create(category=cat, name='Python 3.12', why='Core runtime', order=1)
        curr = CurrentItem.objects.create(
            id='ats-resume',
            title='ATS Resume Builder',
            description='Resume tool',
            status='active',
            progress=70
        )
        self.assertEqual(cat.items.count(), 1)
        self.assertIn('Python 3.12', str(item))
        self.assertIn('ATS Resume Builder [active - 70%]', str(curr))

    def test_seed_command_execution(self):
        """Verify management command runs cleanly and populates database."""
        call_command('seed_initial_data')
        self.assertTrue(Project.objects.filter(id='agritech').exists())
        self.assertTrue(SiteProfile.objects.filter(id='main').exists())
