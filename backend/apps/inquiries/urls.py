"""
URL routing for Inquiries API.

Only a single POST endpoint is exposed publicly.
No GET/list endpoint is registered; attempting to GET /api/v1/inquiries/ returns 405.
"""
from django.urls import path
from .views import InquiryCreateView

app_name = 'inquiries'

urlpatterns = [
    path('inquiries/', InquiryCreateView.as_view(), name='inquiry_create'),
]
