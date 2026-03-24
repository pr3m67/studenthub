from rest_framework import serializers


class TaskSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    title = serializers.CharField()
    due_date = serializers.DateTimeField()
    priority = serializers.ChoiceField(choices=["high", "medium", "low"])
    completed = serializers.BooleanField(required=False)

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["id"] = str(instance.id)
        return data


class NoteSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    subject = serializers.CharField()
    content = serializers.CharField()
    updated_at = serializers.DateTimeField(read_only=True)

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["id"] = str(instance.id)
        return data
