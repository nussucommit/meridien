from django.http import JsonResponse
from django.shortcuts import render

from bookings.models import Booking
from bookings.serializers import BookingSerializer

# Create your views here.
def booking_list(request):
    if request.method == 'GET':
        bookings = Booking.objects.all()
        bookings_serializer = BookingSerializer(bookings, many=True)
        return JsonResponse({'booking_list': bookings_serializer.data})