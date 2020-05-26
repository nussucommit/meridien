from bookings.models import Booking
from bookings.serializers import BookingSerializer
from django.views.decorators.csrf import csrf_exempt

import sys
sys.path.append('../')
from meridien import views_template

@csrf_exempt
def booking_list(request):
    return views_template.obj_list(request, Booking, BookingSerializer)

@csrf_exempt
def booking_detail(request, pk):
    return views_template.obj_detail(request, pk, Booking, BookingSerializer)