from django.apps import AppConfig


class AccountConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.account"
    verbose_name = "1. Accounts"

    def ready(self):
        import apps.account.signals  # noqa # pylint: disable=C0415,W0611
