from mongoengine import DateTimeField, FloatField, ListField, StringField

from utils.documents import TimestampedDocument


class PlacementDrive(TimestampedDocument):
    company = StringField(required=True)
    logo_url = StringField()
    ctc = FloatField(required=True)
    eligibility = StringField(required=True)
    date = DateTimeField(required=True)
    description = StringField(required=True)
    interested_users = ListField(StringField(), default=list)

    meta = {"collection": "placement_drives", "indexes": ["company", "date", "created_at"]}
