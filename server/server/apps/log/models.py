from datetime import datetime
from decimal import Decimal
from django.utils.functional import cached_property
from apps.trip.models import Trip
from django.utils import timezone
from django.db import models
from django.utils.timezone import make_aware


class LogManager(models.Manager):
    def for_trip(self, trip_id):
        return self.filter(trip_id=trip_id).order_by("-service_day")


class LogDay(models.Model):
    SEGMENT_STATUSES = [
        ("OFF_DUTY", "Off Duty"),
        ("SLEEPER", "Sleeper Berth"),
        ("DRIVING", "Driving"),
        ("ON_DUTY", "On Duty (not driving)"),
    ]

    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name="logs")
    service_day = models.DateField(default=timezone.now)

    total_miles_driving = models.PositiveIntegerField(default=0)
    total_mileage = models.PositiveIntegerField(default=0)

    shipping_doc_number = models.CharField(max_length=128, blank=True)
    shipper = models.CharField(max_length=128, blank=True)
    commodity = models.CharField(max_length=128, blank=True)

    remarks = models.TextField(blank=True)
    driver_signature = models.CharField(max_length=256, blank=True)

    # Totals (minutes)
    off_duty = models.PositiveIntegerField(default=0)
    sleeper = models.PositiveIntegerField(default=0)
    driving = models.PositiveIntegerField(default=0)
    on_duty = models.PositiveIntegerField(default=0)

    cycle_remaining_hours = models.DecimalField(
        max_digits=5, decimal_places=2, default=70.0
    )

    segments = models.JSONField(default=list)
    recap_last_7_days = models.JSONField(default=list)

    objects = LogManager()

    class Meta:
        ordering = ["service_day"]

    def __str__(self):
        return f"Log {self.service_day} for Trip {self.trip_id}"

    # --- Helpers ---
    @cached_property
    def total_minutes(self):
        return self.off_duty + self.sleeper + self.driving + self.on_duty

    @cached_property
    def total_hours(self):
        return round(self.total_minutes / 60, 2)

    @property
    def has_violation(self):
        return (self.driving > 11 * 60) or (self.driving + self.on_duty > 14 * 60)

    @property
    def summary(self):
        return {
            "date": self.service_day.isoformat(),
            "driving_hr": self.driving / 60,
            "on_duty_hr": self.on_duty / 60,
            "off_duty_hr": self.off_duty / 60,
            "sleeper_hr": self.sleeper / 60,
            "cycle_remaining_hr": float(self.cycle_remaining_hours),
        }

    def recalc_totals(self):
        """Recalculate duty status totals from segments."""
        totals = {"OFF_DUTY": 0, "SLEEPER": 0, "DRIVING": 0, "ON_DUTY": 0}

        for seg in self.segments or []:
            try:
                start = datetime.fromisoformat(seg["start"].replace("Z", "+00:00"))
                if not start.tzinfo:
                    start = make_aware(start)
                if seg.get("end"):
                    end = datetime.fromisoformat(seg["end"].replace("Z", "+00:00"))
                    if not end.tzinfo:
                        end = make_aware(end)
                else:
                    end = make_aware(datetime.utcnow())
            except (ValueError, KeyError):
                continue

            minutes = max(0, int((end - start).total_seconds() / 60))
            if seg["status"] in totals:
                totals[seg["status"]] += minutes

        self.off_duty = totals["OFF_DUTY"]
        self.sleeper = totals["SLEEPER"]
        self.driving = totals["DRIVING"]
        self.on_duty = totals["ON_DUTY"]
        self.cycle_remaining_hours = self.calc_cycle_remaining()

    def check_violation(self):
        """Basic FMCSA violation checks."""
        if self.driving > 11 * 60:
            return True
        if (self.driving + self.on_duty) > 14 * 60:
            return True
        return False

    @property
    def has_violation(self):
        return (self.driving > 11 * 60) or (self.driving + self.on_duty > 14 * 60)

    def calc_cycle_remaining(self):
        """Example: 70/8 cycle remaining."""
        total_last_8_days = sum(
            day.get("on_duty", 0) for day in self.recap_last_7_days or []
        )
        remaining = max(0, (70 * 60) - total_last_8_days) / 60
        return Decimal(str(round(remaining, 2)))
