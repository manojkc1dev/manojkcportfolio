"""
URL configuration for achievements app.
"""
from django.urls import path
from .views import AchievementListCreateView, AchievementDetailView

app_name = 'achievements'

urlpatterns = [
    path('', AchievementListCreateView.as_view(), name='achievement-list'),
    path('<uuid:id>/', AchievementDetailView.as_view(), name='achievement-detail'),
]
