"""
URL configuration for resume app.
"""
from django.urls import path
from .views import ResumeListCreateView, ResumeDetailView

app_name = 'resume'

urlpatterns = [
    path('', ResumeListCreateView.as_view(), name='resume-list'),
    path('<uuid:id>/', ResumeDetailView.as_view(), name='resume-detail'),
]
