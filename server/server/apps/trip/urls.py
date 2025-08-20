from django.urls import path
from . import views

urlpatterns = [
    path("", views.TripsView.as_view(), name="trip"),
    path("<int:id>/", views.TripDetailView.as_view(), name="trip"),
]
