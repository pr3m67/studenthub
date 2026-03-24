import json

from rest_framework import serializers

from utils.validators import validate_university_email
from .models import User


class UserSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    name = serializers.CharField()
    email = serializers.EmailField()
    role = serializers.CharField()
    roll_no = serializers.CharField(allow_blank=True, required=False)
    department = serializers.CharField(allow_blank=True, required=False)
    semester = serializers.CharField(allow_blank=True, required=False)
    profile_pic = serializers.CharField(allow_blank=True, required=False)
    joined_clubs = serializers.ListField(child=serializers.CharField(), required=False)
    resume_url = serializers.CharField(allow_blank=True, required=False)
    skills = serializers.ListField(child=serializers.CharField(), required=False)
    projects = serializers.ListField(child=serializers.CharField(), required=False)
    profile_completeness = serializers.SerializerMethodField()

    def get_profile_completeness(self, obj):
        return obj.profile_completeness()

    def to_representation(self, instance):
        return {
            "id": str(instance.id),
            "name": instance.name,
            "email": instance.email,
            "role": instance.role,
            "roll_no": instance.roll_no or "",
            "department": instance.department or "",
            "semester": instance.semester or "",
            "division": instance.division or "",
            "batch": instance.batch or "",
            "profile_pic": instance.profile_pic or "",
            "joined_clubs": [str(item) for item in (instance.joined_clubs or [])],
            "selected_subjects": [str(item) for item in (instance.selected_subjects or [])],
            "resume_url": instance.resume_url or "",
            "skills": [str(item) for item in (instance.skills or [])],
            "projects": [str(item) for item in (instance.projects or [])],
            "profile_completeness": instance.profile_completeness(),
        }


class RegisterSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=120)
    email = serializers.EmailField(validators=[validate_university_email])
    password = serializers.CharField(min_length=8, write_only=True)
    role = serializers.ChoiceField(choices=["student", "teacher"], default="student")
    roll_no = serializers.CharField(required=False, allow_blank=True)
    department = serializers.CharField(required=False, allow_blank=True)
    semester = serializers.CharField(required=False, allow_blank=True)
    division = serializers.CharField(required=False, allow_blank=True)
    batch = serializers.CharField(required=False, allow_blank=True)

    def validate_email(self, value):
        validate_university_email(value)
        if User.objects(email=value.lower()).first():
            raise serializers.ValidationError("An account with this email already exists.")
        return value.lower()

    def validate(self, attrs):
        email = attrs.get("email", "").lower()
        role = attrs.get("role", "student")
        if role == "teacher" and not email.startswith("faculty."):
            raise serializers.ValidationError({"email": ["Teacher accounts must use an email like faculty.name@university.edu."]})
        if role == "student" and email.startswith("faculty."):
            raise serializers.ValidationError({"email": ["Student accounts cannot use faculty-prefixed email IDs."]})
        return attrs

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    role = serializers.ChoiceField(choices=["student", "teacher"], required=False, default="student")


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField(validators=[validate_university_email])


class PasswordResetConfirmSerializer(serializers.Serializer):
    email = serializers.EmailField(validators=[validate_university_email])
    otp = serializers.CharField(min_length=6, max_length=6)
    password = serializers.CharField(min_length=8)


class ProfileUpdateSerializer(serializers.Serializer):
    name = serializers.CharField(required=False)
    roll_no = serializers.CharField(required=False, allow_blank=True)
    department = serializers.CharField(required=False, allow_blank=True)
    semester = serializers.CharField(required=False, allow_blank=True)
    division = serializers.CharField(required=False, allow_blank=True)
    batch = serializers.CharField(required=False, allow_blank=True)
    profile_photo = serializers.ImageField(required=False)
    selected_subjects = serializers.ListField(child=serializers.CharField(), required=False)
    skills = serializers.ListField(child=serializers.CharField(), required=False)
    projects = serializers.ListField(child=serializers.CharField(), required=False)

    def to_internal_value(self, data):
        normalized = {}
        if hasattr(data, "keys"):
            for key in data.keys():
                if hasattr(data, "getlist"):
                    values = data.getlist(key)
                    normalized[key] = values if len(values) > 1 else (values[0] if values else None)
                else:
                    normalized[key] = data.get(key)
        for field in ("skills", "projects", "selected_subjects"):
            value = None
            if hasattr(data, "getlist"):
                values = data.getlist(field)
                if len(values) > 1:
                    value = values
                elif len(values) == 1:
                    value = values[0]
            if value is None:
                value = normalized.get(field)
            if isinstance(value, str):
                try:
                    normalized[field] = json.loads(value)
                except json.JSONDecodeError:
                    normalized[field] = [item.strip() for item in value.split(",") if item.strip()]
            elif isinstance(value, list):
                parsed = []
                for item in value:
                    if isinstance(item, str):
                        try:
                            loaded = json.loads(item)
                            if isinstance(loaded, list):
                                parsed.extend(str(entry).strip() for entry in loaded if str(entry).strip())
                            else:
                                parsed.append(str(loaded).strip())
                        except json.JSONDecodeError:
                            if item.strip():
                                parsed.append(item.strip())
                    elif item is not None:
                        parsed.append(str(item).strip())
                normalized[field] = [item for item in parsed if item]
        return super().to_internal_value(normalized)
