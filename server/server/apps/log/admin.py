from django.contrib import admin
from apps.log.models import LogDay


@admin.register(LogDay)
class LogDayAdmin(admin.ModelAdmin):
    list_display = (
        "service_day",
        "trip",
        "total_miles_driving",
        "driving_hr",
        "on_duty_hr",
        "off_duty_hr",
        "sleeper_hr",
        "cycle_remaining_hours",
        "has_violation",
    )
    list_filter = ("service_day", "trip__driver")
    search_fields = (
        "trip__driver",
        "trip__co_driver",
        "shipping_doc_number",
        "shipper",
        "commodity",
    )
    ordering = ("-service_day",)
    date_hierarchy = "service_day"
    readonly_fields = ("total_hours", "has_violation")

    fieldsets = (
        (
            "Daily Log",
            {
                "fields": (
                    "trip",
                    "service_day",
                    "remarks",
                    "driver_signature",
                )
            },
        ),
        (
            "Shipping",
            {
                "fields": (
                    "shipping_doc_number",
                    "shipper",
                    "commodity",
                )
            },
        ),
        (
            "Duty Status Totals (minutes)",
            {
                "fields": (
                    "driving",
                    "on_duty",
                    "off_duty",
                    "sleeper",
                    "total_hours",
                    "cycle_remaining_hours",
                    "has_violation",
                )
            },
        ),
        (
            "Segments / Recap",
            {
                "classes": ("collapse",),
                "fields": (
                    "segments",
                    "recap_last_7_days",
                ),
            },
        ),
    )

    def driving_hr(self, obj):
        return round(obj.driving / 60, 2)

    driving_hr.short_description = "Driving (hrs)"

    def on_duty_hr(self, obj):
        return round(obj.on_duty / 60, 2)

    on_duty_hr.short_description = "On Duty (hrs)"

    def off_duty_hr(self, obj):
        return round(obj.off_duty / 60, 2)

    off_duty_hr.short_description = "Off Duty (hrs)"

    def sleeper_hr(self, obj):
        return round(obj.sleeper / 60, 2)

    sleeper_hr.short_description = "Sleeper (hrs)"
