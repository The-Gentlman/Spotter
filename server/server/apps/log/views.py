from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import GenericAPIView
from apps.log.serializers import LogDaySerializer
from rest_framework.response import Response
from apps.log.models import LogDay
from rest_framework import status
from apps.log.filters import LogDayFilter


class LogsView(GenericAPIView):
    permission_classes = [IsAuthenticated]
    permission_groups = {
        "GET": ["_Public"],
    }
    serializer_class = LogDaySerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = LogDayFilter

    def get(self, request):
        trip_id = request.query_params.get("trip_id")
        queryset = LogDay.objects.for_trip(trip_id).order_by("-service_day")
        for backend in list(self.filter_backends):
            queryset = backend().filter_queryset(self.request, queryset, self)

        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            log = serializer.save()
            return Response(
                self.serializer_class(log).data, status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogDetailView(GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = LogDaySerializer
    lookup_field = "id"

    def get_queryset(self):
        return LogDay.objects.all()

    def get(self, request, id):
        log = self.get_queryset().filter(id=id).first()
        if not log:
            return Response(
                {"detail": "Log not found."}, status=status.HTTP_404_NOT_FOUND
            )
        return Response(self.serializer_class(log).data, status=status.HTTP_200_OK)

    def put(self, request, id):
        log = self.get_queryset().filter(id=id).first()
        if not log:
            return Response(
                {"detail": "Log not found."}, status=status.HTTP_404_NOT_FOUND
            )
        serializer = self.serializer_class(log, data=request.data)
        if serializer.is_valid():
            log = serializer.save()
            return Response(self.serializer_class(log).data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, id):
        log = self.get_queryset().filter(id=id).first()
        if not log:
            return Response(
                {"detail": "Log not found."}, status=status.HTTP_404_NOT_FOUND
            )
        serializer = self.serializer_class(log, data=request.data, partial=True)
        if serializer.is_valid():
            log = serializer.save()
            return Response(self.serializer_class(log).data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
