import json

from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async

from apps.notices.models import Notice


class NoticeConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.channel_layer.group_add("notices_global", self.channel_name)
        await self.accept()
        recent = await self._recent_notices()
        await self.send(text_data=json.dumps({"type": "connected", "group": "notices_global", "notices": recent}))

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard("notices_global", self.channel_name)

    async def notice_message(self, event):
        await self.send(text_data=json.dumps(event["payload"]))

    @sync_to_async
    def _recent_notices(self):
        notices = Notice.objects.order_by("-created_at")[:5]
        return [
            {
                "id": str(notice.id),
                "title": notice.title,
                "priority": notice.priority,
                "category": notice.category,
                "created_at": notice.created_at.isoformat(),
            }
            for notice in notices
        ]


class AttendanceConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        user = self.scope.get("user")
        user_id = getattr(user, "id", None) or "anonymous"
        self.group_name = f"attendance_{user_id}"
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def attendance_message(self, event):
        await self.send(text_data=json.dumps(event["payload"]))
