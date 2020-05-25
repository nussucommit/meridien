from rest_framework import serializers
from bookings.models import *

class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = '__all__'