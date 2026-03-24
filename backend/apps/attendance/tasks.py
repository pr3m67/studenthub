from celery import shared_task

from apps.accounts.models import User
from utils.notifications import send_email_notification


@shared_task
def send_attendance_warning_email(user_id: str, subject: str):
    user = User.objects(id=user_id).first()
    if not user:
        return
    send_email_notification(
        "Attendance warning from StudentHub",
        f"Your attendance in {subject} has dropped below 75%. Please plan your upcoming classes carefully.",
        [user.email],
    )
