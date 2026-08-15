"""
Views for contact app.
"""
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from core.permissions import IsContentManagerOrAbove
from .models import Contact
from .serializers import ContactSerializer, ContactListSerializer


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
