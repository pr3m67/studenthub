from datetime import datetime

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Note, Task
from .serializers import NoteSerializer, TaskSerializer


class TasksView(APIView):
    def get(self, request):
        tasks = Task.objects(user_id=request.user.id).order_by("due_date")
        return Response({"success": True, "data": TaskSerializer(tasks, many=True).data})

    def post(self, request):
        serializer = TaskSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        task = Task(user_id=request.user.id, **serializer.validated_data).save()
        return Response({"success": True, "data": TaskSerializer(task).data}, status=status.HTTP_201_CREATED)


class TaskDetailView(APIView):
    def patch(self, request, task_id):
        task = Task.objects(id=task_id, user_id=request.user.id).first()
        if not task:
            return Response({"success": False, "error": {"code": "TASK_404", "message": "Task not found.", "field_errors": {}}}, status=404)
        serializer = TaskSerializer(data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        for key, value in serializer.validated_data.items():
            setattr(task, key, value)
        task.save()
        return Response({"success": True, "data": TaskSerializer(task).data})

    def delete(self, request, task_id):
        task = Task.objects(id=task_id, user_id=request.user.id).first()
        if not task:
            return Response({"success": False, "error": {"code": "TASK_404", "message": "Task not found.", "field_errors": {}}}, status=404)
        task.delete()
        return Response({"success": True})


class NotesView(APIView):
    def get(self, request):
        notes = Note.objects(user_id=request.user.id).order_by("-updated_at")
        return Response({"success": True, "data": NoteSerializer(notes, many=True).data})

    def post(self, request):
        serializer = NoteSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        note = Note.objects(user_id=request.user.id, subject=serializer.validated_data["subject"]).first()
        if note:
            note.content = serializer.validated_data["content"]
            note.updated_at = datetime.utcnow()
            note.save()
        else:
            note = Note(user_id=request.user.id, **serializer.validated_data).save()
        return Response({"success": True, "data": NoteSerializer(note).data}, status=status.HTTP_201_CREATED)


class NoteDeleteView(APIView):
    def delete(self, request, note_id):
        note = Note.objects(id=note_id, user_id=request.user.id).first()
        if not note:
            return Response({"success": False, "error": {"code": "NOTE_404", "message": "Note not found.", "field_errors": {}}}, status=404)
        note.delete()
        return Response({"success": True})
