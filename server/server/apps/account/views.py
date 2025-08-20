from apps.account.serializers import (
    UserResponseSerializer,
    UserShortSerializer,
    UserUpdateSerializer,
)
from rest_framework.permissions import BasePermission, IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth.hashers import check_password
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from apps.account.models import User
from django.shortcuts import get_object_or_404


class UserMatchPermission(BasePermission):
    def has_permission(self, request, view):
        user_id = view.kwargs.get("user_id")
        return str(request.user.id) == str(user_id)


class UserSearchApi(APIView):

    def get(self, request):
        users = User.objects.all()
        serializer = UserShortSerializer(users, many=True)
        return Response(serializer.data)


class UserAPI(APIView):
    permission_classes = [IsAuthenticated, UserMatchPermission]

    def get(self, request, user_id):
        user = get_object_or_404(User, id=user_id)
        serializer = UserResponseSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, user_id):
        user = get_object_or_404(User, id=user_id)
        old_password = request.data.get("old_password")
        new_password = request.data.get("new_password")
        if not check_password(old_password, user.password):
            return Response(
                {"message": "Old password is incorrect"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        user.set_password(new_password)
        user.save()
        return Response(
            {"message": "Password changed successfully"},
            status=status.HTTP_200_OK,
        )

    def put(self, request, user_id):
        user = get_object_or_404(User, id=user_id)
        data = request.data.copy()
        data.pop("role", None)
        serializer = UserUpdateSerializer(user, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_session(request):
    serializer = UserResponseSerializer(request.user)
    return Response(serializer.data)
