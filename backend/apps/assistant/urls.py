"""
URL routing for the AI Assistant API.
"""
from django.urls import path

from .views import AssistantContextView, AssistantFeedbackView, AssistantQueryView

app_name = 'assistant'

urlpatterns = [
    path('assistant/context/', AssistantContextView.as_view(), name='context'),
    path('assistant/query/', AssistantQueryView.as_view(), name='query'),
    path('assistant/feedback/', AssistantFeedbackView.as_view(), name='feedback'),
]
