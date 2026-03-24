from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/", include("apps.accounts.urls")),
    path("api/user/", include("apps.accounts.profile_urls")),
    path("api/timetable/", include("apps.timetable.urls")),
    path("api/attendance/", include("apps.attendance.urls")),
    path("api/results/", include("apps.results.urls")),
    path("api/events/", include("apps.events.urls")),
    path("api/clubs/", include("apps.clubs.urls")),
    path("api/notices/", include("apps.notices.urls")),
    path("api/studytools/", include("apps.studytools.urls")),
    path("api/placement/", include("apps.placement.urls")),
]
