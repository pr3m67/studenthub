from rest_framework import serializers


class PlacementDriveSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    company = serializers.CharField()
    logo_url = serializers.CharField(required=False, allow_blank=True)
    ctc = serializers.FloatField()
    eligibility = serializers.CharField()
    date = serializers.DateTimeField()
    description = serializers.CharField()
    interested_users = serializers.ListField(child=serializers.CharField(), required=False)

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["id"] = str(instance.id)
        data["interest_count"] = len(instance.interested_users)
        return data
