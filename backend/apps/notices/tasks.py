from celery import shared_task


@shared_task
def push_notice_notification(notice_id: str):
    return {"notice_id": notice_id, "status": "queued"}
