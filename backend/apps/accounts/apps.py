from django.apps import AppConfig


class AccountsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.accounts"

    def ready(self):
        try:
            from .demo import ensure_demo_users

            ensure_demo_users()
        except Exception:
            pass
