from django.conf import settings
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import exception_handler


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)
    if response is None:
        message = "Unexpected server error."
        if settings.DEBUG:
            message = f"{exc.__class__.__name__}: {exc}"
        return Response(
            {"success": False, "error": {"code": "SERVER_500", "message": message, "field_errors": {}}},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    field_errors = {}
    message = "Request failed."
    if isinstance(response.data, dict):
        if "detail" in response.data:
            message = str(response.data["detail"])
        else:
            field_errors = response.data
            message = "Validation failed."

    response.data = {
        "success": False,
        "error": {
            "code": f"HTTP_{response.status_code}",
            "message": message,
            "field_errors": field_errors,
        },
    }
    return response
