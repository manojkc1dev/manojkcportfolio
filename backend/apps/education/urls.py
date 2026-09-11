"""
URL configuration for education app.
"""
from django.urls import path
from .views import EducationListCreateView, EducationDetailView

app_name = 'education'

urlpatterns = [
    path('', EducationListCreateView.as_view(), name='education-list'),
    path('<uuid:id>/', EducationDetailView.as_view(), name='education-detail'),
]
