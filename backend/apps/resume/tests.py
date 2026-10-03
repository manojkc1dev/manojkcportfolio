import io
import os
import tempfile

from django.test import TestCase, override_settings
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.test import APIClient

from apps.resume.models import ResumeDocument, ResumeDataRecord


# ──────────────────────────────────────────────────────────────────────────────
# Model Tests
# ──────────────────────────────────────────────────────────────────────────────

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


# ──────────────────────────────────────────────────────────────────────────────
# Serializer Tests
# ──────────────────────────────────────────────────────────────────────────────

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


# ──────────────────────────────────────────────────────────────────────────────
# Phase 4B API Tests (preserved)
# ──────────────────────────────────────────────────────────────────────────────

class ResumeAPITests(TestCase):
    def setUp(self):
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


# ──────────────────────────────────────────────────────────────────────────────
# Phase 4C: Resume Binary Download Tests
# ──────────────────────────────────────────────────────────────────────────────

class ResumeDownloadTests(TestCase):
    """Phase 4C: GET /api/v1/resume/download/ binary PDF endpoint."""

    def setUp(self):
        self.client = APIClient()
        self.url = '/api/v1/resume/download/'

    @override_settings(MEDIA_ROOT=tempfile.mkdtemp())
    def test_successful_resume_download_returns_200(self):
        """Active document with a real file returns 200 FileResponse."""
        pdf_bytes = b'%PDF-1.4 fake-pdf-content-for-testing'
        uploaded = SimpleUploadedFile(
            name='Manoj_KC_Resume.pdf',
            content=pdf_bytes,
            content_type='application/pdf',
        )
        doc = ResumeDocument.objects.create(
            file_name='Manoj_KC_Resume.pdf',
            mime_type='application/pdf',
            file_size=len(pdf_bytes),
            version_tag='v2.0',
            is_active=True,
            file=uploaded,
        )
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)

    @override_settings(MEDIA_ROOT=tempfile.mkdtemp())
    def test_resume_download_content_type_is_pdf(self):
        """Response Content-Type must be application/pdf."""
        pdf_bytes = b'%PDF-1.4 fake-pdf-content-for-testing'
        uploaded = SimpleUploadedFile(
            name='Manoj_KC_Resume.pdf',
            content=pdf_bytes,
            content_type='application/pdf',
        )
        ResumeDocument.objects.create(
            file_name='Manoj_KC_Resume.pdf',
            mime_type='application/pdf',
            file_size=len(pdf_bytes),
            version_tag='v2.0',
            is_active=True,
            file=uploaded,
        )
        response = self.client.get(self.url)
        self.assertIn('application/pdf', response.get('Content-Type', ''))

    @override_settings(MEDIA_ROOT=tempfile.mkdtemp())
    def test_resume_download_content_disposition_uses_stored_filename(self):
        """Content-Disposition attachment filename must match the stored file_name field."""
        pdf_bytes = b'%PDF-1.4 fake-pdf-content-for-testing'
        uploaded = SimpleUploadedFile(
            name='Manoj_KC_Resume.pdf',
            content=pdf_bytes,
            content_type='application/pdf',
        )
        ResumeDocument.objects.create(
            file_name='Manoj_KC_Backend_Engineer_Resume.pdf',
            mime_type='application/pdf',
            file_size=len(pdf_bytes),
            version_tag='v2.0',
            is_active=True,
            file=uploaded,
        )
        response = self.client.get(self.url)
        content_disposition = response.get('Content-Disposition', '')
        self.assertIn('attachment', content_disposition)
        self.assertIn('Manoj_KC_Backend_Engineer_Resume.pdf', content_disposition)

    def test_no_active_resume_document_returns_404(self):
        """When no active ResumeDocument exists, endpoint returns 404."""
        ResumeDocument.objects.all().delete()
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 404)

    def test_inactive_resume_document_returns_404(self):
        """When only inactive documents exist, endpoint returns 404."""
        ResumeDocument.objects.create(
            file_name='Old_Resume.pdf',
            mime_type='application/pdf',
            file_size=1024,
            version_tag='v1.0',
            is_active=False,
        )
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 404)

    def test_active_document_without_file_returns_404(self):
        """Active document with no file attached returns 404."""
        ResumeDocument.objects.create(
            file_name='Manoj_KC_Resume.pdf',
            mime_type='application/pdf',
            file_size=0,
            version_tag='v2.0',
            is_active=True,
            # file field left blank
        )
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 404)
