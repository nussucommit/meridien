from rest_framework import serializers
from items.models import BookedItem
from items.models import Item

from bookings.serializers import BookingSerializer
        
class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = '__all__'

class BookedItemSerializer(serializers.ModelSerializer):
    item = ItemSerializer()
    booking_source = BookingSerializer()
    class Meta:
        model = BookedItem
        fields = '__all__'