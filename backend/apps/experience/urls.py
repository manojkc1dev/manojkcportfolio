"""
URL configuration for experience app.
"""
from django.urls import path
from .views import ExperienceListCreateView, ExperienceDetailView

app_name = 'experience'

urlpatterns = [
    path('', ExperienceListCreateView.as_view(), name='experience-list'),
    path('<uuid:id>/', ExperienceDetailView.as_view(), name='experience-detail'),
]
