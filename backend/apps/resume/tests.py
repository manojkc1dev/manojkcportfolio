from django.test import TestCase
from apps.resume.models import ResumeDocument, ResumeDataRecord


class ResumeModelTests(TestCase):
    def test_resume_document_creation(self):
        doc = ResumeDocument.objects.create(
            file_name='Manoj_KC_Resume.pdf',
            mime_type='application/pdf',
            file_size=102400,
            version_tag='v2.0',
            is_active=True
        )
        self.assertTrue(doc.is_active)
        self.assertIn('Manoj_KC_Resume.pdf', str(doc))

    def test_resume_data_record_creation(self):
        record = ResumeDataRecord.objects.create(
            version_tag='v2026-ATS',
            target_headline='Backend Engineer',
            summary_text='Experienced Django developer',
            customization={'templateStyle': 'modern-tech'},
            sections_data=[{'id': 'sec-1', 'title': 'Experience', 'items': []}],
            is_active=True
        )
        self.assertTrue(record.is_active)
        self.assertIn('Resume State [v2026-ATS] (Active)', str(record))


class ResumeSerializerTests(TestCase):
    def test_resume_data_record_serializer_camel_case_mappings(self):
        from apps.resume.serializers import ResumeDataRecordSerializer, ResumeDocumentMetadataSerializer
        record = ResumeDataRecord.objects.create(
            version_tag='Production-2026',
            target_headline='Backend Software Engineer',
            summary_text='Experienced developer with Django & PostgreSQL focus.',
            resume_url='/resume.pdf',
            file_name='Manoj_KC_Resume.pdf',
            customization={'templateStyle': 'ats-classic', 'fontFamily': 'Inter'},
            sections_data=[{'id': 'sec-exp', 'type': 'experience', 'title': 'Experience', 'entries': []}],
            is_active=True
        )

        serializer = ResumeDataRecordSerializer(record)
        data = serializer.data

        self.assertEqual(data['versionTag'], 'Production-2026')
        self.assertEqual(data['targetHeadline'], 'Backend Software Engineer')
        self.assertEqual(data['summaryText'], 'Experienced developer with Django & PostgreSQL focus.')
        self.assertEqual(data['resumeUrl'], '/resume.pdf')
        self.assertEqual(data['fileName'], 'Manoj_KC_Resume.pdf')
        self.assertEqual(data['customization']['templateStyle'], 'ats-classic')
        self.assertEqual(len(data['sectionsData']), 1)
        self.assertTrue(data['isActive'])

        doc = ResumeDocument.objects.create(
            file_name='Manoj_KC_CV.pdf',
            mime_type='application/pdf',
            file_size=204800,
            version_tag='v2.1',
            is_active=True
        )
        doc_serializer = ResumeDocumentMetadataSerializer(doc)
        doc_data = doc_serializer.data

        self.assertEqual(doc_data['fileName'], 'Manoj_KC_CV.pdf')
        self.assertEqual(doc_data['mimeType'], 'application/pdf')
        self.assertEqual(doc_data['fileSize'], 204800)
        self.assertEqual(doc_data['versionTag'], 'v2.1')
        self.assertTrue(doc_data['isActive'])


class ResumeAPITests(TestCase):
    def setUp(self):
        from rest_framework.test import APIClient
        self.client = APIClient()
        self.record = ResumeDataRecord.objects.create(
            version_tag='Production-2026',
            target_headline='Backend Software Engineer',
            summary_text='Experienced Django developer',
            is_active=True
        )
        self.doc = ResumeDocument.objects.create(
            file_name='Manoj_KC_Resume.pdf',
            mime_type='application/pdf',
            file_size=102400,
            version_tag='v2.0',
            is_active=True
        )

    def test_public_active_resume_data_endpoint(self):
        response = self.client.get('/api/v1/resume/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['versionTag'], 'Production-2026')
        self.assertEqual(response.json()['targetHeadline'], 'Backend Software Engineer')

    def test_public_resume_metadata_endpoint(self):
        response = self.client.get('/api/v1/resume/metadata/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['fileName'], 'Manoj_KC_Resume.pdf')


