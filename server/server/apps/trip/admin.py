from django.contrib import admin
from apps.trip.models import Trip
from apps.trip.forms import TripAdminForm


@admin.register(Trip)
class TripAdmin(admin.ModelAdmin):
    form = TripAdminForm

    list_display = (
        "id",
        "driver",
        "co_driver_name",
        "carrier",
        "vehicle_number",
        "from_location",
        "to_location",
        "status",
    )

    def from_coordinates_display(self, obj):
        return [float(x) for x in obj.from_coordinates]

    def to_coordinates_display(self, obj):
        return [float(x) for x in obj.to_coordinates]

    list_filter = ("status", "carrier", "start_date")
    search_fields = (
        "driver",
        "co_driver_name",
        "carrier",
        "vehicle_number",
        "trailer_number",
        "from_location",
        "to_location",
    )
    ordering = ("-start_date",)
    date_hierarchy = "start_date"
    readonly_fields = ("id", "created_at", "updated_at")
