from rest_framework import serializers


class TimetableEntrySerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    user_id = serializers.CharField(read_only=True)
    day = serializers.CharField()
    start_time = serializers.CharField()
    end_time = serializers.CharField()
    subject = serializers.CharField()
    teacher = serializers.CharField()
    venue = serializers.CharField()
    color_tag = serializers.CharField()
    slot_key = serializers.CharField(required=False, allow_blank=True)
    batch_group = serializers.CharField(required=False, allow_blank=True)
    raw_text = serializers.CharField(required=False, allow_blank=True)
    source_type = serializers.CharField(required=False, allow_blank=True)

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["id"] = str(instance.id)
        return data
