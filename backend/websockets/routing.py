from django.urls import path

from .consumers import AttendanceConsumer, NoticeConsumer

websocket_urlpatterns = [
    path("ws/notices/", NoticeConsumer.as_asgi()),
    path("ws/attendance/", AttendanceConsumer.as_asgi()),
]
