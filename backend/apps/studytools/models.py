from mongoengine import BooleanField, DateTimeField, StringField
from datetime import datetime

from utils.documents import TimestampedDocument


class Task(TimestampedDocument):
    user_id = StringField(required=True)
    title = StringField(required=True)
    due_date = DateTimeField(required=True)
    priority = StringField(required=True, choices=("high", "medium", "low"))
    completed = BooleanField(default=False)

    meta = {"collection": "tasks", "indexes": ["user_id", "due_date", "created_at"]}


class Note(TimestampedDocument):
    user_id = StringField(required=True)
    subject = StringField(required=True)
    content = StringField(required=True)
    updated_at = DateTimeField(default=datetime.utcnow)

    meta = {"collection": "notes", "indexes": ["user_id", "subject", "updated_at"]}
