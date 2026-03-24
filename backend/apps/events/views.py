from datetime import datetime

from django.core.paginator import Paginator
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounts.permissions import IsAdminRole
from utils.storage import save_uploaded_file
from .models import Event
from .serializers import EventSerializer


def _toggle_value(items, value):
    values = list(items)
    if value in values:
        values.remove(value)
    else:
        values.append(value)
    return values


class EventListCreateView(APIView):
    def get(self, request):
        queryset = Event.objects.order_by("date")
        category = request.query_params.get("category")
        upcoming = request.query_params.get("upcoming")
        if category:
            queryset = queryset.filter(category__iexact=category)
        if upcoming == "true":
            queryset = queryset.filter(date__gte=datetime.utcnow())
        page = int(request.query_params.get("page", 1))
        paginator = Paginator(list(queryset), 20)
        paginated = paginator.get_page(page)
        return Response({"success": True, "data": EventSerializer(paginated.object_list, many=True).data, "count": paginator.count})

    def post(self, request):
        if request.user.role != "admin":
            return Response({"success": False, "error": {"code": "EVENT_001", "message": "Admin access required.", "field_errors": {}}}, status=403)
        payload = request.data.copy()
        if request.FILES.get("image"):
            payload["image_url"] = save_uploaded_file(request.FILES["image"], optimize_image=True)["url"]
        payload["created_by"] = request.user.id
        serializer = EventSerializer(data=payload)
        serializer.is_valid(raise_exception=True)
        event = Event(**serializer.validated_data).save()
        return Response({"success": True, "data": EventSerializer(event).data}, status=status.HTTP_201_CREATED)


class EventDetailView(APIView):
    def get_object(self, event_id):
        return Event.objects(id=event_id).first()

    def get(self, request, event_id):
        event = self.get_object(event_id)
        if not event:
            return Response({"success": False, "error": {"code": "EVENT_404", "message": "Event not found.", "field_errors": {}}}, status=404)
        return Response({"success": True, "data": EventSerializer(event).data})

    def put(self, request, event_id):
        if request.user.role != "admin":
            return Response({"success": False, "error": {"code": "EVENT_001", "message": "Admin access required.", "field_errors": {}}}, status=403)
        event = self.get_object(event_id)
        if not event:
            return Response({"success": False, "error": {"code": "EVENT_404", "message": "Event not found.", "field_errors": {}}}, status=404)
        payload = request.data.copy()
        if request.FILES.get("image"):
            payload["image_url"] = save_uploaded_file(request.FILES["image"], optimize_image=True)["url"]
        serializer = EventSerializer(data=payload, partial=True)
        serializer.is_valid(raise_exception=True)
        for key, value in serializer.validated_data.items():
            setattr(event, key, value)
        event.save()
        return Response({"success": True, "data": EventSerializer(event).data})

    def delete(self, request, event_id):
        if request.user.role != "admin":
            return Response({"success": False, "error": {"code": "EVENT_001", "message": "Admin access required.", "field_errors": {}}}, status=403)
        event = self.get_object(event_id)
        if not event:
            return Response({"success": False, "error": {"code": "EVENT_404", "message": "Event not found.", "field_errors": {}}}, status=404)
        event.delete()
        return Response({"success": True})


class EventInterestToggleView(APIView):
    field_name = "interested_users"

    def post(self, request, event_id):
        event = Event.objects(id=event_id).first()
        if not event:
            return Response({"success": False, "error": {"code": "EVENT_404", "message": "Event not found.", "field_errors": {}}}, status=404)
        setattr(event, self.field_name, _toggle_value(getattr(event, self.field_name), request.user.id))
        event.save()
        return Response({"success": True, "data": EventSerializer(event).data})


class EventGoingToggleView(EventInterestToggleView):
    field_name = "going_users"
