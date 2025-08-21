from django.urls import path
from apps.file.views import FilesAPI

# api/v1/uploads
urlpatterns = [
    path("/upload", FilesAPI.as_view(), name="files"),
]
