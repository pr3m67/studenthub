from celery import shared_task

from apps.accounts.models import User
from .models import Event
from utils.notifications import send_email_notification


@shared_task
def send_event_reminder(user_id: str, event_id: str):
    user = User.objects(id=user_id).first()
    event = Event.objects(id=event_id).first()
    if not user or not event:
        return
    send_email_notification(
        f"Reminder: {event.title} is tomorrow",
        f"{event.title} starts at {event.date} in {event.venue}. You marked yourself as going.",
        [user.email],
    )
