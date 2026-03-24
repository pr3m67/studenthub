from mongoengine import DateTimeField, FloatField, ListField, StringField

from utils.documents import TimestampedDocument


class Event(TimestampedDocument):
    title = StringField(required=True)
    category = StringField(required=True)
    date = DateTimeField(required=True)
    venue = StringField(required=True)
    description = StringField(required=True)
    image_url = StringField()
    created_by = StringField(required=True)
    interested_users = ListField(StringField(), default=list)
    going_users = ListField(StringField(), default=list)

    meta = {"collection": "events", "indexes": ["category", "date", "created_at"]}
