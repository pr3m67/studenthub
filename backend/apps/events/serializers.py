from rest_framework import serializers


class EventSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    title = serializers.CharField()
    category = serializers.CharField()
    date = serializers.DateTimeField()
    venue = serializers.CharField()
    description = serializers.CharField()
    image_url = serializers.CharField(required=False, allow_blank=True)
    created_by = serializers.CharField(required=False)
    interested_users = serializers.ListField(child=serializers.CharField(), required=False)
    going_users = serializers.ListField(child=serializers.CharField(), required=False)

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["id"] = str(instance.id)
        return data
