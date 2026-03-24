from mongoengine import BooleanField, ListField, StringField

from utils.documents import TimestampedDocument


class Notice(TimestampedDocument):
    title = StringField(required=True)
    body = StringField(required=True)
    priority = StringField(required=True, choices=("urgent", "important", "general"))
    category = StringField(required=True)
    read_by = ListField(StringField(), default=list)
    pinned = BooleanField(default=False)

    meta = {"collection": "notices", "indexes": ["category", "priority", "created_at", "pinned"]}
