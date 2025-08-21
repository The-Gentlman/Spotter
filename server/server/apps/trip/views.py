from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import GenericAPIView
from apps.trip.serializers import TripPatchSerializer, TripSerializer
from rest_framework.response import Response
from rest_framework import status
from apps.trip.models import Trip
from apps.trip.filters import TripFilter


class TripsView(GenericAPIView):
    # permission_classes = [IsAuthenticated]
    serializer_class = TripSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = TripFilter

    def get_queryset(self):
        return (
            Trip.objects.all()
            .select_related("driver")
            .prefetch_related("logs")
            .order_by("-start_date")
        )

    def get(self, request):
        queryset = self.get_queryset()

        for backend in list(self.filter_backends):
            queryset = backend().filter_queryset(self.request, queryset, self)

        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        data = request.data
        serializer = self.serializer_class(data=data)
        if serializer.is_valid():
            trip = serializer.save()
            trip = (
                Trip.objects.select_related("driver")
                .prefetch_related("logs")
                .get(id=trip.id)
            )
            return Response(
                self.serializer_class(trip).data,
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TripDetailView(GenericAPIView):
    # permission_classes = [IsAuthenticated]
    serializer_class = TripSerializer
    lookup_field = "id"

    def get_queryset(self):
        return Trip.objects.all().select_related("driver").prefetch_related("logs")

    def get(self, request, id):
        trip = self.get_queryset().filter(id=id).first()
        if not trip:
            return Response(
                {"detail": "Trip not found."}, status=status.HTTP_404_NOT_FOUND
            )
        serializer = self.serializer_class(trip)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request, id):
        trip = self.get_queryset().filter(id=id).first()
        if not trip:
            return Response(
                {"detail": "Trip not found."}, status=status.HTTP_404_NOT_FOUND
            )
        serializer = TripPatchSerializer(trip, data=request.data, partial=True)
        if serializer.is_valid():
            trip = serializer.update(trip, serializer.validated_data)
            return Response(self.serializer_class(trip).data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id):
        trip = self.get_queryset().filter(id=id).first()
        if not trip:
            return Response(
                {"detail": "Trip not found."}, status=status.HTTP_404_NOT_FOUND
            )
        trip.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
