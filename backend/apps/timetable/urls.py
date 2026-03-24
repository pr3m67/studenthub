from django.urls import path

from .views import TimetableClearView, TimetableTemplateView, TimetableUploadView, TodayTimetableView, WeekTimetableView

urlpatterns = [
    path("upload/", TimetableUploadView.as_view()),
    path("today/", TodayTimetableView.as_view()),
    path("week/", WeekTimetableView.as_view()),
    path("template/", TimetableTemplateView.as_view()),
    path("clear/", TimetableClearView.as_view()),
]
