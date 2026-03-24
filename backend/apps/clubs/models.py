from mongoengine import ListField, StringField

from utils.documents import TimestampedDocument


class Club(TimestampedDocument):
    name = StringField(required=True)
    description = StringField(required=True)
    logo_url = StringField()
    category = StringField(required=True)
    member_ids = ListField(StringField(), default=list)
    achievements = ListField(StringField(), default=list)

    meta = {"collection": "clubs", "indexes": ["category", "created_at"]}


class ClubPost(TimestampedDocument):
    club_id = StringField(required=True)
    content = StringField(required=True)
    image_url = StringField()
    likes = ListField(StringField(), default=list)

    meta = {"collection": "club_posts", "indexes": ["club_id", "created_at"]}
