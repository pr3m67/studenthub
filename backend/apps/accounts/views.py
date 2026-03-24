import random
from datetime import datetime, timedelta

from bson import ObjectId
from django.conf import settings
from django.core import signing
from django.http import FileResponse, Http404, JsonResponse
from gridfs import GridFS
from pymongo import MongoClient
from rest_framework import permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.views import APIView

from utils.storage import save_uploaded_file
from .models import PasswordResetOTP, User
from .serializers import (
    LoginSerializer,
    PasswordResetConfirmSerializer,
    PasswordResetRequestSerializer,
    ProfileUpdateSerializer,
    RegisterSerializer,
    UserSerializer,
)
from .tasks import send_otp_email


def _serialize_user(user):
    return UserSerializer(user).data


def _json_success(payload=None, status_code=200):
    body = {"success": True}
    if payload:
        body.update(payload)
    return JsonResponse(body, status=status_code)


def _json_error(code, message, field_errors=None, status_code=400):
    return JsonResponse(
        {
            "success": False,
            "error": {
                "code": code,
                "message": message,
                "field_errors": field_errors or {},
            },
        },
        status=status_code,
    )


def _auth_response(user):
    payload = {
        "message": "Authentication successful.",
        "data": {
            "user": _serialize_user(user),
        },
    }
    response = _json_success(payload, status_code=status.HTTP_200_OK)
    session_token = signing.dumps(str(user.id), key=settings.SECRET_KEY, salt="studenthub.auth")
    response.set_cookie("studenthub_session", session_token, httponly=True, samesite="Lax", secure=False, max_age=60 * 60 * 24 * 7)
    return response


class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return _auth_response(user)


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = User.objects(email=serializer.validated_data["email"].lower()).first()
        if not user or not user.check_password(serializer.validated_data["password"]):
            return _json_error("AUTH_001", "Invalid credentials.", status_code=400)
        requested_role = serializer.validated_data.get("role", "student")
        if user.role != "admin" and user.role != requested_role:
            return _json_error("AUTH_006", f"This login belongs to a {user.role} account. Switch the role tab and try again.", status_code=403)
        user.touch_login()
        return _auth_response(user)


class RefreshView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        user = request.user if getattr(request, "user", None) and getattr(request.user, "is_authenticated", False) else None
        if not user:
            signed_session = request.COOKIES.get("studenthub_session")
            if signed_session:
                try:
                    user_id = signing.loads(signed_session, key=settings.SECRET_KEY, salt="studenthub.auth")
                    user = User.objects(id=user_id).first()
                except signing.BadSignature:
                    user = None
        if not user:
            return _json_error("AUTH_002", "Session missing or invalid.", status_code=401)
        return _auth_response(user)


class LogoutView(APIView):
    def post(self, request):
        response = _json_success({"message": "Logged out."})
        response.delete_cookie("studenthub_session")
        return response


class PasswordResetView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"].lower()
        otp = f"{random.randint(100000, 999999)}"
        PasswordResetOTP.objects(email=email).delete()
        PasswordResetOTP(email=email, otp=otp, expires_at=datetime.utcnow() + timedelta(minutes=10)).save()
        send_otp_email.delay(email, otp)
        return _json_success({"message": "OTP sent to email."})


class PasswordConfirmView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"].lower()
        otp_record = PasswordResetOTP.objects(email=email, otp=serializer.validated_data["otp"]).first()
        if not otp_record or otp_record.expires_at < datetime.utcnow():
            return _json_error("AUTH_004", "OTP expired or invalid.", status_code=400)
        user = User.objects(email=email).first()
        if not user:
            return _json_error("AUTH_005", "User not found.", status_code=404)
        user.set_password(serializer.validated_data["password"])
        user.save()
        otp_record.delete()
        return _json_success({"message": "Password updated."})


class ProfileView(APIView):
    def get(self, request):
        return _json_success({"data": _serialize_user(request.user)})

    def put(self, request):
        serializer = ProfileUpdateSerializer(data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        for key, value in serializer.validated_data.items():
            if key == "profile_photo":
                continue
            setattr(request.user, key, value)
        if request.FILES.get("profile_photo"):
            uploaded = save_uploaded_file(request.FILES["profile_photo"], optimize_image=True)
            request.user.profile_pic = uploaded["url"]
        request.user.save()
        return _json_success({"data": _serialize_user(request.user)})


@api_view(["GET"])
@permission_classes([permissions.AllowAny])
def file_proxy_view(request, file_id):
    client = MongoClient(settings.MONGODB_URI)
    db = client[settings.MONGODB_DB]
    fs = GridFS(db)
    try:
        grid_out = fs.get(ObjectId(file_id))
    except Exception as exc:
        raise Http404 from exc
    return FileResponse(grid_out, filename=grid_out.filename, content_type=grid_out.content_type)
