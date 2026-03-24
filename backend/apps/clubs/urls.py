from django.urls import path

from .views import ClubDetailView, ClubJoinView, ClubListView, ClubPostDeleteView, ClubPostsView

urlpatterns = [
    path("", ClubListView.as_view()),
    path("<str:club_id>/", ClubDetailView.as_view()),
    path("<str:club_id>/join/", ClubJoinView.as_view()),
    path("<str:club_id>/posts/", ClubPostsView.as_view()),
    path("<str:club_id>/posts/<str:post_id>/", ClubPostDeleteView.as_view()),
]
