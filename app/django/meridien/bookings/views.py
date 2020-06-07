from bookings.models import Booking
from bookings.serializers import BookingSerializer

import sys
sys.path.append('../')
from meridien import views_template

def booking_list(request):
    return views_template.obj_list(request, Booking, BookingSerializer)

def booking_detail(request, pk):
    return views_template.obj_detail(request, pk, Booking, BookingSerializer)