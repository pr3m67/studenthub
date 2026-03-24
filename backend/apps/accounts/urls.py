from django.urls import path

from .views import (
    LoginView,
    LogoutView,
    PasswordConfirmView,
    PasswordResetView,
    RefreshView,
    RegisterView,
    file_proxy_view,
)

urlpatterns = [
    path("register/", RegisterView.as_view()),
    path("login/", LoginView.as_view()),
    path("token/refresh/", RefreshView.as_view()),
    path("logout/", LogoutView.as_view()),
    path("password-reset/", PasswordResetView.as_view()),
    path("password-confirm/", PasswordConfirmView.as_view()),
    path("files/<str:file_id>/", file_proxy_view),
]
