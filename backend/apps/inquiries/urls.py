"""
URL routing for Inquiries API.

POST /api/v1/inquiries/ -> Public inquiry creation (AllowAny)
GET /api/v1/inquiries/  -> Admin inquiries list (IsAuthenticated)
GET /api/v1/inquiries/<uuid:pk>/ -> Admin inquiry detail (IsAuthenticated)
PATCH/PUT /api/v1/inquiries/<uuid:pk>/ -> Admin inquiry update (IsAuthenticated)
DELETE /api/v1/inquiries/<uuid:pk>/ -> Admin inquiry delete (IsAuthenticated)
"""
from django.urls import path
from .views import InquiryListCreateView, InquiryDetailView

app_name = 'inquiries'

urlpatterns = [
    path('inquiries/', InquiryListCreateView.as_view(), name='inquiry_list_create'),
    path('inquiries/<uuid:pk>/', InquiryDetailView.as_view(), name='inquiry_detail'),
]
