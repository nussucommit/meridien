import json

from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from bookings.models import Booking
from bookings.serializers import BookingSerializer
from confirmationemails.templates import send_confirmation_email

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
            send_confirmation_email(json.loads(response.content))
            return response
    else:
        return response


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
@csrf_exempt
def booking_detail(request, pk):
    return views_template.obj_detail(request, pk, Booking, BookingSerializer)