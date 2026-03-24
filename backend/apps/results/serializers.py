from rest_framework import serializers


class ResultSubjectSerializer(serializers.Serializer):
    name = serializers.CharField()
    internal_marks = serializers.FloatField()
    external_marks = serializers.FloatField()
    grade = serializers.CharField()
    credits = serializers.IntegerField()


class ResultSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    user_id = serializers.CharField()
    semester = serializers.IntegerField()
    subjects = ResultSubjectSerializer(many=True)
    sgpa = serializers.FloatField()
    cgpa = serializers.FloatField()
    declared_on = serializers.DateField()

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["id"] = str(instance.id)
        return data


class PredictSerializer(serializers.Serializer):
    semester = serializers.IntegerField()
    subjects = ResultSubjectSerializer(many=True)
