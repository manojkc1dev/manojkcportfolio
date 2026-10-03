"""
URL routing for Resume API.
"""
from django.urls import path
from .views import ActiveResumeDataRecordView, ActiveResumeMetadataView, ResumeDownloadView

app_name = 'resume'

urlpatterns = [
    path('resume/', ActiveResumeDataRecordView.as_view(), name='active_resume_data'),
    path('resume/metadata/', ActiveResumeMetadataView.as_view(), name='resume_metadata'),
    path('resume/download/', ResumeDownloadView.as_view(), name='resume_download'),
]
