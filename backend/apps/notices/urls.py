from django.urls import path

from .views import NoticeDeleteView, NoticeListCreateView, NoticePinView, NoticeReadView

urlpatterns = [
    path("", NoticeListCreateView.as_view()),
    path("<str:notice_id>/read/", NoticeReadView.as_view()),
    path("<str:notice_id>/pin/", NoticePinView.as_view()),
    path("<str:notice_id>/", NoticeDeleteView.as_view()),
]
