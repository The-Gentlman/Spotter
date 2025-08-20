from decimal import Decimal
from rest_framework.fields import MaxLengthValidator, MinLengthValidator
from django_jsonform.models.fields import ArrayField
from simple_history.models import HistoricalRecords
from apps.account.models import User
from django.db import models


def default_positions():
    return [Decimal("0.0"), Decimal("0.0")]


class Trip(models.Model):
    class Status(models.TextChoices):
        PENDING = "PENDING", "Pending"
        IN_PROGRESS = "IN_PROGRESS", "In Progress"
        COMPLETED = "COMPLETED", "Completed"
        CANCELLED = "CANCELLED", "Cancelled"

    title = models.CharField(max_length=100, blank=True)
    description = models.TextField(blank=True)

    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)

    driver = models.ForeignKey(User, on_delete=models.CASCADE, related_name="trips")
    co_driver_name = models.CharField(max_length=128, blank=True)
    carrier = models.CharField(max_length=128, blank=True)
    vehicle_number = models.CharField(max_length=64, blank=True)
    trailer_number = models.CharField(max_length=64, blank=True)

    from_location = models.CharField(max_length=255, blank=True)
    from_coordinates = ArrayField(
        models.DecimalField(max_digits=20, decimal_places=16),
        size=2,
        validators=[MinLengthValidator(2), MaxLengthValidator(2)],
        default=default_positions,
    )
    to_location = models.CharField(max_length=255, blank=True)
    to_coordinates = ArrayField(
        models.DecimalField(max_digits=20, decimal_places=16),
        size=2,
        validators=[MinLengthValidator(2), MaxLengthValidator(2)],
        default=default_positions,
    )
    total_miles_today = models.PositiveIntegerField(default=0)
    total_mileage = models.PositiveIntegerField(default=0)

    home_terminal_address = models.CharField(max_length=255, blank=True)
    main_office_address = models.CharField(max_length=255, blank=True)

    status = models.CharField(
        max_length=32, choices=Status.choices, default=Status.PENDING
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_deleted = models.BooleanField(default=False)

    history = HistoricalRecords()

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Trip {self.id} - {self.driver}"
