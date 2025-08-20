from rest_framework import serializers
from apps.account.models import User


class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "birthday",
            "gender",
            "phone_number",
        ]


class UserSerializer(serializers.ModelSerializer):
    groups = serializers.SerializerMethodField()
    is_admin = serializers.SerializerMethodField()
    first_name = serializers.SerializerMethodField()
    last_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = "__all__"

    def get_first_name(self, obj):
        return obj.first_name_fa or obj.first_name

    def get_last_name(self, obj):
        return obj.last_name_fa or obj.last_name

    def to_representation(self, instance):
        data = super().to_representation(instance)
        return {key: value for key, value in data.items() if value is not None}

    def get_groups(self, instance):
        return [group.name for group in instance.groups.all()]

    def get_is_admin(self, instance):
        return instance.is_active and instance.is_superuser


class UserShortSerializer(serializers.ModelSerializer):
    first_name = serializers.SerializerMethodField()
    last_name = serializers.SerializerMethodField()

    def get_first_name(self, obj):
        return obj.first_name_fa or obj.first_name

    def get_last_name(self, obj):
        return obj.last_name_fa or obj.last_name

    class Meta:
        model = User
        fields = (
            "id",
            "first_name",
            "last_name",
            "full_name",
            "gender",
            "birthday",
        )


class UserNameSerializer(serializers.ModelSerializer):
    first_name = serializers.SerializerMethodField()
    last_name = serializers.SerializerMethodField()

    def get_first_name(self, obj):
        return obj.first_name_fa

    def get_last_name(self, obj):
        return obj.last_name_fa

    class Meta:
        model = User
        fields = (
            "first_name",
            "last_name",
        )


class UserResponseSerializer(UserSerializer):
    class Meta(UserSerializer.Meta):
        fields = [
            "id",
            "first_name",
            "last_name",
            "email",
            "phone_number",
            "groups",
            "is_admin",
        ]


class ReplaceDashField(serializers.CharField):
    def to_representation(self, value):
        if value is not None:
            return value.replace("-", "", 2)
        return value

    def to_internal_value(self, data):
        if data is not None:
            return data.replace("-", "", 2)
        return data
