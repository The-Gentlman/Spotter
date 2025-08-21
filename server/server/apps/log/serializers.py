from rest_framework import serializers
from .models import LogDay


class LogDaySerializer(serializers.ModelSerializer):
    class Meta:
        model = LogDay
        fields = [
            "id",
            "trip",
            "service_day",
            "total_miles_driving",
            "total_mileage",
            "shipping_doc_number",
            "shipper",
            "commodity",
            "remarks",
            "driver_signature",
            "off_duty",
            "sleeper",
            "driving",
            "on_duty",
            "cycle_remaining_hours",
            "segments",
            "recap_last_7_days",
        ]
        read_only_fields = ["id"]

    def validate_total_miles_driving(self, value):
        if value < 0:
            raise serializers.ValidationError("Total miles driving cannot be negative.")
        return value

    def validate_total_mileage(self, value):
        if value < 0:
            raise serializers.ValidationError("Total mileage cannot be negative.")
        return value

    def validate_off_duty(self, value):
        if value < 0:
            raise serializers.ValidationError("Off-duty minutes cannot be negative.")
        return value

    def validate_sleeper(self, value):
        if value < 0:
            raise serializers.ValidationError("Sleeper minutes cannot be negative.")
        return value

    def validate_driving(self, value):
        if value < 0:
            raise serializers.ValidationError("Driving minutes cannot be negative.")
        if value > 11 * 60:
            raise serializers.ValidationError(
                "Driving time exceeds 11-hour FMCSA limit."
            )
        return value

    def validate_on_duty(self, value):
        if value < 0:
            raise serializers.ValidationError("On-duty minutes cannot be negative.")
        return value

    def validate(self, data):
        total_minutes = (
            data.get("off_duty", 0)
            + data.get("sleeper", 0)
            + data.get("driving", 0)
            + data.get("on_duty", 0)
        )
        if total_minutes > 24 * 60:
            raise serializers.ValidationError(
                {"total": "Total duty status minutes cannot exceed 24 hours."}
            )

        if data.get("driving", 0) + data.get("on_duty", 0) > 14 * 60:
            raise serializers.ValidationError(
                {"hos": "On-duty + driving exceeds 14-hour (TOLD limit)."}
            )

        return data

    def update(self, instance, validated_data):
        if "segments" in validated_data:
            instance.segments = validated_data["segments"]
            instance.recalc_totals()
        return super().update(instance, validated_data)
