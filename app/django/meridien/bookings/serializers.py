from rest_framework import serializers
from bookings.models import Booking
from items.serializers import BookedItemSerializer

class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        booked_items = BookedItemSerializer(many=True)
        model = Booking
        fields = '__all__'