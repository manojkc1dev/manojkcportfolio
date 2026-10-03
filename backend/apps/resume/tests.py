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
