from celery import shared_task

from apps.accounts.models import User
from .models import PlacementDrive
from utils.notifications import send_email_notification


@shared_task
def send_drive_reminder(user_id: str, drive_id: str):
    user = User.objects(id=user_id).first()
    drive = PlacementDrive.objects(id=drive_id).first()
    if not user or not drive:
        return
    send_email_notification(
        f"Placement reminder: {drive.company}",
        f"The placement drive for {drive.company} is scheduled on {drive.date}. Eligibility: {drive.eligibility}.",
        [user.email],
    )
