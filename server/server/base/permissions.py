"""Usage Example

permission_classes = [HasGroupPermission]
permission_groups = {
    'create': ['Developers'] # POST
    'partial_update': ['Designers','Developers'],  # PATCH
    'retrieve': ['_Public'], # GET
}
"""

from django.contrib.auth.models import Group
from rest_framework import permissions


def is_in_group(user, group_name):
    try:
        return Group.objects.get(name=group_name).user_set.filter(id=user.id).exists()
    except Group.DoesNotExist:
        return False


class HasGroupPermission(permissions.BasePermission):
    message = "you don't have permission to perform this action"

    def has_permission(self, request, view):
        if not isinstance(view, dict):
            required_groups = view.permission_groups.get(request.method)
        else:
            required_groups = view.get(request.method)

        if request.user and request.user.is_superuser:
            return True
        if required_groups is None:
            return False
        if "_Public" in required_groups:
            return True

        return any(
            (is_in_group(request.user, group_name) for group_name in required_groups)
        )
