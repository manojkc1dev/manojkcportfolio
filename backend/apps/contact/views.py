"""
Views for contact app.
"""
from rest_framework import generics, status
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet
from rest_framework.throttling import UserRateThrottle
from django.utils import timezone
from core.permissions import IsContentManagerOrAbove
from core.views import StandardResponse
from .models import Contact
from .serializers import ContactSerializer, ContactListSerializer, ContactReplySerializer
from .tasks import send_contact_reply_email


class ContactReplyRateThrottle(UserRateThrottle):
    """
    Custom rate throttle for contact reply endpoint.
    Allows 10 replies per minute per authenticated user.
    This prevents accidental abuse while allowing legitimate admin use.
    """
    rate = '10/min'
    scope = 'contact_reply'


class ContactListCreateView(generics.ListCreateAPIView):
    """
    List and create contact submissions.
    """
    queryset = Contact.objects.all()
    permission_classes = [AllowAny]
    filterset_fields = ['contact_status', 'is_starred', 'is_spam']
    search_fields = ['name', 'email', 'subject', 'message']
    ordering_fields = ['created_at']

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return ContactListSerializer
        return ContactSerializer

    def get_queryset(self):
        """Filter queryset based on user permissions."""
        queryset = super().get_queryset()
        
        if not self.request.user.is_authenticated:
            return queryset.none()
        
        if not self.request.user.is_content_manager():
            return queryset.none()
        
        return queryset


class ContactDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a contact submission.
    """
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer
    permission_classes = [IsAuthenticated, IsContentManagerOrAbove]
    lookup_field = 'id'


class ContactReplyView(generics.GenericAPIView):
    """
    Reply to a contact submission via email.
    """
    queryset = Contact.objects.all()
    permission_classes = [IsAuthenticated, IsContentManagerOrAbove]
    lookup_field = 'id'
    serializer_class = ContactReplySerializer
    throttle_classes = [ContactReplyRateThrottle]

    def post(self, request, *args, **kwargs):
        """
        Send a reply email to the contact.
        
        Request body:
        {
            "reply": "Your reply message"
        }
        """
        contact = self.get_object()
        serializer = self.get_serializer(data=request.data)
        
        if not serializer.is_valid():
            return StandardResponse.error(
                message="Validation failed",
                errors=serializer.errors,
                status_code=status.HTTP_400_BAD_REQUEST
            )
        
        reply_message = serializer.validated_data['reply']
        
        # Update contact with reply information
        contact.reply = reply_message
        contact.replied_at = timezone.now()
        contact.replied_by = request.user
        contact.contact_status = 'in_progress'
        contact.reply_email_status = 'pending'
        contact.failure_reason = ''
        contact.save(
            update_fields=[
                'reply', 'replied_at', 'replied_by', 
                'contact_status', 'reply_email_status', 'failure_reason'
            ]
        )
        
        # Queue Celery task for email delivery
        task = send_contact_reply_email.delay(str(contact.id), reply_message)
        
        return StandardResponse.success(
            data={
                'contact_id': str(contact.id),
                'reply': reply_message,
                'task_id': task.id,
                'status': 'queued'
            },
            message="Reply queued for email delivery",
            status_code=status.HTTP_202_ACCEPTED
        )
