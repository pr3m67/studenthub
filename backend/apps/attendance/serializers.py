from rest_framework import serializers


class AttendanceSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    user_id = serializers.CharField()
    subject = serializers.CharField()
    date = serializers.DateField(format="%Y-%m-%d", input_formats=["%Y-%m-%d"])
    status = serializers.ChoiceField(choices=["present", "absent", "cancelled"])
    marked_by = serializers.CharField(required=False)

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["id"] = str(instance.id)
        return data


class BulkAttendanceSerializer(serializers.Serializer):
    file = serializers.FileField()


class TeacherAttendanceBoardSerializer(serializers.Serializer):
    division = serializers.CharField()
    batch = serializers.CharField()
    subject = serializers.CharField()
    date = serializers.DateField(format="%Y-%m-%d", input_formats=["%Y-%m-%d"])
    records = serializers.ListField(child=serializers.DictField())
