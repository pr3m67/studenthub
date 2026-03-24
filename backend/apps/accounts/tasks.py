from celery import shared_task

from utils.notifications import send_email_notification


@shared_task
def send_otp_email(email: str, otp: str):
    send_email_notification(
        "StudentHub password reset OTP",
        f"Your StudentHub OTP is {otp}. It expires in 10 minutes.",
        [email],
    )
