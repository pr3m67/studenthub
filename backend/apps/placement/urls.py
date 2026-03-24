from django.urls import path

from .views import PlacementDriveDetailView, PlacementDriveListCreateView, PlacementInterestView, ResumeUploadView

urlpatterns = [
    path("", PlacementDriveListCreateView.as_view()),
    path("resume/", ResumeUploadView.as_view()),
    path("<str:drive_id>/", PlacementDriveDetailView.as_view()),
    path("<str:drive_id>/interest/", PlacementInterestView.as_view()),
]
