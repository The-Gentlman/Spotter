from rest_framework import serializers
from apps.file.models import File


class FileBaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = "__all__"

    def to_representation(self, instance):
        data = super().to_representation(instance)
        return {key: value for key, value in data.items() if value is not None}


class FileSerializer(FileBaseSerializer):
    pass
