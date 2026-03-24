from mongoengine import DateField, EmbeddedDocument, EmbeddedDocumentField, FloatField, IntField, ListField, StringField

from utils.documents import TimestampedDocument


class ResultSubject(EmbeddedDocument):
    name = StringField(required=True)
    internal_marks = FloatField(required=True)
    external_marks = FloatField(required=True)
    grade = StringField(required=True)
    credits = IntField(required=True)


class Result(TimestampedDocument):
    user_id = StringField(required=True)
    semester = IntField(required=True)
    subjects = ListField(EmbeddedDocumentField(ResultSubject), default=list)
    sgpa = FloatField(required=True)
    cgpa = FloatField(required=True)
    declared_on = DateField(required=True)

    meta = {"collection": "results", "indexes": ["user_id", "semester", "created_at"]}
