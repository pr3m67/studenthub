from django.conf import settings
from django.core import signing
from rest_framework import authentication, exceptions

from .models import User


class MongoJWTAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        signed_session = request.COOKIES.get("studenthub_session")
        if not signed_session:
            return None
        try:
            user_id = signing.loads(signed_session, key=settings.SECRET_KEY, salt="studenthub.auth")
        except signing.BadSignature as exc:
            raise exceptions.AuthenticationFailed("Invalid session.") from exc
        user = User.objects(id=user_id).first()
        if not user:
            raise exceptions.AuthenticationFailed("User not found.")
        return (user, None)
