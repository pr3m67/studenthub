from mongoengine import BooleanField, DateTimeField, Document
from datetime import datetime


class TimestampedDocument(Document):
    created_at = DateTimeField(default=datetime.utcnow)
    meta = {"abstract": True}


class SoftDeleteDocument(TimestampedDocument):
    is_active = BooleanField(default=True)
    meta = {"abstract": True}
