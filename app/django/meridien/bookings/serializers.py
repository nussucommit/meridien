from rest_framework import serializers
from bookings.models import Booking

from items.serializers import BookedItemSerializer

class BookingSerializer(serializers.ModelSerializer):
    booked_items = BookedItemSerializer(many=True)
    class Meta:
        model = Booking
        fields = '__all__'