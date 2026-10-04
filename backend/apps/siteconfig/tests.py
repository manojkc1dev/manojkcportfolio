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


class SiteConfigSerializerTests(TestCase):
    def test_site_profile_serializer_nested_stats_and_socials(self):
        from apps.siteconfig.serializers import SiteProfileSerializer
        profile = SiteProfile.objects.create(
            id='main',
            name='Manoj Khatri',
            title='Backend Software Engineer',
            tagline='Backend systems engineered for scale',
            email='manojkc1dev@gmail.com',
            resume_url='/resume.pdf'
        )
        ProfileStat.objects.create(
            profile=profile,
            stat_id='projects',
            label='Production Projects',
            value='3+',
            icon_name='Code2',
            order=1
        )
        SocialLink.objects.create(
            profile=profile,
            name='GitHub',
            url='https://github.com/manojkc1dev',
            icon='Github',
            handle='@manojkc1dev',
            order=1
        )

        serializer = SiteProfileSerializer(profile)
        data = serializer.data

        self.assertEqual(data['id'], 'main')
        self.assertEqual(data['name'], 'Manoj Khatri')
        self.assertEqual(data['resumeUrl'], '/resume.pdf')
        self.assertEqual(len(data['stats']), 1)
        self.assertEqual(data['stats'][0]['id'], 'projects')
        self.assertEqual(data['stats'][0]['label'], 'Production Projects')
        self.assertEqual(data['stats'][0]['iconName'], 'Code2')
        self.assertEqual(len(data['socials']), 1)
        self.assertEqual(data['socials'][0]['name'], 'GitHub')
        self.assertEqual(data['socials'][0]['handle'], '@manojkc1dev')

    def test_use_category_serializer_nested_items(self):
        from apps.siteconfig.serializers import UseCategorySerializer
        cat = UseCategory.objects.create(
            title='Hardware',
            description='Development machines',
            order=1
        )
        UseItem.objects.create(
            category=cat,
            name='Linux Workstation',
            why='Native Docker execution',
            tag='Ubuntu',
            order=1
        )
        serializer = UseCategorySerializer(cat)
        data = serializer.data

        self.assertEqual(data['title'], 'Hardware')
        self.assertEqual(len(data['items']), 1)
        self.assertEqual(data['items'][0]['name'], 'Linux Workstation')
        self.assertEqual(data['items'][0]['why'], 'Native Docker execution')


class SiteConfigAPITests(TestCase):
    def setUp(self):
        from rest_framework.test import APIClient
        self.client = APIClient()
        self.profile = SiteProfile.objects.create(
            id='main',
            name='Manoj Khatri',
            title='Backend Software Engineer',
            email='manojkc1dev@gmail.com'
        )
        self.cat = UseCategory.objects.create(title='Hardware', order=1)
        UseItem.objects.create(category=self.cat, name='Linux Workstation', why='Native dev', order=1)
        self.curr = CurrentItem.objects.create(
            id='ats-resume',
            title='ATS Resume Builder',
            description='Resume tool',
            status='active',
            progress=70
        )

    def test_public_profile_endpoint(self):
        response = self.client.get('/api/v1/profile/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['name'], 'Manoj Khatri')

    def test_public_profile_excludes_invisible_social_links(self):
        """Regression test: invisible social links (visible=False) must NOT be returned publicly."""
        SocialLink.objects.create(
            profile=self.profile,
            name='GitHub',
            url='https://github.com/manojkc1dev',
            visible=True,
            order=1
        )
        SocialLink.objects.create(
            profile=self.profile,
            name='SecretNetwork',
            url='https://secret.network/manoj',
            visible=False,
            order=2
        )
        response = self.client.get('/api/v1/profile/')
        self.assertEqual(response.status_code, 200)
        socials = response.json().get('socials', [])
        self.assertEqual(len(socials), 1)
        self.assertEqual(socials[0]['name'], 'GitHub')

    def test_public_uses_endpoint(self):
        response = self.client.get('/api/v1/uses/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 1)

    def test_public_currently_building_endpoint(self):
        response = self.client.get('/api/v1/currently-building/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 1)
        self.assertEqual(response.json()[0]['id'], 'ats-resume')

    def test_currently_building_filter_by_status(self):
        """Verify ?status=active filters currently-building items."""
        CurrentItem.objects.create(
            id='distributed-scheduler',
            title='Distributed Task Scheduler',
            description='Celery-inspired task manager in Go',
            status='planned',
            progress=0
        )
        # All items
        all_resp = self.client.get('/api/v1/currently-building/')
        self.assertEqual(all_resp.status_code, 200)
        self.assertEqual(len(all_resp.json()), 2)

        # Filtered by status=active
        active_resp = self.client.get('/api/v1/currently-building/?status=active')
        self.assertEqual(active_resp.status_code, 200)
        data = active_resp.json()
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]['id'], 'ats-resume')
        self.assertEqual(data[0]['status'], 'active')
