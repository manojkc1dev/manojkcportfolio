"""
URL configuration for clients app.
"""
from django.urls import path
from .views import ClientListCreateView, ClientDetailView

app_name = 'clients'

urlpatterns = [
    path('', ClientListCreateView.as_view(), name='client-list'),
    path('<uuid:id>/', ClientDetailView.as_view(), name='client-detail'),
]
