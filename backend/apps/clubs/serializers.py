from rest_framework import serializers


class ClubSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    name = serializers.CharField()
    description = serializers.CharField()
    logo_url = serializers.CharField(required=False, allow_blank=True)
    category = serializers.CharField()
    member_ids = serializers.ListField(child=serializers.CharField(), required=False)
    achievements = serializers.ListField(child=serializers.CharField(), required=False)

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["id"] = str(instance.id)
        data["member_count"] = len(instance.member_ids)
        return data


class ClubPostSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    club_id = serializers.CharField()
    content = serializers.CharField()
    image_url = serializers.CharField(required=False, allow_blank=True)
    likes = serializers.ListField(child=serializers.CharField(), required=False)
    created_at = serializers.DateTimeField(read_only=True)

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["id"] = str(instance.id)
        data["like_count"] = len(instance.likes)
        return data
