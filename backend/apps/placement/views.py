from django.core.cache import cache
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from utils.storage import save_uploaded_file
from .models import PlacementDrive
from .serializers import PlacementDriveSerializer


class PlacementDriveListCreateView(APIView):
    def get(self, request):
        cache_key = "placement:list"
        payload = cache.get(cache_key)
        if not payload:
            payload = PlacementDriveSerializer(PlacementDrive.objects.order_by("date"), many=True).data
            cache.set(cache_key, payload, timeout=300)
        return Response({"success": True, "data": payload})

    def post(self, request):
        if request.user.role != "admin":
            return Response({"success": False, "error": {"code": "PLACEMENT_001", "message": "Admin access required.", "field_errors": {}}}, status=403)
        payload = request.data.copy()
        if request.FILES.get("logo"):
            payload["logo_url"] = save_uploaded_file(request.FILES["logo"], optimize_image=True)["url"]
        serializer = PlacementDriveSerializer(data=payload)
        serializer.is_valid(raise_exception=True)
        drive = PlacementDrive(**serializer.validated_data).save()
        cache.delete("placement:list")
        return Response({"success": True, "data": PlacementDriveSerializer(drive).data}, status=status.HTTP_201_CREATED)


class PlacementDriveDetailView(APIView):
    def get(self, request, drive_id):
        drive = PlacementDrive.objects(id=drive_id).first()
        if not drive:
            return Response({"success": False, "error": {"code": "PLACEMENT_404", "message": "Drive not found.", "field_errors": {}}}, status=404)
        return Response({"success": True, "data": PlacementDriveSerializer(drive).data})


class PlacementInterestView(APIView):
    def post(self, request, drive_id):
        drive = PlacementDrive.objects(id=drive_id).first()
        if not drive:
            return Response({"success": False, "error": {"code": "PLACEMENT_404", "message": "Drive not found.", "field_errors": {}}}, status=404)
        interested = list(drive.interested_users)
        if request.user.id in interested:
            interested.remove(request.user.id)
        else:
            interested.append(request.user.id)
        drive.interested_users = interested
        drive.save()
        cache.delete("placement:list")
        return Response({"success": True, "data": PlacementDriveSerializer(drive).data})


class ResumeUploadView(APIView):
    def post(self, request):
        file = request.FILES.get("file")
        if not file or not file.name.lower().endswith(".pdf"):
            return Response({"success": False, "error": {"code": "PLACEMENT_002", "message": "Upload a PDF resume.", "field_errors": {"file": ["Only PDF resumes are accepted."]}}}, status=400)
        uploaded = save_uploaded_file(file)
        request.user.resume_url = uploaded["url"]
        request.user.save()
        return Response({"success": True, "data": {"resume_url": uploaded["url"]}})
