"""
URL configuration for testimonials app.
"""
from django.urls import path
from .views import TestimonialListCreateView, TestimonialDetailView

app_name = 'testimonials'

urlpatterns = [
    path('', TestimonialListCreateView.as_view(), name='testimonial-list'),
    path('<uuid:id>/', TestimonialDetailView.as_view(), name='testimonial-detail'),
]
