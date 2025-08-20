from django_filters import rest_framework as filters
from apps.log.models import LogDay


class LogDayFilter(filters.FilterSet):
    service_day_after = filters.DateFilter(
        field_name="service_day", lookup_expr="gte", label="Service day after"
    )
    service_day_before = filters.DateFilter(
        field_name="service_day", lookup_expr="lte", label="Service day before"
    )
    trip = filters.UUIDFilter(field_name="trip__id")
    driver = filters.CharFilter(
        field_name="trip__driver_name__username",
        lookup_expr="icontains",
        label="Driver username",
    )

    class Meta:
        model = LogDay
        fields = [
            "trip",
            "service_day",
            "service_day_after",
            "service_day_before",
            "driver",
        ]
