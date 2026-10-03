"""
API Views for Inbound Client Inquiries and Public Contact Form Ingestion.
"""
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import Inquiry
from .serializers import InquiryCreateSerializer


class InquiryCreateView(generics.CreateAPIView):
    """
    Public endpoint for submitting client inquiries with honeypot anti-spam validation
    and input sanitization.
    """
    permission_classes = [AllowAny]
    serializer_class = InquiryCreateSerializer
    queryset = Inquiry.objects.all()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        inquiry = serializer.save()

        # Capture IP address and user agent for security and audit logging
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            inquiry.ip_address = x_forwarded_for.split(',')[0].strip()
        else:
            inquiry.ip_address = request.META.get('REMOTE_ADDR')
        inquiry.user_agent = request.META.get('HTTP_USER_AGENT', '')
        inquiry.save(update_fields=['ip_address', 'user_agent'])

        return Response(
            {
                'status': 'ok',
                'message': 'Your message has been received successfully. I will get back to you within 24 hours.',
                'id': str(inquiry.id),
            },
            status=status.HTTP_201_CREATED
        )
