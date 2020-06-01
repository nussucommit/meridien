from bookings.models import Booking
from bookings.serializers import BookingSerializer
from django.views.decorators.csrf import csrf_exempt

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

import sys
sys.path.append('../')
from meridien import views_template

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@csrf_exempt
def booking_list(request):
    return views_template.obj_list(request, Booking, BookingSerializer)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@csrf_exempt
def booking_detail(request, pk):
    return views_template.obj_detail(request, pk, Booking, BookingSerializer)