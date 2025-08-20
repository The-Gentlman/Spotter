from django.urls import path
from . import views

urlpatterns = [
    path("/logs/<int:trip_id>", views.LogDetailView.as_view(), name="user"),
    path("", views.LogsView.as_view(), name="logs"),
]
