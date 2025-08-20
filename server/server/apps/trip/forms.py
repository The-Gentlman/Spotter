from django import forms
from apps.trip.models import Trip


class TripAdminForm(forms.ModelForm):
    from_coordinates = forms.CharField(required=False)
    to_coordinates = forms.CharField(required=False)

    class Meta:
        model = Trip
        fields = "__all__"

    def clean_from_coordinates(self):
        value = self.cleaned_data["from_coordinates"]
        try:
            return [float(x) for x in value.strip("[]").split(",")]
        except Exception:
            return []

    def clean_to_coordinates(self):
        value = self.cleaned_data["to_coordinates"]
        try:
            return [float(x) for x in value.strip("[]").split(",")]
        except Exception:
            return []
