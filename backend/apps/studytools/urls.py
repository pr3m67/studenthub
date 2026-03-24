from django.urls import path

from .views import NoteDeleteView, NotesView, TaskDetailView, TasksView

urlpatterns = [
    path("tasks/", TasksView.as_view()),
    path("tasks/<str:task_id>/", TaskDetailView.as_view()),
    path("notes/", NotesView.as_view()),
    path("notes/<str:note_id>/", NoteDeleteView.as_view()),
]
