from django.urls import path
from . import views

urlpatterns = [
    path("/<int:id>", views.LogDetailView.as_view(), name="log"),
    path("", views.LogsView.as_view(), name="logs"),
]
