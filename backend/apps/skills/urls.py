"""
URL routing for Skills API.
"""
from django.urls import path
from .views import SkillCategoryListView

app_name = 'skills'

urlpatterns = [
    path('skills/', SkillCategoryListView.as_view(), name='skill_category_list'),
]
