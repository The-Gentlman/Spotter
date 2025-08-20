from django_filters import rest_framework as filters
from django.db import models
from apps.account.models import User


class UserFilter(filters.FilterSet):
    search = filters.CharFilter(method="filter_search")
    groups = filters.CharFilter(method="filter_groups")

    o = filters.OrderingFilter(fields=(("id", "id")))

    def filter_search(self, queryset, _, value):
        return queryset.filter(
            models.Q(first_name__icontains=value)
            | models.Q(last_name__icontains=value)
            | models.Q(first_name_fa__icontains=value)
            | models.Q(last_name_fa__icontains=value)
        )

    def filter_groups(self, queryset, _, value):
        group_names = value.split(",") if value else []
        return queryset.filter(groups__name__in=group_names)

    class Meta:
        model = User
        fields = ["groups"]
        ordering_fields = []
