from django.http.response import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.parsers import JSONParser
from rest_framework.permissions import IsAuthenticated

from bookings.models import Booking
from bookings.serializers import BookingSerializer
from confirmationemails.templates import send_confirmation_email
from confirmationemails.tokens import decode_token

import sys
sys.path.append('../')
from meridien import views_template


@api_view(['GET', 'POST', 'DELETE'])
@permission_classes([IsAuthenticated])
@csrf_exempt
def booking_list(request):
    response = views_template.obj_list(request, Booking, BookingSerializer)
    if request.method == 'POST':
        if response.status_code == status.HTTP_200_OK:
            send_confirmation_email(JSONParser().parse(response.content))
            return response
    else:
        return response


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
@csrf_exempt
def booking_detail(request, pk):
    return views_template.obj_detail(request, pk, Booking, BookingSerializer)


@api_view(['GET', 'DELETE'])
@csrf_exempt
def booking_detail_token(request, token):
    try:
        booking_id = decode_token(token)
    except Exception:
        return JsonResponse({"message": "Invalid token"}, status=status.HTTP_403_FORBIDDEN)
    return views_template.obj_detail(request, booking_id, Booking, BookingSerializer)


@api_view(['PATCH'])
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
