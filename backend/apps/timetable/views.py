from datetime import datetime
from io import BytesIO

import openpyxl
from django.http import FileResponse, JsonResponse
from rest_framework import status
from rest_framework.views import APIView

from utils.excel_parser import EXPECTED_COLUMNS, extract_subject_catalog, parse_timetable_file
from utils.storage import save_bytes_to_gridfs
from .models import TimetableEntry
from .serializers import TimetableEntrySerializer


class TimetableUploadView(APIView):
    def post(self, request):
        user_id = str(request.user.pk)
        file = request.FILES.get("file")
        if not file or not file.name.endswith(".xlsx"):
            return JsonResponse({"success": False, "error": {"code": "TIMETABLE_001", "message": "Upload a valid .xlsx file.", "field_errors": {"file": ["Only .xlsx is supported."]}}}, status=400)
        content = file.read()
        parsed_entries = parse_timetable_file(content)
        TimetableEntry.objects(user_id=user_id).delete()
        for entry in parsed_entries:
            TimetableEntry(user_id=user_id, **entry).save()
        save_bytes_to_gridfs(content, file.name, file.content_type or "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
        subjects = extract_subject_catalog(content)
        return JsonResponse({"success": True, "count": len(parsed_entries), "subjects": subjects, "message": "Timetable uploaded successfully."}, status=status.HTTP_201_CREATED)


class TodayTimetableView(APIView):
    def get(self, request):
        user_id = str(request.user.pk)
        today = datetime.now().strftime("%A")
        entries = TimetableEntry.objects(user_id=user_id, day=today).order_by("start_time")
        return JsonResponse({"success": True, "data": TimetableEntrySerializer(entries, many=True).data})


class WeekTimetableView(APIView):
    def get(self, request):
        user_id = str(request.user.pk)
        entries = TimetableEntry.objects(user_id=user_id).order_by("day", "start_time")
        return JsonResponse({"success": True, "data": TimetableEntrySerializer(entries, many=True).data})


class TimetableTemplateView(APIView):
    def get(self, request):
        workbook = openpyxl.Workbook()
        sheet = workbook.active
        sheet.title = "Timetable"
        sheet.append(EXPECTED_COLUMNS)
        buffer = BytesIO()
        workbook.save(buffer)
        buffer.seek(0)
        return FileResponse(buffer, filename="studenthub_timetable_template.xlsx", as_attachment=True)


class TimetableClearView(APIView):
    def delete(self, request):
        user_id = str(request.user.pk)
        deleted = TimetableEntry.objects(user_id=user_id).delete()
        return JsonResponse({"success": True, "deleted": deleted})
