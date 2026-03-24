from django.urls import path

from .views import (
    AttendanceBulkUploadView,
    AttendanceCalendarView,
    AttendanceMarkView,
    AttendancePredictionView,
    AttendanceReportView,
    AttendanceSummaryView,
    TeacherAttendanceBoardView,
)

urlpatterns = [
    path("mark/", AttendanceMarkView.as_view()),
    path("bulk-upload/", AttendanceBulkUploadView.as_view()),
    path("summary/", AttendanceSummaryView.as_view()),
    path("calendar/", AttendanceCalendarView.as_view()),
    path("prediction/", AttendancePredictionView.as_view()),
    path("report/", AttendanceReportView.as_view()),
    path("teacher-board/", TeacherAttendanceBoardView.as_view()),
]
