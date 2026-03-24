from statistics import mean

from django.core.cache import cache
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Result, ResultSubject
from .serializers import PredictSerializer, ResultSerializer

GRADE_POINTS = {
    "O": 10,
    "A+": 9,
    "A": 8,
    "B+": 7,
    "B": 6,
    "C": 5,
    "F": 0,
}


def compute_sgpa(subjects):
    total_points = 0
    total_credits = 0
    for subject in subjects:
        credits = subject["credits"]
        total_points += GRADE_POINTS.get(subject["grade"], 0) * credits
        total_credits += credits
    return round(total_points / total_credits, 2) if total_credits else 0


class ResultListView(APIView):
    def get(self, request):
        cache_key = f"results:{request.user.id}"
        payload = cache.get(cache_key)
        if not payload:
            payload = ResultSerializer(Result.objects(user_id=request.user.id).order_by("semester"), many=True).data
            cache.set(cache_key, payload, timeout=300)
        return Response({"success": True, "data": payload})


class CGPAView(APIView):
    def get(self, request):
        results = Result.objects(user_id=request.user.id)
        cgpa = round(mean([result.sgpa for result in results]), 2) if results else 0
        return Response({"success": True, "data": {"cgpa": cgpa}})


class ComparisonView(APIView):
    def get(self, request):
        results = Result.objects(user_id=request.user.id).order_by("semester")
        return Response({"success": True, "data": [{"semester": result.semester, "sgpa": result.sgpa} for result in results]})


class PredictView(APIView):
    def post(self, request):
        serializer = PredictSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        subjects = serializer.validated_data["subjects"]
        predicted_sgpa = compute_sgpa(subjects)
        return Response({"success": True, "data": {"semester": serializer.validated_data["semester"], "predicted_sgpa": predicted_sgpa}})


class BacklogsView(APIView):
    def get(self, request):
        backlog_subjects = []
        for result in Result.objects(user_id=request.user.id):
            for subject in result.subjects:
                if subject.grade == "F":
                    backlog_subjects.append({"semester": result.semester, "subject": subject.name, "grade": subject.grade})
        return Response({"success": True, "data": backlog_subjects})
