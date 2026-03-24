from mongoengine import DateTimeField, StringField

from utils.documents import TimestampedDocument


class TimetableEntry(TimestampedDocument):
    user_id = StringField(required=True)
    day = StringField(required=True)
    start_time = StringField(required=True)
    end_time = StringField(required=True)
    subject = StringField(required=True)
    teacher = StringField(required=True)
    venue = StringField(required=True)
    color_tag = StringField(required=True)
    slot_key = StringField()
    batch_group = StringField()
    raw_text = StringField()
    source_type = StringField(default="uploaded")

    meta = {
        "collection": "timetable_entries",
        "indexes": ["user_id", "day", "start_time", "created_at"],
    }
