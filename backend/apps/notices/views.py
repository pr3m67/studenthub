from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.core.paginator import Paginator
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Notice
from .serializers import NoticeSerializer
from .tasks import push_notice_notification


class NoticeListCreateView(APIView):
    def get(self, request):
        queryset = Notice.objects.order_by("-pinned", "-created_at")
        category = request.query_params.get("category")
        priority = request.query_params.get("priority")
        if category:
            queryset = queryset.filter(category__iexact=category)
        if priority:
            queryset = queryset.filter(priority=priority)
        paginator = Paginator(list(queryset), 20)
        page = paginator.get_page(int(request.query_params.get("page", 1)))
        return Response({"success": True, "data": NoticeSerializer(page.object_list, many=True).data, "count": paginator.count})

    def post(self, request):
        if request.user.role != "admin":
            return Response({"success": False, "error": {"code": "NOTICE_001", "message": "Admin access required.", "field_errors": {}}}, status=403)
        serializer = NoticeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        notice = Notice(**serializer.validated_data).save()
        payload = {
            "type": "notice.created",
            "id": str(notice.id),
            "title": notice.title,
            "priority": notice.priority,
            "category": notice.category,
            "created_at": notice.created_at.isoformat(),
        }
        async_to_sync(get_channel_layer().group_send)("notices_global", {"type": "notice_message", "payload": payload})
        if notice.priority == "urgent":
            push_notice_notification.delay(str(notice.id))
        return Response({"success": True, "data": NoticeSerializer(notice).data}, status=status.HTTP_201_CREATED)


class NoticeReadView(APIView):
    def patch(self, request, notice_id):
        notice = Notice.objects(id=notice_id).first()
        if not notice:
            return Response({"success": False, "error": {"code": "NOTICE_404", "message": "Notice not found.", "field_errors": {}}}, status=404)
        if request.user.id not in notice.read_by:
            notice.read_by.append(request.user.id)
            notice.save()
        return Response({"success": True, "data": NoticeSerializer(notice).data})


class NoticePinView(APIView):
    def patch(self, request, notice_id):
        if request.user.role != "admin":
            return Response({"success": False, "error": {"code": "NOTICE_001", "message": "Admin access required.", "field_errors": {}}}, status=403)
        notice = Notice.objects(id=notice_id).first()
        if not notice:
            return Response({"success": False, "error": {"code": "NOTICE_404", "message": "Notice not found.", "field_errors": {}}}, status=404)
        notice.pinned = not notice.pinned
        notice.save()
        return Response({"success": True, "data": NoticeSerializer(notice).data})


class NoticeDeleteView(APIView):
    def delete(self, request, notice_id):
        if request.user.role != "admin":
            return Response({"success": False, "error": {"code": "NOTICE_001", "message": "Admin access required.", "field_errors": {}}}, status=403)
        notice = Notice.objects(id=notice_id).first()
        if not notice:
            return Response({"success": False, "error": {"code": "NOTICE_404", "message": "Notice not found.", "field_errors": {}}}, status=404)
        notice.delete()
        return Response({"success": True})
