from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.contrib.auth.models import Group
from django.core.exceptions import ValidationError
from django.db import models
from django.utils.deconstruct import deconstructible


class Role(models.TextChoices):
    CEO = "CEO"
    ADMIN = "ADMIN"
    DRIVER = "DRIVER"


@deconstructible
class GroupMembershipValidator:
    def __init__(self, group_name) -> None:
        self.group_name = group_name

    def __call__(self, value):
        try:
            # _ = Group.objects.get(name=group_name)
            user = User.objects.filter(
                id=value if isinstance(value, int) else value.id,
                groups__name=self.group_name,
            ).exists()
            if not user:
                raise ValidationError(
                    f"The selected user must belong to the {self.group_name} group."
                )
        except Group.DoesNotExist as exc:
            raise ValidationError(
                f"The group '{self.group_name}' does not exist."
            ) from exc

    def __eq__(self, __value: object) -> bool:
        return (
            isinstance(__value, GroupMembershipValidator)
            and self.group_name == __value.group_name
        )


class AppUserManager(BaseUserManager):
    use_in_migrations = True

    def _create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError("The given email must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self._create_user(email, password, **extra_fields)

    def create_user(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_superuser", False)
        extra_fields["is_active"] = True
        groups = extra_fields.pop("groups", [])
        user = self._create_user(email, password, **extra_fields)
        if groups:
            user.groups.set(groups)
        return user

    def get_queryset(self):
        return super().get_queryset().filter(is_active=True)


class User(AbstractUser):
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    email = models.EmailField(max_length=50, unique=True)
    phone_number = models.CharField(max_length=20, null=True, blank=True, unique=True)
    username = models.CharField(max_length=150, blank=True, null=True)
    USERNAME_FIELD = "email"

    REQUIRED_FIELDS = []

    objects = AppUserManager()

    def __str__(self):
        return str(self.email)

    @property
    def full_name(self):
        return " ".join([self.first_name or "", self.last_name or ""])

    def has_group(self, group: Role):
        return self.is_superuser or self.groups.filter(name=group).exists()

    def has_groups(self, groups: list[Role]):
        return self.is_superuser or self.groups.filter(name__in=groups).exists()

    @property
    def group_names(self):
        return list(self.groups.values_list("name", flat=True))
