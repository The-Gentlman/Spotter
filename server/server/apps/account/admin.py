from django.contrib import admin
from django.contrib.auth.models import Permission
from django.contrib.auth.admin import UserAdmin
from django.utils.translation import gettext_lazy as _
from apps.account.forms import UserChangeForm, UserCreationForm
from apps.account.models import User


admin.site.register(Permission)


@admin.register(User)
class AppUserAdmin(UserAdmin):
    permissions = True
    ordering = ("-date_joined",)
    search_fields = ("first_name", "last_name", "email,")
    fieldsets = (
        (None, {"fields": ("email", "password")}),
        (
            _("Personal info"),
            {
                "fields": (
                    "first_name",
                    "last_name",
                    "phone_number",
                )
            },
        ),
        (
            _("Permissions"),
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                ),
            },
        ),
        (_("Important dates"), {"fields": ("last_login", "date_joined")}),
    )
    form = UserChangeForm
    add_form = UserCreationForm

    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": (
                    "email",
                    "password",
                    "first_name",
                    "last_name",
                    "phone_number",
                    "groups",
                    "is_active",
                    "is_staff",
                    "is_superuser",
                ),
            },
        ),
    )

    def group(self, user):
        groups = []
        for group in user.groups.all():
            groups.append(group.name)
        return "-".join(groups)

    group.short_description = "Groups"
    list_display = (
        "id",
        "email",
        "first_name",
        "last_name",
        "phone_number",
        "group",
        "is_active",
        "is_superuser",
    )
