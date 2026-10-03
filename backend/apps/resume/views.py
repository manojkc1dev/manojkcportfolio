"""
Public Read-Only API Views for ATS Resume Studio Data.
"""
from django.http import FileResponse, Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from .models import ResumeDataRecord, ResumeDocument
from .serializers import ResumeDataRecordSerializer, ResumeDocumentMetadataSerializer


class ActiveResumeDataRecordView(APIView):
    """Retrieve active structured ATS Resume Studio state and customization."""
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        record = ResumeDataRecord.objects.filter(is_active=True).first()
        if not record:
            record = ResumeDataRecord.objects.first()
        if not record:
            return Response({'detail': 'No resume data record found.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = ResumeDataRecordSerializer(record)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ActiveResumeMetadataView(APIView):
    """Retrieve metadata for the active PDF resume document."""
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        doc = ResumeDocument.objects.filter(is_active=True).first()
        if not doc:
            doc = ResumeDocument.objects.first()
        if not doc:
            return Response({'detail': 'No resume document found.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = ResumeDocumentMetadataSerializer(doc)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ResumeDownloadView(APIView):
    """
    Stream the active PDF resume document as a binary download.

    Returns a FileResponse with:
      - Content-Type: application/pdf
      - Content-Disposition: attachment; filename="<stored file_name>"

    Never exposes file_binary through JSON.
    Returns 404 when no active document exists or no file is attached.
    """
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        doc = ResumeDocument.objects.filter(is_active=True).first()
        if not doc:
            raise Http404('No active resume document is available.')

        if not doc.file:
            raise Http404('Resume file is not yet uploaded.')

        response = FileResponse(
            doc.file.open('rb'),
            content_type='application/pdf',
        )
        response['Content-Disposition'] = (
            f'attachment; filename="{doc.file_name}"'
        )
        return response
