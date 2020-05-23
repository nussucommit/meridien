from rest_framework import serializers
from bookings.models import *
from items.serializers import BookedItemSerializer

class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        booked_items = BookedItemSerializer(many=True)
        model = Booking
        fields = '__all__'

class PersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = '__all__'