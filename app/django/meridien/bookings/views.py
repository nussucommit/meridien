import json
import datetime

from django.db.models import Q
from django.http.response import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status, generics, filters
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated

from bookings.models import Booking
from bookings.serializers import BookingSerializer
from confirmationemails.templates import send_confirmation_email
from confirmationemails.tokens import decode_token

from meridien import views_template
from meridien.pagination_settings import PaginationSettings

class BookingList(generics.ListAPIView):
    serializer_class = BookingSerializer
    filter_backends = [filters.OrderingFilter]
    pagination_class = PaginationSettings
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        queryset = Booking.objects.all()
        name = self.request.query_params.get('name', None)
        fromDate = self.request.query_params.get('fromDate', None)
        toDate = self.request.query_params.get('toDate', None)
        status = self.request.query_params.get('status', None)

        q = Q()
        if name and name != 'null':
            q &= Q(name__icontains=name.lower())
        if fromDate and fromDate != 'null':
            q &= Q(time_booked__gte=fromDate)
        if toDate and toDate != 'null':
            q &= Q(time_booked__lte=toDate)
        if status and status != 'null':
            q &= Q(status__icontains=status.lower())

        return queryset.filter(q)

class MakeBooking(generics.CreateAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    pagination_class = PaginationSettings
    permission_classes = ()

    def create(self, request, *args, **kwargs):
        response = views_template.obj_list(request, Booking, BookingSerializer)
        if response.status_code == status.HTTP_201_CREATED:
            send_confirmation_email(json.loads(response.content.decode("utf-8")))
        return response


class BookingDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = (IsAuthenticated,)

# nic rewrite this section pl0x
@api_view(['GET', 'DELETE'])
@authentication_classes([])
@permission_classes([])
@csrf_exempt
def booking_detail_token(request, token):
    try:
        booking_id = decode_token(token)
    except Exception:
        return JsonResponse({"message": "Invalid token"}, status=status.HTTP_403_FORBIDDEN)
    return views_template.obj_detail(request, booking_id, Booking, BookingSerializer)


@api_view(['PATCH'])
@authentication_classes([])
@permission_classes([])
@csrf_exempt
def confirm_booking_token(request, token):
    try:
        booking_id = decode_token(token)
    except Exception:
        return JsonResponse({"message": "Token not valid"}, status=status.HTTP_403_FORBIDDEN)
    booking = Booking.objects.get(pk=booking_id)
    booking.status = Booking.PENDING
    booking.save()
    return JsonResponse({"message": "Success"}, status=status.HTTP_200_OK)
