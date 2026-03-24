from rest_framework import serializers


class NoticeSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    title = serializers.CharField()
    body = serializers.CharField()
    priority = serializers.ChoiceField(choices=["urgent", "important", "general"])
    category = serializers.CharField()
    read_by = serializers.ListField(child=serializers.CharField(), required=False)
    pinned = serializers.BooleanField(required=False)
    created_at = serializers.DateTimeField(read_only=True)

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["id"] = str(instance.id)
        return data
