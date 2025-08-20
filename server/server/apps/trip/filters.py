from django_filters import rest_framework as filters
from .models import Trip


class TripFilter(filters.FilterSet):
    start_date_after = filters.DateFilter(
        field_name="start_date", lookup_expr="gte", label="Start date after"
    )
    start_date_before = filters.DateFilter(
        field_name="start_date", lookup_expr="lte", label="Start date before"
    )
    driver = filters.CharFilter(
        field_name="driver_name__username",
        lookup_expr="icontains",
        label="Driver username",
    )
    carrier = filters.CharFilter(
        field_name="carrier", lookup_expr="icontains", label="Carrier name"
    )
    status = filters.ChoiceFilter(choices=Trip.Status.choices)

    class Meta:
        model = Trip
        fields = [
            "status",
            "carrier",
            "driver",
            "start_date_after",
            "start_date_before",
        ]
