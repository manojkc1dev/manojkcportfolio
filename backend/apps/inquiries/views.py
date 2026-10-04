"""
API Views for Inbound Client Inquiries and Public Contact Form Ingestion,
plus Authenticated Administrative Lead Management.
"""
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.throttling import AnonRateThrottle
from .models import Inquiry
from .serializers import InquiryCreateSerializer, InquiryDetailSerializer


class InquiryListCreateView(generics.ListCreateAPIView):
    """
    POST: Public endpoint for submitting client inquiries (AllowAny, rate limited).
    GET: Authenticated endpoint for administrative listing of all leads (IsAuthenticated).
    """
    queryset = Inquiry.objects.all().order_by('-created_at')
    pagination_class = None

    def get_permissions(self):
        if self.request.method == 'POST':
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_throttles(self):
        if self.request.method == 'POST':
            return [AnonRateThrottle()]
        return []

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return InquiryCreateSerializer
        return InquiryDetailSerializer

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


class InquiryDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Authenticated endpoint for retrieving, updating (status/read/replied),
    and deleting client inquiries (IsAuthenticated).
    """
    permission_classes = [IsAuthenticated]
    serializer_class = InquiryDetailSerializer
    queryset = Inquiry.objects.all()
    lookup_field = 'id'
    lookup_url_kwarg = 'pk'
