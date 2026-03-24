from django.urls import path

from .views import BacklogsView, CGPAView, ComparisonView, PredictView, ResultListView

urlpatterns = [
    path("", ResultListView.as_view()),
    path("cgpa/", CGPAView.as_view()),
    path("comparison/", ComparisonView.as_view()),
    path("predict/", PredictView.as_view()),
    path("backlogs/", BacklogsView.as_view()),
]
