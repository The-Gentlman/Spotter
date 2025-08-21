from rest_framework import serializers
from apps.trip.models import Trip
from apps.log.models import LogDay


class LogDayNestedSerializer(serializers.ModelSerializer):
    class Meta:
        model = LogDay
        fields = [
            "id",
            "service_day",
            "total_miles_driving",
            "driving",
            "on_duty",
            "off_duty",
            "sleeper",
            "cycle_remaining_hours",
            "has_violation",
            "segments",
            "recap_last_7_days",
        ]


class TripSerializer(serializers.ModelSerializer):
    driver = serializers.SerializerMethodField()
    driver_id = serializers.PrimaryKeyRelatedField(
        source="driver",
        queryset=Trip._meta.get_field("driver").remote_field.model.objects.all(),
        write_only=True,
    )
    logs = LogDayNestedSerializer(many=True, read_only=True)

    class Meta:
        model = Trip
        fields = [
            "id",
            "start_date",
            "title",
            "description",
            "end_date",
            "driver",
            "driver_id",
            "co_driver_name",
            "carrier",
            "vehicle_number",
            "trailer_number",
            "from_location",
            "from_coordinates",
            "to_location",
            "to_coordinates",
            "home_terminal_address",
            "main_office_address",
            "total_miles_today",
            "total_mileage",
            "status",
            "logs",
        ]
        read_only_fields = ["id"]

    def get_driver(self, object):
        return object.driver.full_name

    def validate_total_miles_today(self, value):
        if value < 0:
            raise serializers.ValidationError("Total miles today cannot be negative.")
        return value

    def validate_total_mileage(self, value):
        if value < 0:
            raise serializers.ValidationError("Total mileage cannot be negative.")
        return value

    def validate(self, data):
        start_date = data.get("start_date")
        end_date = data.get("end_date")

        if start_date and end_date and start_date > end_date:
            raise serializers.ValidationError(
                {"end_date": "End date must be after start date."}
            )

        if not data.get("driver"):
            raise serializers.ValidationError(
                {"driver": "Driver name is required for FMCSA logs."}
            )

        if not data.get("carrier"):
            raise serializers.ValidationError(
                {"carrier": "Carrier name is required for compliance."}
            )

        # cannot exceed 70-hour / 8-day cycle
        if hasattr(self.instance, "log_days"):
            total_hours = sum(ld.total_hours for ld in self.instance.log_days.all())
            if total_hours > 70:
                raise serializers.ValidationError(
                    {"logs": "Total hours exceed the 70-hour/8-day FMCSA limit."}
                )

        return data


class TripPatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trip
        fields = [
            "title",
            "description",
            "co_driver_name",
            "status",
            "from_location",
            "to_location",
        ]
        extra_kwargs = {
            field: {"required": False, "allow_null": True} for field in fields
        }

    def validate(self, data):
        return data

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
