from rest_framework import status
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.file.serializers import FileSerializer

# Create your views here.


class FilesAPI(GenericAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data
        data["user"] = request.user.id
        serializer = FileSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        file = serializer.save()
        return Response(
            {
                "message": "done",
                "id": file.id,
                "file": str(file.file).replace("temp/", "uploads/files/"),
            },
            status=status.HTTP_201_CREATED,
        )
