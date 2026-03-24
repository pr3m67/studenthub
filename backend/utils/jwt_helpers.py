from datetime import datetime

from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken


def issue_tokens_for_user(user_id: str):
    refresh = RefreshToken()
    refresh["user_id"] = user_id
    refresh["iat"] = int(datetime.now().timestamp())
    access = refresh.access_token
    return {
        "refresh": str(refresh),
        "access": str(access),
        "access_expires_in": int(settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"].total_seconds()),
        "refresh_expires_in": int(settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"].total_seconds()),
    }
