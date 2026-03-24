from django.urls import path

from .views import EventDetailView, EventGoingToggleView, EventInterestToggleView, EventListCreateView

urlpatterns = [
    path("", EventListCreateView.as_view()),
    path("<str:event_id>/", EventDetailView.as_view()),
    path("<str:event_id>/interested/", EventInterestToggleView.as_view()),
    path("<str:event_id>/going/", EventGoingToggleView.as_view()),
]
