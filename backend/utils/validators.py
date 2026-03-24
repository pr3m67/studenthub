import re
from datetime import datetime

from rest_framework.exceptions import ValidationError


UNIVERSITY_EMAIL_PATTERN = re.compile(r"^[A-Za-z0-9._%+-]+@university\.edu$")


def validate_university_email(value: str) -> str:
    if not UNIVERSITY_EMAIL_PATTERN.match(value or ""):
        raise ValidationError("Use a valid @university.edu email address.")
    return value.lower()


def validate_time_string(value: str) -> str:
    try:
        datetime.strptime(value, "%H:%M")
    except (TypeError, ValueError) as exc:
        raise ValidationError("Time must use HH:MM 24-hour format.") from exc
    return value
