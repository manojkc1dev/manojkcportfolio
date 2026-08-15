"""
URL configuration for contact app.
"""
from django.urls import path
from .views import ContactListCreateView, ContactDetailView

app_name = 'contact'

urlpatterns = [
    path('', ContactListCreateView.as_view(), name='contact-list'),
    path('<uuid:id>/', ContactDetailView.as_view(), name='contact-detail'),
]
