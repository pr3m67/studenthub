from mongoengine import BooleanField, DateTimeField, StringField

from utils.documents import TimestampedDocument


class AttendanceRecord(TimestampedDocument):
    user_id = StringField(required=True)
    subject = StringField(required=True)
    date = StringField(required=True)
    status = StringField(choices=("present", "absent", "cancelled"), required=True)
    marked_by = StringField(required=True)

    meta = {
        "collection": "attendance",
        "indexes": ["user_id", "date", "subject", "created_at"],
    }
