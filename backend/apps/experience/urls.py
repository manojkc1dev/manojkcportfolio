"""
URL routing for Career Experience API.
"""
from django.urls import path
from .views import ExperienceListView, ExperienceDetailView

app_name = 'experience'

urlpatterns = [
    path('experience/', ExperienceListView.as_view(), name='experience_list'),
    path('experience/<str:id>/', ExperienceDetailView.as_view(), name='experience_detail'),
]
