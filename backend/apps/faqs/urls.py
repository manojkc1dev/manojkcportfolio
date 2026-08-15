"""
URL configuration for FAQs app.
"""
from django.urls import path
from .views import FAQCategoryListCreateView, FAQCategoryDetailView, FAQListCreateView, FAQDetailView

app_name = 'faqs'

urlpatterns = [
    # FAQ Categories
    path('categories/', FAQCategoryListCreateView.as_view(), name='category-list'),
    path('categories/<slug:slug>/', FAQCategoryDetailView.as_view(), name='category-detail'),
    
    # FAQs
    path('', FAQListCreateView.as_view(), name='faq-list'),
    path('<uuid:id>/', FAQDetailView.as_view(), name='faq-detail'),
]
