from datetime import datetime

from mongoengine import DateTimeField, EmailField, ListField, StringField
from werkzeug.security import check_password_hash, generate_password_hash

from utils.documents import TimestampedDocument


class User(TimestampedDocument):
    name = StringField(required=True, max_length=120)
    email = EmailField(required=True, unique=True)
    password_hash = StringField(required=True)
    role = StringField(required=True, choices=("student", "teacher", "admin"), default="student")
    roll_no = StringField()
    department = StringField()
    semester = StringField()
    division = StringField()
    batch = StringField()
    profile_pic = StringField()
    joined_clubs = ListField(StringField(), default=list)
    selected_subjects = ListField(StringField(), default=list)
    resume_url = StringField()
    skills = ListField(StringField(), default=list)
    projects = ListField(StringField(), default=list)
    onboarding_step = StringField(default="profile")
    last_login_at = DateTimeField()

    meta = {
        "collection": "users",
        "indexes": ["email", "role", "roll_no", "created_at"],
    }

    @property
    def is_authenticated(self):
        return True

    @property
    def id(self):
        return str(self.pk)

    @property
    def is_anonymous(self):
        return False

    def set_password(self, raw_password: str):
        self.password_hash = generate_password_hash(raw_password)

    def check_password(self, raw_password: str):
        return check_password_hash(self.password_hash, raw_password)

    def touch_login(self):
        self.last_login_at = datetime.utcnow()
        self.save()

    def profile_completeness(self):
        checks = [
            bool(self.name),
            bool(self.roll_no),
            bool(self.department),
            bool(self.semester),
            bool(self.division),
            bool(self.batch),
            bool(self.profile_pic),
            bool(self.resume_url),
            bool(self.skills),
            bool(self.projects),
        ]
        return round(sum(checks) / len(checks) * 100)


class PasswordResetOTP(TimestampedDocument):
    email = EmailField(required=True)
    otp = StringField(required=True)
    expires_at = DateTimeField(required=True)

    meta = {"collection": "password_reset_otps", "indexes": ["email", "expires_at", "created_at"]}
